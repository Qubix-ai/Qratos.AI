import { supabase } from "./supabase";

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isNew?: boolean;
  isDailyLimit?: boolean;
  challengeResult?: {
    shareSlug: string;
    overallScore: number;
    [key: string]: any;
  } | null;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export const SESSIONS_UPDATED_EVENT = "murgii_chat_sessions_updated";

/**
 * Checks if a string is a valid UUID v4
 */
export function isUuid(id: string): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

/**
 * Generates a valid UUID v4 string
 */
export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Auto-generates a clean, concise title from the user's first prompt message.
 */
export function generateTitleFromMessage(content: string): string {
  if (!content) return "New Conversation";
  
  let clean = content
    .replace(/^#+\s+/g, "")
    .replace(/^[\*\-\•]\s+/g, "")
    .replace(/[\*\_\`\~]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (clean.length > 36) {
    clean = clean.substring(0, 36).trim() + "...";
  }
  
  return clean || "New Conversation";
}

/**
 * Dispatches an event across the window so all components refresh instantly.
 */
export function notifySessionsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SESSIONS_UPDATED_EVENT));
  }
}

/**
 * Encodes challengeResult into content if present.
 */
function encodeMessageContent(msg: ChatMessage): string {
  let text = msg.content || "";
  if (msg.challengeResult && typeof msg.challengeResult === "object") {
    text += `\n\n<!--CHALLENGE_RESULT:${JSON.stringify(msg.challengeResult)}-->`;
  }
  return text;
}

/**
 * Decodes message content and extracts challengeResult if embedded.
 */
function decodeMessageContent(rawContent: string): { content: string; challengeResult: any | null } {
  if (!rawContent) return { content: "", challengeResult: null };
  let content = rawContent;
  let challengeResult: any | null = null;

  const match = content.match(/<!--CHALLENGE_RESULT:(.*?)-->/s);
  if (match) {
    try {
      challengeResult = JSON.parse(match[1]);
    } catch (e) {
      console.warn("[Supabase Chat] Failed to parse embedded challengeResult JSON:", e);
    }
    content = content.replace(/<!--CHALLENGE_RESULT:(.*?)-->/s, "").trim();
  }

  return { content, challengeResult };
}

/**
 * Loads all chat sessions for a user directly from Supabase chat_sessions table as authoritative single source of truth.
 */
export async function loadUserSessions(userId: string): Promise<ChatSession[]> {
  if (!userId) {
    console.warn("[Supabase Chat] loadUserSessions called without userId");
    return [];
  }

  console.log("[Supabase Chat] Querying chat_sessions for user_id:", userId);
  try {
    const { data: sessionRows, error: sessionErr } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (sessionErr) {
      console.error("[Supabase Chat Error] Failed to fetch chat_sessions from Supabase:", sessionErr.message || sessionErr);
      return [];
    }

    if (!Array.isArray(sessionRows)) {
      console.log("[Supabase Chat] No session rows returned for user:", userId);
      return [];
    }

    console.log(`[Supabase Chat] Successfully retrieved ${sessionRows.length} sessions from chat_sessions table.`);

    const sessions: ChatSession[] = sessionRows.map((row: any) => ({
      id: row.id,
      userId: row.user_id || userId,
      title: row.title || "New Conversation",
      isPinned: Boolean(row.is_pinned),
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
      messages: [],
    }));

    return sessions.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  } catch (err) {
    console.error("[Supabase Chat Error] Unexpected exception loading user sessions:", err);
    return [];
  }
}

/**
 * Fetches a single chat session with its full message history fresh from Supabase.
 */
export async function getSessionById(userId: string, sessionId: string): Promise<ChatSession | null> {
  if (!userId || !sessionId) return null;

  console.log(`[Supabase Chat] Fetching session details fresh from Supabase for session_id: ${sessionId}`);
  try {
    // 1. Fetch session row from chat_sessions
    const { data: sessionData, error: sessionErr } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (sessionErr) {
      console.error("[Supabase Chat Error] Failed to fetch session row from chat_sessions:", sessionErr.message || sessionErr);
      return null;
    }

    if (!sessionData) {
      console.warn(`[Supabase Chat Warning] Session ${sessionId} not found in chat_sessions table.`);
      return null;
    }

    // 2. Fetch messages fresh from chat_messages table
    const { data: messageRows, error: msgErr } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (msgErr) {
      console.error(`[Supabase Chat Error] Failed to fetch messages from chat_messages for session ${sessionId}:`, msgErr.message || msgErr);
    }

    const messages: ChatMessage[] = Array.isArray(messageRows)
      ? messageRows.map((msgRow: any) => {
          const { content, challengeResult } = decodeMessageContent(msgRow.content || "");
          return {
            id: msgRow.id,
            role: msgRow.role,
            content,
            timestamp: msgRow.created_at,
            challengeResult,
          };
        })
      : [];

    console.log(`[Supabase Chat] Loaded session ${sessionId} with ${messages.length} messages fresh from Supabase.`);

    return {
      id: sessionData.id,
      userId: sessionData.user_id || userId,
      title: sessionData.title || "New Conversation",
      isPinned: Boolean(sessionData.is_pinned),
      createdAt: sessionData.created_at || new Date().toISOString(),
      updatedAt: sessionData.updated_at || new Date().toISOString(),
      messages,
    };
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in getSessionById:", err);
    return null;
  }
}

/**
 * Ensures a chat session exists in the Supabase chat_sessions table.
 */
export async function ensureSessionExists(userId: string, sessionId: string, title?: string): Promise<boolean> {
  if (!userId || !sessionId) return false;

  const validSessionId = isUuid(sessionId) ? sessionId : generateUuid();
  const now = new Date().toISOString();

  console.log(`[Supabase Chat] Ensuring session row exists in chat_sessions: ${validSessionId}`);

  try {
    const payload = {
      id: validSessionId,
      user_id: userId,
      title: title || "New Conversation",
      created_at: now,
      updated_at: now,
    };

    const { error } = await supabase.from("chat_sessions").upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("[Supabase Chat Error] Error inserting/upserting chat_sessions row:", error.message || error);
      return false;
    }

    console.log(`[Supabase Chat] Successfully ensured chat_sessions row: ${validSessionId}`);
    return true;
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in ensureSessionExists:", err);
    return false;
  }
}

/**
 * Inserts a single chat message directly into Supabase chat_messages table and updates session timestamp.
 */
export async function saveSingleMessage(userId: string, sessionId: string, message: ChatMessage, sessionTitle?: string): Promise<boolean> {
  if (!userId || !sessionId) return false;

  const validSessionId = isUuid(sessionId) ? sessionId : generateUuid();
  const validMessageId = message.id && isUuid(message.id) ? message.id : generateUuid();
  const now = message.timestamp || new Date().toISOString();

  // 1. Ensure the parent chat_sessions row exists
  await ensureSessionExists(userId, validSessionId, sessionTitle);

  // 2. Insert message into chat_messages
  console.log(`[Supabase Chat] Inserting message (${message.role}) into chat_messages for session: ${validSessionId}`);
  try {
    const messagePayload = {
      id: validMessageId,
      session_id: validSessionId,
      user_id: userId,
      role: message.role,
      content: encodeMessageContent(message),
      created_at: now,
    };

    const { error: msgErr } = await supabase.from("chat_messages").upsert(messagePayload, { onConflict: "id" });

    if (msgErr) {
      console.error("[Supabase Chat Error] Error inserting into chat_messages:", msgErr.message || msgErr);
      return false;
    }

    console.log(`[Supabase Chat] Successfully saved message ${validMessageId} into chat_messages table.`);

    // 3. Update parent session updated_at timestamp
    const { error: sessionUpdateErr } = await supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString(), title: sessionTitle || undefined })
      .eq("id", validSessionId)
      .eq("user_id", userId);

    if (sessionUpdateErr) {
      console.warn("[Supabase Chat Warning] Could not update session updated_at timestamp:", sessionUpdateErr.message || sessionUpdateErr);
    }

    notifySessionsChanged();
    return true;
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in saveSingleMessage:", err);
    return false;
  }
}

/**
 * Saves or updates a full chat session in Supabase.
 */
export async function saveSession(userId: string, session: ChatSession): Promise<ChatSession[]> {
  if (!userId || !session.id) return [];

  const validSessionId = isUuid(session.id) ? session.id : generateUuid();
  const now = new Date().toISOString();

  console.log(`[Supabase Chat] Saving full session ${validSessionId} to Supabase...`);

  // 1. Upsert session row into chat_sessions table
  try {
    const sessionPayload = {
      id: validSessionId,
      user_id: userId,
      title: session.title || "New Conversation",
      created_at: session.createdAt || now,
      updated_at: session.updatedAt || now,
    };

    const { error: sessionErr } = await supabase.from("chat_sessions").upsert(sessionPayload, { onConflict: "id" });

    if (sessionErr) {
      console.error("[Supabase Chat Error] Error upserting chat_sessions row:", sessionErr.message || sessionErr);
    } else {
      console.log(`[Supabase Chat] Successfully saved chat_session row: ${validSessionId}`);
    }
  } catch (err) {
    console.error("[Supabase Chat Error] Network/execution error saving chat_session:", err);
  }

  // 2. Insert messages into chat_messages table
  if (Array.isArray(session.messages) && session.messages.length > 0) {
    try {
      const messageRows = session.messages.map((msg) => {
        const msgId = msg.id && isUuid(msg.id) ? msg.id : generateUuid();
        return {
          id: msgId,
          session_id: validSessionId,
          user_id: userId,
          role: msg.role,
          content: encodeMessageContent(msg),
          created_at: msg.timestamp || now,
        };
      });

      const { error: msgErr } = await supabase.from("chat_messages").upsert(messageRows, { onConflict: "id" });

      if (msgErr) {
        console.error("[Supabase Chat Error] Error upserting chat_messages rows:", msgErr.message || msgErr);
      } else {
        console.log(`[Supabase Chat] Successfully saved ${messageRows.length} messages to chat_messages table.`);
      }
    } catch (err) {
      console.error("[Supabase Chat Error] Exception upserting messages to chat_messages:", err);
    }
  }

  // 3. Immediately re-fetch full session list from Supabase
  const freshSessions = await loadUserSessions(userId);

  // 4. Notify listeners
  notifySessionsChanged();

  return freshSessions;
}

/**
 * Renames a chat session in Supabase and re-fetches the fresh list.
 */
export async function renameSession(userId: string, sessionId: string, newTitle: string): Promise<void> {
  if (!userId || !sessionId) return;
  const cleanTitle = newTitle.trim();
  if (!cleanTitle) return;

  console.log(`[Supabase Chat] Renaming session ${sessionId} to "${cleanTitle}" in Supabase...`);
  try {
    const { error } = await supabase
      .from("chat_sessions")
      .update({ title: cleanTitle, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (error) {
      console.error("[Supabase Chat Error] Error renaming session:", error.message || error);
    } else {
      console.log(`[Supabase Chat] Renamed session ${sessionId} successfully.`);
    }
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in renameSession:", err);
  }

  await loadUserSessions(userId);
  notifySessionsChanged();
}

/**
 * Toggles the pinned status of a chat session in Supabase and re-fetches.
 */
export async function togglePinSession(userId: string, sessionId: string): Promise<boolean> {
  if (!userId || !sessionId) return false;

  console.log(`[Supabase Chat] Toggling pin status for session: ${sessionId}`);
  const currentSessions = await loadUserSessions(userId);
  const target = currentSessions.find((s) => s.id === sessionId);
  const newPinnedState = target ? !target.isPinned : true;

  try {
    const { error } = await supabase
      .from("chat_sessions")
      .update({ is_pinned: newPinnedState, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (error) {
      console.warn("[Supabase Chat Warning] Could not update is_pinned column in chat_sessions:", error.message || error);
    } else {
      console.log(`[Supabase Chat] Updated pin status for session ${sessionId} to ${newPinnedState}`);
    }
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in togglePinSession:", err);
  }

  await loadUserSessions(userId);
  notifySessionsChanged();

  return newPinnedState;
}

/**
 * Deletes a chat session and all its messages from Supabase and re-fetches.
 */
export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  if (!userId || !sessionId) return;

  console.log(`[Supabase Chat] Deleting session ${sessionId} and its messages from Supabase...`);

  // 1. Delete messages first
  try {
    const { error: msgDelErr } = await supabase
      .from("chat_messages")
      .delete()
      .eq("session_id", sessionId);

    if (msgDelErr) {
      console.error("[Supabase Chat Error] Error deleting chat_messages rows:", msgDelErr.message || msgDelErr);
    } else {
      console.log(`[Supabase Chat] Deleted messages for session ${sessionId}.`);
    }
  } catch (err) {
    console.error("[Supabase Chat Error] Exception deleting messages for session:", err);
  }

  // 2. Delete parent session row
  try {
    const { error: sessionDelErr } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (sessionDelErr) {
      console.error("[Supabase Chat Error] Error deleting chat_sessions row:", sessionDelErr.message || sessionDelErr);
    } else {
      console.log(`[Supabase Chat] Deleted session ${sessionId} from chat_sessions.`);
    }
  } catch (err) {
    console.error("[Supabase Chat Error] Exception deleting session:", err);
  }

  await loadUserSessions(userId);
  notifySessionsChanged();
}

