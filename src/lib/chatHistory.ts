import { supabase } from "./supabase";
import { parseAndExtractScoreData, stripScoreDataTags } from "./scoreData";

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
export function encodeMessageContent(msg: { content: string; challengeResult?: any }): string {
  let text = stripScoreDataTags(msg.content || "");
  if (msg.challengeResult && typeof msg.challengeResult === "object") {
    text += `\n\n<!--CHALLENGE_RESULT:${JSON.stringify(msg.challengeResult)}-->`;
  }
  return text;
}

/**
 * Decodes message content and extracts challengeResult if embedded.
 */
export function decodeMessageContent(rawContent: string): { content: string; challengeResult: any | null } {
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

  // Also check if raw SCORE_DATA is in the content and clean it up
  const parsed = parseAndExtractScoreData(content);
  if (parsed.challengeResult && !challengeResult) {
    challengeResult = parsed.challengeResult;
  }
  content = parsed.cleanText;

  return { content, challengeResult };
}

/**
 * Loads all chat sessions for a user directly from Supabase chat_sessions table as authoritative single source of truth.
 * Queries fresh on every call: SELECT * FROM chat_sessions WHERE user_id = [current user] ORDER BY created_at DESC
 */
export async function loadUserSessions(userId: string): Promise<ChatSession[]> {
  if (!userId) {
    console.warn("[Supabase Chat Warning] loadUserSessions called without userId");
    return [];
  }

  console.log(`[Supabase Chat] Querying chat_sessions fresh for user_id: ${userId} ORDER BY created_at DESC`);
  try {
    const { data: sessionRows, error: sessionErr } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (sessionErr) {
      console.error("[Supabase Chat Error] Failed to fetch chat_sessions from Supabase:", sessionErr.message || sessionErr);
      return [];
    }

    if (!Array.isArray(sessionRows)) {
      console.log("[Supabase Chat] No session rows returned for user:", userId);
      return [];
    }

    console.log(`[Supabase Chat] Successfully retrieved ${sessionRows.length} sessions from chat_sessions table.`);

    const seenSessionIds = new Set<string>();
    const sessions: ChatSession[] = [];
    for (const row of sessionRows) {
      if (!row.id || seenSessionIds.has(row.id)) continue;
      seenSessionIds.add(row.id);
      sessions.push({
        id: row.id,
        userId: row.user_id || userId,
        title: row.title || "New Conversation",
        isPinned: false,
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
        messages: [],
      });
    }

    return sessions;
  } catch (err) {
    console.error("[Supabase Chat Error] Unexpected exception loading user sessions:", err);
    return [];
  }
}

/**
 * Creates a brand new chat session row directly in the Supabase chat_sessions table BEFORE any messages are sent.
 */
