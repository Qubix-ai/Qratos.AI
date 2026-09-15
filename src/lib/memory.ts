import { supabase } from "./supabase";

export interface MurgiiMemory {
  preferred_name: string;
  business_description: string;
  niche: string;
  preferred_tone: string;
  additional_notes: string;
  updated_at?: string;
}

const MEMORY_CACHE_KEY_PREFIX = "murgii_memory_";

export const DEFAULT_TONE_OPTIONS = [
  "Bold and direct",
  "Warm and friendly",
  "Professional and authoritative",
  "Playful and casual",
  "Story-driven and empathetic",
  "High-converting direct response",
];

/**
 * Fetches user memory directly from Supabase `murgii_memory` table.
 */
export async function fetchUserMemory(userId: string): Promise<MurgiiMemory> {
  const defaultMemory: MurgiiMemory = {
    preferred_name: "",
    business_description: "",
    niche: "",
    preferred_tone: "Bold and direct",
    additional_notes: "",
  };

  if (!userId) return defaultMemory;

  try {
    const { data, error } = await supabase
      .from("murgii_memory")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      return {
        preferred_name: data.preferred_name ?? "",
        business_description: data.business_description ?? "",
        niche: data.niche ?? "",
        preferred_tone: data.preferred_tone || "Bold and direct",
        additional_notes: data.additional_notes ?? "",
        updated_at: data.updated_at,
      };
    }
  } catch (err) {
    console.error("Failed fetching user memory directly from Supabase:", err);
  }

  return defaultMemory;
}

/**
 * Saves/upserts user memory to Supabase `murgii_memory` table.
 */
export async function saveUserMemory(
  userId: string,
  memory: MurgiiMemory
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    return { success: false, error: "User session required" };
  }

  try {
    const payload = {
      user_id: userId,
      preferred_name: (memory.preferred_name || "").trim(),
      business_description: (memory.business_description || "").trim(),
      niche: (memory.niche || "").trim(),
      preferred_tone: (memory.preferred_tone || "Bold and direct").trim(),
      additional_notes: (memory.additional_notes || "").trim(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("murgii_memory")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("Supabase upsert error on murgii_memory table:", error);
      return { success: false, error: error.message || "Failed to persist memory to Supabase" };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to save memory to Supabase:", err);
    return { success: false, error: err.message || "Network error saving memory" };
  }
}
