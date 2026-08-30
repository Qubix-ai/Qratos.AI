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

export type MurgiiMode = "email" | "ads" | "landing" | "psych" | "content" | "challenge";

export interface ChallengeResult {
  shareSlug: string;
  overallScore: number;
  [key: string]: any;
}

export interface MurgiiGenerateResponse {
  text: string;
  remaining?: number;
  challengeResult?: ChallengeResult | null;
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
 * Helper to call the local /api/murgii/generate server route as an immediate fallback
 */
async function callLocalGenerateApi(
  mode: MurgiiMode,
  brief: string,
  token?: string
): Promise<MurgiiGenerateResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/murgii/generate", {
    method: "POST",
    headers,
    body: JSON.stringify({ mode, brief }),
  });

  if (!res.ok) {
    let errorDetail = "Something went wrong generating this — please try again in a moment.";
    try {
      const errJson = await res.json();
      if (errJson?.error) errorDetail = errJson.error;
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  const data = await res.json();
  return {
    text: data.text || "",
    remaining: typeof data.remaining === "number" ? data.remaining : undefined,
    challengeResult: data.challengeResult || null,
  };
}

/**
 * Invokes the secure Murgii AI generation service with automatic fallback.
 * First tries the Supabase Edge Function; if it returns 502 or is unavailable,
 * seamlessly falls back to the server-side Gemini Persuasion Engine.
 */
export async function callMurgiiGenerateEdgeFunction(
  mode: MurgiiMode,
  brief: string
): Promise<MurgiiGenerateResponse> {
  let token: string | undefined;

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    token = sessionData?.session?.access_token;
  } catch {
    // Guest or uninitialized auth
  }

  const functionUrl = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/murgii-generate`;

  // If we have a token, attempt calling the Supabase Edge Function
  if (token) {
    try {
      const response = await fetch(functionUrl, {
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

      if (response.ok) {
        const data = await response.json();
        return {
          text: data.text || "",
          remaining: typeof data.remaining === "number" ? data.remaining : undefined,
          challengeResult: data.challengeResult || null,
        };
      }

      console.warn(`[Murgii] Supabase Edge function returned HTTP ${response.status}. Falling back to server engine...`);
    } catch (edgeErr: any) {
      if (edgeErr instanceof DailyLimitError || edgeErr?.name === "DailyLimitError") {
        throw edgeErr;
      }
      console.warn("[Murgii] Supabase Edge function network issue, falling back to server engine:", edgeErr);
    }
  }

  // Fallback to local server-side Gemini Persuasion Engine
  return await callLocalGenerateApi(mode, brief, token);
}
