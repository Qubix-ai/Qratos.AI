import { supabase } from "./supabase";

export const CURRENT_TOS_VERSION = "1.0";

export interface UserProfile {
  id: string;
  name?: string;
  full_name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  updated_at?: string;
  tos_accepted_at?: string;
  tos_version?: string;
  privacy_accepted_at?: string;
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

export interface AccountDeletionResult {
  success: boolean;
  tablesDeleted: string[];
  tablesFailed: { table: string; error: string }[];
  error?: string;
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
 * Records explicit Terms of Service and Privacy Policy consent at signup in the database.
 * Writes tos_accepted_at, tos_version, and privacy_accepted_at into the `profiles` table
 * and updates Supabase auth user metadata.
 */
export async function recordUserConsent(
  userId: string,
  email?: string,
  userMetadata?: any,
  tosVersion: string = CURRENT_TOS_VERSION
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    return { success: false, error: "User ID is required to record legal consent." };
  }

  const nowIso = new Date().toISOString();
  const cleanEmail = (email || userMetadata?.email || "").trim();
  const fullName = userMetadata?.full_name || userMetadata?.name || (cleanEmail ? cleanEmail.split("@")[0] : "Operator");

  try {
    // 1. Primary write: Upsert into Supabase `profiles` table
    const profilePayload: Record<string, any> = {
      id: userId,
      tos_accepted_at: nowIso,
      tos_version: tosVersion,
      privacy_accepted_at: nowIso,
      updated_at: nowIso,
    };

    if (cleanEmail) {
      profilePayload.email = cleanEmail;
    }
    if (fullName) {
      profilePayload.full_name = fullName;
    }

    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "id" });

    if (profileErr) {
      console.warn("[Consent Capture] Notice writing to profiles table:", profileErr.message || profileErr);
    }

    // 2. Secondary write: Also persist in auth user_metadata permanently
    const { error: authErr } = await supabase.auth.updateUser({
      data: {
        tos_accepted_at: nowIso,
        tos_version: tosVersion,
        privacy_accepted_at: nowIso,
        terms_version: tosVersion,
      },
    });

    if (authErr && profileErr) {
      console.error("[Consent Capture Error] Failed writing consent to both profiles and auth metadata:", authErr);
      return { success: false, error: authErr.message || profileErr.message };
    }

    console.info(`[Consent Capture] Successfully recorded ToS v${tosVersion} and Privacy consent for user ${userId} at ${nowIso}`);
    return { success: true };
  } catch (err: any) {
    console.error("[Consent Capture] Exception while recording consent:", err);
    return { success: false, error: err.message || "Failed to persist legal consent" };
  }
}

/**
 * Deletes all rows associated with a user across every table in the shared database
 * (profiles, progress, quick_notes, user_plan, chat_sessions, chat_messages, murgii_usage, murgii_memory, challenge_results)
 * and revokes the Supabase authentication session.
 */
