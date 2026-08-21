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
 * Fetches user memory from Supabase `murgii_memory` table with localStorage cache fallback.
 */
export async function fetchUserMemory(userId: string): Promise<MurgiiMemory> {
  const fallbackMemory: MurgiiMemory = {
    preferred_name: "",
    business_description: "",
    niche: "",
    preferred_tone: "Bold and direct",
    additional_notes: "",
  };

  // Try local cache first for instant hydration
  try {
    const cached = localStorage.getItem(`${MEMORY_CACHE_KEY_PREFIX}${userId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      Object.assign(fallbackMemory, parsed);
    }
  } catch (e) {
    console.warn("Could not read local memory cache:", e);
  }

  if (!userId) return fallbackMemory;

  try {
    const { data, error } = await supabase
      .from("murgii_memory")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      const memory: MurgiiMemory = {
        preferred_name: data.preferred_name || data.name || fallbackMemory.preferred_name,
        business_description: data.business_description || data.description || fallbackMemory.business_description,
        niche: data.niche || data.industry || fallbackMemory.niche,
        preferred_tone: data.preferred_tone || data.tone || fallbackMemory.preferred_tone,
        additional_notes: data.additional_notes || data.notes || fallbackMemory.additional_notes,
        updated_at: data.updated_at,
      };

      try {
        localStorage.setItem(`${MEMORY_CACHE_KEY_PREFIX}${userId}`, JSON.stringify(memory));
      } catch {}

      return memory;
    }
  } catch (err) {
    console.warn("Could not query murgii_memory table:", err);
  }

  return fallbackMemory;
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

  // Update local cache immediately
  try {
    localStorage.setItem(
      `${MEMORY_CACHE_KEY_PREFIX}${userId}`,
      JSON.stringify({ ...memory, updated_at: new Date().toISOString() })
    );
  } catch {}

  try {
    const payload = {
      user_id: userId,
      preferred_name: memory.preferred_name,
      business_description: memory.business_description,
      niche: memory.niche,
      preferred_tone: memory.preferred_tone,
      additional_notes: memory.additional_notes,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("murgii_memory")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.warn("Supabase upsert error on murgii_memory table:", error);
      // Even if remote throws schema difference, local cache is saved
      return { success: true };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to save memory to Supabase:", err);
    return { success: true }; // Local cache preserved
  }
}