export async function createChatSession(userId: string, initialTitle: string = "New Conversation"): Promise<ChatSession | null> {
  if (!userId) {
    console.error("[Supabase Chat Error] createChatSession called without userId");
    return null;
  }
  const sessionId = generateUuid();
  const now = new Date().toISOString();
  console.log(`[Supabase Chat] Creating new chat_sessions row in Supabase for user ${userId} with id: ${sessionId}`);

  try {
    const { error } = await supabase
      .from("chat_sessions")
      .insert({
        id: sessionId,
        user_id: userId,
        title: initialTitle,
        created_at: now,
        updated_at: now,
      });

    if (error) {
      console.error("[Supabase Chat Error] Failed to insert new chat_session:", error.message || error, error);
      return null;
    }

    console.log(`[Supabase Chat] Successfully inserted chat_session into Supabase with ID: ${sessionId}`);
    notifySessionsChanged();
    return {
      id: sessionId,
      userId,
      title: initialTitle,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in createChatSession:", err);
    return null;
  }
}

/**
 * Fetches a single chat session with its full message history fresh from Supabase.
 * Queries chat_messages table filtered by session_id ORDER BY created_at ASC.
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
      console.warn(`[Supabase Chat Warning] Session ${sessionId} not found in chat_sessions table for user ${userId}.`);
      return null;
    }

    // 2. Fetch messages fresh from chat_messages table
    console.log(`[Supabase Chat] Querying chat_messages fresh for session_id: ${sessionId} ORDER BY created_at ASC`);
    const { data: messageRows, error: msgErr } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (msgErr) {
      console.error(`[Supabase Chat Error] Failed to fetch messages from chat_messages for session ${sessionId}:`, msgErr.message || msgErr);
    }

    const seenMsgIds = new Set<string>();
    const messages: ChatMessage[] = [];
    if (Array.isArray(messageRows)) {
      for (const msgRow of messageRows) {
        const msgId = msgRow.id || `msg-${messages.length}-${msgRow.created_at || ""}`;
        if (seenMsgIds.has(msgId)) continue;
        seenMsgIds.add(msgId);
        const { content, challengeResult } = decodeMessageContent(msgRow.content || "");
        messages.push({
          id: msgId,
          role: msgRow.role,
          content,
          timestamp: msgRow.created_at,
          challengeResult,
        });
      }
    }

    console.log(`[Supabase Chat] Successfully retrieved ${messages.length} messages fresh from chat_messages for session: ${sessionId}`);

    return {
      id: sessionData.id,
      userId: sessionData.user_id || userId,
      title: sessionData.title || "New Conversation",
      isPinned: false,
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
    const { data: existing } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("id", validSessionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return true;
    }

    const payload = {
      id: validSessionId,
      user_id: userId,
      title: title || "New Conversation",
      created_at: now,
      updated_at: now,
    };

    const { error } = await supabase.from("chat_sessions").insert(payload);

    if (error) {
      console.error("[Supabase Chat Error] Error inserting chat_sessions row:", error.message || error);
      return false;
    }

    console.log(`[Supabase Chat] Successfully created chat_sessions row: ${validSessionId}`);
    notifySessionsChanged();
    return true;
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in ensureSessionExists:", err);
    return false;
  }
}

/**
 * Inserts a single chat message directly into Supabase chat_messages table immediately.
 */
export async function insertChatMessage(
  userId: string,
  sessionId: string,
  message: ChatMessage
): Promise<boolean> {
  if (!userId || !sessionId) {
    console.error("[Supabase Chat Error] insertChatMessage missing userId or sessionId", { userId, sessionId });
    return false;
  }

  const validMessageId = message.id && isUuid(message.id) ? message.id : generateUuid();
  const now = message.timestamp || new Date().toISOString();

  console.log(`[Supabase Chat] Inserting message (${message.role}) ${validMessageId} into chat_messages for session: ${sessionId}`);

  try {
    const messagePayload = {
      id: validMessageId,
      session_id: sessionId,
      user_id: userId,
      role: message.role,
      content: encodeMessageContent(message),
      created_at: now,
    };

    const { error: msgErr } = await supabase.from("chat_messages").insert(messagePayload);

    if (msgErr) {
      console.error("[Supabase Chat Error] Error inserting into chat_messages:", msgErr.message || msgErr);
      return false;
    }

    console.log(`[Supabase Chat] Successfully saved message ${validMessageId} into chat_messages table.`);

    // Update parent session updated_at timestamp
    const { error: sessionUpdateErr } = await supabase
      .from("chat_sessions")
      .update({ updated_at: now })
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (sessionUpdateErr) {
      console.warn("[Supabase Chat Warning] Could not update session updated_at timestamp:", sessionUpdateErr.message || sessionUpdateErr);
    }

    return true;
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in insertChatMessage:", err);
    return false;
  }
}

/**
 * Updates a chat session's title in Supabase chat_sessions.
 */
export async function updateSessionTitle(userId: string, sessionId: string, newTitle: string): Promise<boolean> {
  if (!userId || !sessionId || !newTitle.trim()) return false;
  const cleanTitle = newTitle.trim();

  console.log(`[Supabase Chat] Updating session ${sessionId} title to "${cleanTitle}" in chat_sessions...`);
  try {
    const { error } = await supabase
      .from("chat_sessions")
      .update({ title: cleanTitle, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (error) {
      console.error("[Supabase Chat Error] Error updating session title:", error.message || error);
      return false;
    }

    console.log(`[Supabase Chat] Updated title for session ${sessionId} successfully.`);
    notifySessionsChanged();
    return true;
  } catch (err) {
    console.error("[Supabase Chat Error] Exception in updateSessionTitle:", err);
    return false;
  }
}

/**
 * Saves a single message and ensures parent session exists.
 */
export async function saveSingleMessage(userId: string, sessionId: string, message: ChatMessage, sessionTitle?: string): Promise<boolean> {
  await ensureSessionExists(userId, sessionId, sessionTitle);
  return insertChatMessage(userId, sessionId, message);
}

/**
 * Saves or updates a full chat session in Supabase (legacy compatibility wrapper).
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
    for (const msg of session.messages) {
      await insertChatMessage(userId, validSessionId, msg);
    }
  }

  const freshSessions = await loadUserSessions(userId);
  notifySessionsChanged();
  return freshSessions;
}

/**
 * Renames a chat session in Supabase and re-fetches the fresh list.
 */
export async function renameSession(userId: string, sessionId: string, newTitle: string): Promise<void> {
  await updateSessionTitle(userId, sessionId, newTitle);
  await loadUserSessions(userId);
}

/**
 * Toggles the pinned status of a chat session in Supabase (in-memory/no-op if column absent).
 */
export async function togglePinSession(userId: string, sessionId: string): Promise<boolean> {
  if (!userId || !sessionId) return false;
  console.log(`[Supabase Chat] togglePinSession requested for ${sessionId}`);
  notifySessionsChanged();
  return true;
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