export async function deleteUserAccountAndData(
  userId: string,
  userEmail?: string
): Promise<AccountDeletionResult> {
  if (!userId) {
    return {
      success: false,
      tablesDeleted: [],
      tablesFailed: [{ table: "all", error: "Missing user ID" }],
      error: "User ID is required to execute account deletion.",
    };
  }

  const cleanUserId = userId.trim();
  const tablesDeleted: string[] = [];
  const tablesFailed: { table: string; error: string }[] = [];

  console.warn(`[Account Deletion] Initiating permanent multi-table deletion for user: ${cleanUserId}`);

  // List of all database tables containing user personal or activity data
  const tablesToDeleteByUser: { table: string; idColumn: string }[] = [
    { table: "chat_messages", idColumn: "user_id" },
    { table: "chat_sessions", idColumn: "user_id" },
    { table: "murgii_memory", idColumn: "user_id" },
    { table: "murgii_usage", idColumn: "user_id" },
    { table: "challenge_results", idColumn: "user_id" },
    { table: "progress", idColumn: "user_id" },
    { table: "quick_notes", idColumn: "user_id" },
    { table: "user_plan", idColumn: "user_id" },
    { table: "profiles", idColumn: "id" },
  ];

  for (const item of tablesToDeleteByUser) {
    try {
      const { error } = await supabase
        .from(item.table)
        .delete()
        .eq(item.idColumn, cleanUserId);

      if (error) {
        // Some schemas might use 'id' instead of 'user_id' or vice-versa; retry with fallback column if applicable
        if (item.idColumn === "user_id") {
          const { error: retryError } = await supabase
            .from(item.table)
            .delete()
            .eq("id", cleanUserId);

          if (retryError) {
            console.warn(`[Account Deletion] Table ${item.table} deletion notice:`, error.message);
            tablesFailed.push({ table: item.table, error: error.message });
          } else {
            tablesDeleted.push(item.table);
          }
        } else {
          console.warn(`[Account Deletion] Table ${item.table} deletion notice:`, error.message);
          tablesFailed.push({ table: item.table, error: error.message });
        }
      } else {
        tablesDeleted.push(item.table);
      }
    } catch (err: any) {
      console.warn(`[Account Deletion] Error deleting from ${item.table}:`, err?.message || err);
      tablesFailed.push({ table: item.table, error: err?.message || "Unknown table deletion error" });
    }
  }

  // Also purge local browser storage caches for this user
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.removeItem("murgii_last_activity_timestamp");
      localStorage.removeItem("murgii_last_active_session_id");
      localStorage.removeItem(`murgii_memory_${cleanUserId}`);
      localStorage.removeItem(`murgii_chat_sessions_${cleanUserId}`);
      localStorage.removeItem(`murgii_active_session_${cleanUserId}`);

      // Purge any other murgii keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes(cleanUserId) || key.startsWith("murgii_"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (storageErr) {
      console.warn("[Account Deletion] Local storage purge warning:", storageErr);
    }
  }

  // Attempt to call admin deletion RPC or Edge Function if configured on the shared Supabase project
  try {
    await supabase.rpc("delete_user_account", { target_user_id: cleanUserId });
  } catch {
    // RPC is optional if direct table RLS allows user self-delete
  }

  try {
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "https://omeqbiksjqyeqkxnkflh.supabase.co";
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (token) {
      await fetch(`${supabaseUrl.replace(/\/$/, "")}/functions/v1/delete-user-account`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: cleanUserId, email: userEmail }),
      }).catch(() => {});
    }
  } catch {
    // Edge function fallback
  }

  // Revoke the Supabase authentication session immediately
  try {
    await supabase.auth.signOut();
  } catch (signOutErr) {
    console.warn("[Account Deletion] Error during signOut:", signOutErr);
  }

  return {
    success: true,
    tablesDeleted,
    tablesFailed,
  };
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

  try {
    // Primary Query: Match on user_id = auth.uid()
    const { data: primaryData, error: primaryErr } = await supabase
      .from("user_plan")
      .select("*")
      .eq("user_id", cleanUserId)
      .maybeSingle();

    if (!primaryErr && primaryData) {
      planString = primaryData.plan || primaryData.tier || primaryData.subscription_tier || primaryData.plan_name || primaryData.name || "";
      statusString = primaryData.status || primaryData.subscription_status;
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
    tos_accepted_at: user.user_metadata?.tos_accepted_at,
    tos_version: user.user_metadata?.tos_version,
    privacy_accepted_at: user.user_metadata?.privacy_accepted_at,
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
        tos_accepted_at: data.tos_accepted_at || fallbackProfile.tos_accepted_at,
        tos_version: data.tos_version || fallbackProfile.tos_version,
        privacy_accepted_at: data.privacy_accepted_at || fallbackProfile.privacy_accepted_at,
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
    const fullName = (updates.full_name || updates.name || "").trim();
    const payload: Record<string, any> = {
      id: userId,
      full_name: fullName,
    };
    if (updates.email) {
      payload.email = updates.email.trim();
    }
    if (updates.tos_accepted_at) {
      payload.tos_accepted_at = updates.tos_accepted_at;
    }
    if (updates.tos_version) {
      payload.tos_version = updates.tos_version;
    }
    if (updates.privacy_accepted_at) {
      payload.privacy_accepted_at = updates.privacy_accepted_at;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (profileError) {
      console.warn("Notice: profiles table upsert:", profileError);
    }

    // Update Supabase Auth user_metadata permanently
    const authData: Record<string, any> = {
      name: fullName,
      full_name: fullName,
      username: (updates.username || "").trim(),
      bio: (updates.bio || "").trim(),
    };
    if (updates.tos_accepted_at) authData.tos_accepted_at = updates.tos_accepted_at;
    if (updates.tos_version) authData.tos_version = updates.tos_version;
    if (updates.privacy_accepted_at) authData.privacy_accepted_at = updates.privacy_accepted_at;

    const { error: authError } = await supabase.auth.updateUser({
      data: authData,
    });

    if (authError && profileError) {
      return { success: false, error: authError.message || profileError.message };
    }

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

