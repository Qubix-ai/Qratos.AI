import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  name?: string;
  full_name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  updated_at?: string;
}

export interface UserPlanData {
  plan: "basic" | "core" | "max" | "none";
  status?: string;
  maxCredits: number;
}

export interface BoltProgressSummary {
  completedCount: number;
  totalCount: number;
  percentage: number;
  lastUpdated?: string;
}

/**
 * Normalizes any plan string into 'basic' | 'core' | 'max' | 'none'
 */
export function normalizePlan(raw?: string | null): "basic" | "core" | "max" | "none" {
  if (!raw) return "none";
  const p = raw.toLowerCase().trim();
  if (p === "max" || p === "pro" || p === "admin") return "max";
  if (p === "core") return "core";
  if (p === "basic" || p === "free") return "basic";
  return "none";
}

/**
 * Gets the daily limit max responses for a plan
 */
export function getPlanMaxCredits(plan: "basic" | "core" | "max" | "none"): number {
  switch (plan) {
    case "max":
      return 100;
    case "core":
      return 40;
    case "basic":
    case "none":
    default:
      return 20;
  }
}

/**
 * Fetches user plan from shared user_plan table, falling back to auth user metadata
 */
export async function fetchUserPlan(userId: string, userMetadata?: any): Promise<UserPlanData> {
  let planString: string = userMetadata?.plan || "none";

  try {
    const { data, error } = await supabase
      .from("user_plan")
      .select("plan, status")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data?.plan) {
      planString = data.plan;
    } else if (error) {
      // If user_id column differs, try id
      const { data: altData } = await supabase
        .from("user_plan")
        .select("plan, status")
        .eq("id", userId)
        .maybeSingle();
      if (altData?.plan) {
        planString = altData.plan;
      }
    }
  } catch (err) {
    console.warn("Could not query user_plan table, using metadata fallback:", err);
  }

  const normalized = normalizePlan(planString);
  return {
    plan: normalized,
    maxCredits: getPlanMaxCredits(normalized),
  };
}

/**
 * Fetches profile from shared profiles table
 */
export async function fetchUserProfile(user: any): Promise<UserProfile> {
  const fallbackProfile: UserProfile = {
    id: user.id,
    name: user.user_metadata?.name || user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : "Operator"),
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
    username: user.user_metadata?.username || (user.email ? user.email.split("@")[0] : "user"),
    email: user.email || "",
    bio: user.user_metadata?.bio || "Direct-response operator & persuasion strategist.",
  };

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && data) {
      return {
        ...fallbackProfile,
        ...data,
        name: data.name || data.full_name || fallbackProfile.name,
        email: data.email || fallbackProfile.email,
        username: data.username || fallbackProfile.username,
        bio: data.bio || fallbackProfile.bio,
      };
    }
  } catch (err) {
    console.warn("Could not query profiles table, using fallback:", err);
  }

  return fallbackProfile;
}

/**
 * Updates profile in shared profiles table and user metadata
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: userId,
      name: updates.name,
      full_name: updates.full_name || updates.name,
      username: updates.username,
      bio: updates.bio,
      email: updates.email,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.warn("Error upserting profile in profiles table:", error);
    }

    // Also update auth user_metadata if possible
    await supabase.auth.updateUser({
      data: {
        name: updates.name,
        full_name: updates.full_name || updates.name,
        username: updates.username,
        bio: updates.bio,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Failed to update profile:", err);
    return { success: false, error: err.message || "Failed to update profile" };
  }
}

/**
 * Queries shared Bolt progress table for roadmap items completed (read-only)
 */
export async function fetchBoltProgress(userId: string): Promise<BoltProgressSummary> {
  const TOTAL_ROADMAP_ITEMS = 24; // Bolt standard 6-category roadmap milestone total

  try {
    // Check progress table
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId);

    if (!error && data && Array.isArray(data)) {
      // Filter items marked completed or truthy
      const completed = data.filter((item: any) => 
        item.completed === true || 
        item.is_completed === true || 
        item.status === "completed" || 
        item.status === "done" ||
        item.completed_at != null
      ).length;

      const effectiveTotal = Math.max(data.length, TOTAL_ROADMAP_ITEMS);
      const percentage = Math.min(100, Math.round((completed / effectiveTotal) * 100));

      return {
        completedCount: completed,
        totalCount: effectiveTotal,
        percentage,
      };
    }
  } catch (err) {
    console.warn("Could not query Bolt progress table:", err);
  }

  return {
    completedCount: 0,
    totalCount: TOTAL_ROADMAP_ITEMS,
    percentage: 0,
  };
}
