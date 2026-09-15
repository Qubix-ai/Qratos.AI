import { createClient } from "@supabase/supabase-js";
import { parseAndExtractScoreData, stripScoreDataTags } from "./scoreData";

export { parseAndExtractScoreData, stripScoreDataTags };

const DEFAULT_SUPABASE_URL = "https://omeqbiksjqyeqkxnkflh.supabase.co";
// Safe fallback anon key placeholder if not yet provided in runtime env
const DEFAULT_SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZXFiaWtzanF5ZXFreG5rZmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTYwMDAsImV4cCI6MjAyNTQzMjAwMH0.placeholder";

const supabaseUrl = 
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey = 
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  DEFAULT_SUPABASE_ANON_KEY;

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
  attention_score?: number;
  clarity_score?: number;
  desire_score?: number;
  persuasion_score?: number;
  action_score?: number;
  strongest_dimension?: string;
  strongest_element?: string;
  strongestElement?: string;
  biggest_leverage?: string;
  diagnosis?: string;
  userCopy?: string;
  copy?: string;
  dimensions?: {
    attention?: number;
    clarity?: number;
    desire?: number;
    persuasion?: number;
    action?: number;
  };
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

  const rawResText = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(rawResText);
  } catch {
    if (!res.ok) {
      throw new Error(rawResText || "Generation server error.");
    }
    data = { text: rawResText };
  }

  if (!res.ok) {
    let errorDetail = data?.error || "Something went wrong generating this — please try again in a moment.";
    throw new Error(errorDetail);
  }

  const rawText = data.text || "";
  const parsed = parseAndExtractScoreData(rawText, brief);
  const finalChallengeResult = data.challengeResult
    ? { ...data.challengeResult, ...(parsed.challengeResult || {}) }
    : parsed.challengeResult;

  return {
    text: parsed.cleanText,
    remaining: typeof data.remaining === "number" ? data.remaining : undefined,
    challengeResult: finalChallengeResult,
  };
}

/**
 * Invokes the secure Murgii AI generation service.
 * All modes (Emails, Ads, Pages, Persuasion, Content, and Challenge) call the
 * exact same murgii-generate Edge Function with identical authentication,
 * request structure, and mode parameters.
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

  // If we have a token, call the primary Supabase Edge Function
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
        const rawBody = await response.text();
        let data: any = null;
        try {
          data = JSON.parse(rawBody);
        } catch {
          console.warn("[Murgii] Supabase Edge function returned non-JSON body, falling back to server engine...");
        }

        if (data && data.text) {
          const rawText = data.text || "";
          const parsed = parseAndExtractScoreData(rawText, brief);
          const finalChallengeResult = data.challengeResult
            ? { ...data.challengeResult, ...(parsed.challengeResult || {}) }
            : parsed.challengeResult;

          return {
            text: parsed.cleanText,
            remaining: typeof data.remaining === "number" ? data.remaining : undefined,
            challengeResult: finalChallengeResult,
          };
        }
      }

      console.warn(`[Murgii] Supabase Edge function returned HTTP ${response.status}. Falling back to server engine...`);
    } catch (edgeErr: any) {
      if (edgeErr instanceof DailyLimitError || edgeErr?.name === "DailyLimitError") {
        throw edgeErr;
      }
      console.warn("[Murgii] Supabase Edge function issue, falling back to server engine:", edgeErr);
    }
  }

  // Fallback to local server-side Gemini Persuasion Engine
  return await callLocalGenerateApi(mode, brief, token);
}
