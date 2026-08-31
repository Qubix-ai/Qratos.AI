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
  const p = String(raw).toLowerCase().trim();
  if (
    p === "max" || 
    p.includes("max") || 
    p === "pro" || 
    p.includes("pro") || 
    p === "admin" || 
    p === "enterprise" || 
    p === "premium" || 
    p === "unlimited" ||
    p === "60"
  ) return "max";
  if (p === "core" || p.includes("core") || p === "20") return "core";
  if (p === "basic" || p.includes("basic") || p === "free" || p === "starter" || p === "3") return "basic";
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
 * Queries the user_plan table by auth.uid() user_id, id, and optional email fallback.
 * Uses select("*") so missing column schemas never cause query rejections.
 */
export async function fetchUserPlan(userId: string, userMetadata?: any, userEmail?: string): Promise<UserPlanData> {
  let planString: string = "";
  let statusString: string | undefined = undefined;

  if (!userId) {
    return {
      plan: "none",
      maxCredits: getPlanMaxCredits("none"),
    };
  }

  const cleanUserId = userId.trim();
  const cleanEmail = (userEmail || userMetadata?.email || "").trim().toLowerCase();

  try {
    // 1. Primary Query: Match on user_id = auth.uid()
    const { data: primaryData, error: primaryErr } = await supabase
      .from("user_plan")
      .select("*")
      .eq("user_id", cleanUserId)
      .maybeSingle();

    if (!primaryErr && primaryData) {
      planString = primaryData.plan || primaryData.tier || primaryData.subscription_tier || primaryData.plan_name || primaryData.name || "";
      statusString = primaryData.status || primaryData.subscription_status;
    }

    // 2. Secondary Query: Match on id = auth.uid() if primary returned no plan
    if (!planString) {
      const { data: idData, error: idErr } = await supabase
        .from("user_plan")
        .select("*")
        .eq("id", cleanUserId)
        .maybeSingle();

      if (!idErr && idData) {
        planString = idData.plan || idData.tier || idData.subscription_tier || idData.plan_name || idData.name || "";
        statusString = idData.status || idData.subscription_status;
      }
    }

    // 3. Tertiary Query: Match on email if cleanEmail is available
    if (!planString && cleanEmail) {
      const { data: emailData, error: emailErr } = await supabase
        .from("user_plan")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (!emailErr && emailData) {
        planString = emailData.plan || emailData.tier || emailData.subscription_tier || emailData.plan_name || emailData.name || "";
        statusString = emailData.status || emailData.subscription_status;
      }
    }

    // 4. Quaternary Query: Match on user_email
    if (!planString && cleanEmail) {
      const { data: userEmailData, error: userEmailErr } = await supabase
        .from("user_plan")
        .select("*")
        .eq("user_email", cleanEmail)
        .maybeSingle();

      if (!userEmailErr && userEmailData) {
        planString = userEmailData.plan || userEmailData.tier || userEmailData.subscription_tier || userEmailData.plan_name || userEmailData.name || "";
        statusString = userEmailData.status || userEmailData.subscription_status;
      }
    }
  } catch (err) {
    console.warn("Could not query user_plan table from Supabase:", err);
  }

  // Fallback to metadata only if user_plan table query returned nothing
  if (!planString) {
    planString = userMetadata?.plan || userMetadata?.tier || userMetadata?.app_metadata?.plan || "";
  }

  const normalized = normalizePlan(planString);
  return {
    plan: normalized,
    status: statusString,
    maxCredits: getPlanMaxCredits(normalized),
  };
}

/**
 * Fetches the user's generation usage count for today from murgii_usage table in Supabase
 */
export async function fetchTodayUsageCount(userId: string): Promise<number> {
  if (!userId) return 0;

  try {
    const now = new Date();
    const todayUtc = now.toISOString().split("T")[0]; // YYYY-MM-DD (UTC)
    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    // 1. Fetch rows from murgii_usage for this user
    const { data: rows, error } = await supabase
      .from("murgii_usage")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.warn("Error querying murgii_usage table from Supabase:", error);
    }

    if (rows && Array.isArray(rows) && rows.length > 0) {
      let totalUsage = 0;
      let matchedCount = 0;

      for (const row of rows) {
        const rowDate = String(row.date || "").trim();
        const rowCreatedAt = String(row.created_at || row.updated_at || row.timestamp || "").trim();

        // Check if row belongs to today (UTC or Local date boundary)
        const isTodayDate = rowDate === todayUtc || rowDate === todayLocal;
        const isTodayCreatedAt = rowCreatedAt.startsWith(todayUtc) || rowCreatedAt.startsWith(todayLocal) || (rowCreatedAt && new Date(rowCreatedAt) >= todayStart);

        if (isTodayDate || isTodayCreatedAt) {
          matchedCount++;
          // Check any numeric property holding usage count
          const rawCount = row.count ?? row.usage_count ?? row.usage ?? row.used ?? row.generations ?? row.amount ?? row.total ?? row.num_generations ?? row.credits_used ?? row.credit_used;
          
          if (typeof rawCount === "number" && !isNaN(rawCount)) {
            totalUsage += rawCount;
          } else if (typeof rawCount === "string" && !isNaN(Number(rawCount))) {
            totalUsage += Number(rawCount);
          } else {
            // If row exists without numeric count column, each row represents 1 generation
            totalUsage += 1;
          }
        }
      }

      if (matchedCount > 0) {
        return totalUsage;
      }
    }

    // 2. Secondary check: count query for event rows with created_at >= start of today (UTC)
    const { count, error: countErr } = await supabase
      .from("murgii_usage")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .gte("created_at", todayStart.toISOString());

    if (!countErr && typeof count === "number") {
      return count;
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
  userMetadata?: any,
  userEmail?: string
): Promise<{
  planData: UserPlanData;
  remainingCredits: number;
}> {
  const planData = await fetchUserPlan(userId, userMetadata, userEmail);

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
