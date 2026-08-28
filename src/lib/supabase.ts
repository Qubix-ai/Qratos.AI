import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://omeqbiksjqyeqkxnkflh.supabase.co";
// Safe fallback anon key placeholder if not yet provided in runtime env
const DEFAULT_SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZXFiaWtzanF5ZXFreG5rZmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTYwMDAsImV4cCI6MjAyNTQzMjAwMH0.placeholder";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type MurgiiMode = "email" | "ads" | "landing" | "psych" | "content";

export interface MurgiiGenerateResponse {
  text: string;
  remaining?: number;
}

export class DailyLimitError extends Error {
  remaining: number;
  constructor(message: string, remaining: number = 0) {
    super(message);
    this.name = "DailyLimitError";
    this.remaining = remaining;
  }
}

/**
 * Invokes the secure Supabase Edge Function for Murgii AI generation.
 * Edge Function URL: https://omeqbiksjqyeqkxnkflh.supabase.co/functions/v1/murgii-generate
 */
export async function callMurgiiGenerateEdgeFunction(
  mode: MurgiiMode,
  brief: string
): Promise<MurgiiGenerateResponse> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData?.session?.access_token) {
    throw new Error("Authentication required. Please sign in to your Murgii / Qreato account.");
  }

  const token = sessionData.session.access_token;
  const functionUrl = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/murgii-generate`;

  let response: Response;
  try {
    response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        brief,
      }),
    });
  } catch (networkErr) {
    console.error("Network error invoking Murgii Edge Function:", networkErr);
    throw new Error("Something went wrong generating this — please try again in a moment.");
  }

  // Handle 429 Daily Limit Reached
  if (response.status === 429) {
    let limitMessage = "You have reached your daily generation limit. Please upgrade or try again tomorrow.";
    try {
      const errorJson = await response.json();
      if (errorJson?.message) {
        limitMessage = errorJson.message;
      }
    } catch {
      // fallback
    }
    throw new DailyLimitError(limitMessage, 0);
  }

  // Handle other non-200 responses
  if (!response.ok) {
    console.error(`Edge function error: HTTP ${response.status}`);
    throw new Error("Something went wrong generating this — please try again in a moment.");
  }

  try {
    const data = await response.json();
    return {
      text: data.text || "",
      remaining: typeof data.remaining === "number" ? data.remaining : undefined,
    };
  } catch (parseErr) {
    console.error("Failed to parse Edge Function response:", parseErr);
    throw new Error("Something went wrong generating this — please try again in a moment.");
  }
}
