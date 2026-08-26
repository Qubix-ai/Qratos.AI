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
      return 60;
    case "core":
      return 20;
    case "basic":
    case "none":
    default:
      return 3;
  }
}

/**
 * Fetches user plan from shared user_plan table in Supabase, falling back to auth user metadata
 */
export async function fetchUserPlan(userId: string, userMetadata?: any): Promise<UserPlanData> {
  let planString: string = "";

  if (!userId) {
    return {
      plan: "none",
      maxCredits: getPlanMaxCredits("none"),
    };
  }

  try {
    const { data, error } = await supabase
      .from("user_plan")
      .select("plan, status")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data?.plan) {
      planString = data.plan;
    } else {
      // If user_id column differs, try id column
      const { data: altData, error: altError } = await supabase
        .from("user_plan")
        .select("plan, status")
        .eq("id", userId)
        .maybeSingle();
      if (!altError && altData?.plan) {
        planString = altData.plan;
      }
    }
  } catch (err) {
    console.warn("Could not query user_plan table from Supabase:", err);
  }

  // Fallback to metadata only if user_plan table query returned nothing
  if (!planString && userMetadata?.plan) {
    planString = userMetadata.plan;
  }

  const normalized = normalizePlan(planString);
  return {
    plan: normalized,
    maxCredits: getPlanMaxCredits(normalized),
  };
}

/**
 * Fetches the user's generation usage count for today from murgii_usage table in Supabase
 */
export async function fetchTodayUsageCount(userId: string): Promise<number> {
  if (!userId) return 0;

  try {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayIso = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // 1. Try querying by date column if the table stores daily aggregates
    const { data: dateData, error: dateErr } = await supabase
      .from("murgii_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("date", todayIso)
      .maybeSingle();

    if (!dateErr && dateData) {
      if (typeof dateData.count === "number") return dateData.count;
      if (typeof dateData.usage_count === "number") return dateData.usage_count;
      if (typeof dateData.generations === "number") return dateData.generations;
      return 1;
    }

    // 2. Query event rows with created_at >= start of today (UTC)
    const { count, data: rows, error: countErr } = await supabase
      .from("murgii_usage")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .gte("created_at", todayStart.toISOString());

    if (!countErr && typeof count === "number") {
      return count;
    }
    if (rows && Array.isArray(rows)) {
      return rows.length;
    }
  } catch (err) {
    console.warn("Could not query murgii_usage table from Supabase:", err);
  }

  return 0;
}

/**
 * Fetches user plan from user_plan and calculates or assigns remaining credits.
 * If knownRemaining is supplied (from murgii-generate response body), it uses that exact value.
 */
export async function fetchUserPlanAndCredits(
  userId: string, 
  knownRemaining?: number,
  userMetadata?: any
): Promise<{
  planData: UserPlanData;
  remainingCredits: number;
}> {
  const planData = await fetchUserPlan(userId, userMetadata);

  if (typeof knownRemaining === "number") {
    return {
      planData,
      remainingCredits: knownRemaining,
    };
  }

  const usageCount = await fetchTodayUsageCount(userId);
  const remainingCredits = Math.max(0, planData.maxCredits - usageCount);

  return {
    planData,
    remainingCredits,
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
