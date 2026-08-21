import { SupabaseClient } from "@supabase/supabase-js";

const ACTIVITY_STORAGE_KEY = "murgii_last_activity_timestamp";
export const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

let lastRecordedTime = 0;

/**
 * Records user activity timestamp in persistent localStorage.
 * Throttled to avoid excessive storage writes (at most once every 15 seconds).
 */
export function recordUserActivity(): void {
  try {
    const now = Date.now();
    if (now - lastRecordedTime < 15000) {
      return;
    }
    lastRecordedTime = now;
    localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
  } catch (err) {
    console.warn("Unable to save activity timestamp to localStorage:", err);
  }
}

/**
 * Checks if the last user activity was within the 5-day window.
 * Returns true if active within 5 days, false if expired.
 */
export function isSessionWithinInactivityWindow(): boolean {
  try {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!stored) {
      // If no timestamp is present yet, treat as fresh session and initialize
      recordUserActivity();
      return true;
    }

    const lastActivity = parseInt(stored, 10);
    if (isNaN(lastActivity)) {
      recordUserActivity();
      return true;
    }

    const elapsed = Date.now() - lastActivity;
    return elapsed <= FIVE_DAYS_MS;
  } catch {
    return true;
  }
}

/**
 * Enforces 5-day inactivity session expiry.
 * If user was inactive for >5 days, signs out from Supabase and clears timestamp.
 * Returns true if session is still valid, false if expired.
 */
export async function validateAndEnforceSessionExpiry(supabase: SupabaseClient): Promise<boolean> {
  const isValid = isSessionWithinInactivityWindow();
  if (!isValid) {
    console.info("Murgii session expired due to 5 days of inactivity. Signing out.");
    try {
      await supabase.auth.signOut();
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch (err) {
      console.warn("Error signing out expired session:", err);
    }
    return false;
  }

  // Session is active: refresh timestamp
  recordUserActivity();
  return true;
}

/**
 * Clears the activity tracking on explicit logout.
 */
export function clearUserActivity(): void {
  try {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
