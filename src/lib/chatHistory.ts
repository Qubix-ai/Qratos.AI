import { supabase } from "./supabase";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isNew?: boolean;
  isDailyLimit?: boolean;
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

const SESSIONS_STORAGE_KEY_PREFIX = "murgii_sessions_v2_";
export const SESSIONS_UPDATED_EVENT = "murgii_chat_sessions_updated";

/**
 * Auto-generates a clean, concise title from the user's first prompt message.
 */
export function generateTitleFromMessage(content: string): string {
  if (!content) return "New Conversation";
  
  // Clean markdown headings, bullets, formatting, and excess whitespace
  let clean = content
    .replace(/^#+\s+/g, "")
    .replace(/^[\*\-\•]\s+/g, "")
    .replace(/[\*\_\`\~]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  // If starts with common action phrases, keep them concise
  if (clean.length > 36) {
    clean = clean.substring(0, 36).trim() + "...";
  }
  
  return clean || "New Conversation";
}

/**
 * Dispatches an event across the window so all components refresh instantly.
 */
function notifySessionsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SESSIONS_UPDATED_EVENT));
  }
}

/**
 * Gets the localStorage key for the given user ID.
 */
function getStorageKey(userId: string): string {
  return `${SESSIONS_STORAGE_KEY_PREFIX}${userId || "guest"}`;
}

/**
 * Loads all chat sessions for a user directly from Supabase chat_sessions as single source of truth,
 * sorted with pinned sessions first, followed by the most recently updated sessions.
 */
export async function loadUserSessions(userId: string): Promise<ChatSession[]> {
  if (!userId) return [];

  // 1. Primary: Query Supabase chat_sessions table as authoritative single source of truth
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      const remoteSessions: ChatSession[] = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id || userId,
        title: row.title || "Conversation",
        isPinned: Boolean(row.is_pinned),
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
        messages: Array.isArray(row.messages) ? row.messages : [],
      }));

      // Cache fresh remote state locally for offline fallback
      try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(remoteSessions));
      } catch {}

      return remoteSessions.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    }
  } catch (err) {
    console.warn("Could not load sessions from Supabase chat_sessions table:", err);
  }

  // 2. Fallback to localStorage only if Supabase request failed/offline
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      }
    }
  } catch (err) {
    console.warn("Error reading local chat sessions cache:", err);
  }

  return [];
}

/**
 * Fetches a single chat session by ID from Supabase.
 */
export async function getSessionById(userId: string, sessionId: string): Promise<ChatSession | null> {
  if (!userId || !sessionId) return null;

  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        userId: data.user_id || userId,
        title: data.title || "Conversation",
        isPinned: Boolean(data.is_pinned),
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
        messages: Array.isArray(data.messages) ? data.messages : [],
      };
    }
  } catch (err) {
    console.warn("Could not query single session from Supabase:", err);
  }

  const sessions = await loadUserSessions(userId);
  return sessions.find((s) => s.id === sessionId) || null;
}

/**
 * Saves or updates a chat session in persistent storage.
 * Directly inserts/upserts into Supabase chat_sessions, then re-fetches the full session list from Supabase.
 */
export async function saveSession(userId: string, session: ChatSession): Promise<ChatSession[]> {
  if (!userId || !session.id) return [];

  const updatedSession: ChatSession = {
    ...session,
    userId,
    updatedAt: new Date().toISOString(),
  };

  // 1. Insert/upsert row into Supabase chat_sessions table
  try {
    const { error } = await supabase.from("chat_sessions").upsert({
      id: session.id,
      user_id: userId,
      title: session.title,
      is_pinned: session.isPinned || false,
      messages: session.messages,
      created_at: session.createdAt || updatedSession.updatedAt,
      updated_at: updatedSession.updatedAt,
    }, { onConflict: "id" });

    if (error) {
      console.warn("Supabase chat_sessions upsert error:", error);
    }
  } catch (err) {
    console.warn("Network error upserting to chat_sessions table:", err);
  }

  // 2. Immediately re-fetch the full session list from Supabase
  const freshSessions = await loadUserSessions(userId);

  // 3. Notify all listeners (such as Sidebar) so the UI updates with true Supabase session list
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

  try {
    await supabase
      .from("chat_sessions")
      .update({ title: cleanTitle, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);
  } catch (err) {
    console.warn("Could not rename session in Supabase:", err);
  }

  await loadUserSessions(userId);
  notifySessionsChanged();
}

/**
 * Toggles the pinned status of a chat session in Supabase and re-fetches.
 */
export async function togglePinSession(userId: string, sessionId: string): Promise<boolean> {
  if (!userId || !sessionId) return false;
  
  const currentSessions = await loadUserSessions(userId);
  const target = currentSessions.find((s) => s.id === sessionId);
  const newPinnedState = target ? !target.isPinned : true;

  try {
    await supabase
      .from("chat_sessions")
      .update({ is_pinned: newPinnedState, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);
  } catch (err) {
    console.warn("Could not toggle pin in Supabase:", err);
  }

  await loadUserSessions(userId);
  notifySessionsChanged();

  return newPinnedState;
}

/**
 * Deletes a chat session from Supabase and re-fetches.
 */
export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  if (!userId || !sessionId) return;

  try {
    await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", userId);
  } catch (err) {
    console.warn("Could not delete session from Supabase:", err);
  }

  await loadUserSessions(userId);
  notifySessionsChanged();
}
