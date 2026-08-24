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
 * Loads all chat sessions for a user, sorted with pinned sessions first,
 * followed by the most recently updated sessions.
 */
export async function loadUserSessions(userId: string): Promise<ChatSession[]> {
  if (!userId) return [];

  let sessions: ChatSession[] = [];

  // 1. Read from localStorage for immediate, snappy hydration
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        sessions = parsed;
      }
    }
  } catch (err) {
    console.warn("Error reading local chat sessions cache:", err);
  }

  // 2. Query remote storage (Supabase / database) if available
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      // Merge remote data with local pinned statuses/cache if present
      const remoteSessions: ChatSession[] = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id || userId,
        title: row.title || "Conversation",
        isPinned: Boolean(row.is_pinned),
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
        messages: Array.isArray(row.messages) ? row.messages : [],
      }));

      // If remote has sessions, use remote and update local cache
      sessions = remoteSessions;
      try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions));
      } catch {}
    }
  } catch {
    // Database table may be optional/custom; local storage acts as guaranteed rock-solid persistence
  }

  // Sort: Pinned first (by updatedAt desc), then Unpinned (by updatedAt desc)
  return sessions.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/**
 * Fetches a single chat session by ID.
 */
export async function getSessionById(userId: string, sessionId: string): Promise<ChatSession | null> {
  const sessions = await loadUserSessions(userId);
  return sessions.find((s) => s.id === sessionId) || null;
}

/**
 * Saves or updates a chat session in persistent storage.
 */
export async function saveSession(userId: string, session: ChatSession): Promise<void> {
  if (!userId || !session.id) return;

  const updatedSession: ChatSession = {
    ...session,
    userId,
    updatedAt: new Date().toISOString(),
  };

  // 1. Update localStorage cache
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    let sessions: ChatSession[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(sessions)) sessions = [];

    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      // Preserve pinned state unless explicitly provided
      const wasPinned = sessions[existingIndex].isPinned;
      sessions[existingIndex] = {
        ...updatedSession,
        isPinned: session.isPinned !== undefined ? session.isPinned : wasPinned,
      };
    } else {
      sessions.unshift(updatedSession);
    }

    localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions));
  } catch (err) {
    console.warn("Could not save session to localStorage:", err);
  }

  notifySessionsChanged();

  // 2. Async save to remote database if table exists
  try {
    await supabase.from("chat_sessions").upsert({
      id: session.id,
      user_id: userId,
      title: session.title,
      is_pinned: session.isPinned || false,
      messages: session.messages,
      created_at: session.createdAt,
      updated_at: updatedSession.updatedAt,
    }, { onConflict: "id" });
  } catch {
    // Ignore remote sync errors; local storage is secure
  }
}

/**
 * Renames a chat session.
 */
export async function renameSession(userId: string, sessionId: string, newTitle: string): Promise<void> {
  if (!userId || !sessionId) return;
  const cleanTitle = newTitle.trim();
  if (!cleanTitle) return;

  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    let sessions: ChatSession[] = raw ? JSON.parse(raw) : [];
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      target.title = cleanTitle;
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions));
    }
  } catch (err) {
    console.warn("Could not rename session locally:", err);
  }

  notifySessionsChanged();

  try {
    await supabase
      .from("chat_sessions")
      .update({ title: cleanTitle, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);
  } catch {}
}

/**
 * Toggles the pinned status of a chat session.
 */
export async function togglePinSession(userId: string, sessionId: string): Promise<boolean> {
  if (!userId || !sessionId) return false;
  let newPinnedState = false;

  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    let sessions: ChatSession[] = raw ? JSON.parse(raw) : [];
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      target.isPinned = !target.isPinned;
      newPinnedState = target.isPinned;
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions));
    }
  } catch (err) {
    console.warn("Could not toggle pin locally:", err);
  }

  notifySessionsChanged();

  try {
    await supabase
      .from("chat_sessions")
      .update({ is_pinned: newPinnedState, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId);
  } catch {}

  return newPinnedState;
}

/**
 * Deletes a chat session from persistent storage.
 */
export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  if (!userId || !sessionId) return;

  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    let sessions: ChatSession[] = raw ? JSON.parse(raw) : [];
    sessions = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions));
  } catch (err) {
    console.warn("Could not delete session locally:", err);
  }

  notifySessionsChanged();

  try {
    await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", userId);
  } catch {}
}
