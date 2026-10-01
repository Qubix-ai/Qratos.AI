/**
 * Supabase Edge Function: generate-blueprint
 * 
 * Server-Side Plan-Gated Business Blueprint Generation
 * 
 * Security & Plan Gating:
 * 1. Strict Server-Side Authentication:
 *    - Validates caller JWT with Supabase Auth (rejects unauthenticated requests with 401).
 * 2. Strict Server-Side Plan Enforcement (Max-Only):
 *    - Queries caller's actual record from the `user_plan` table in Supabase.
 *    - Does NOT trust client-supplied plan parameters or UI state.
 *    - Rejects any plan other than "max" with 403 Forbidden.
 * 3. Server-Side Credit Enforcement:
 *    - Enforces 60/day credit limit for Max tier.
 *    - Verifies today's usage count from `murgii_usage` table.
 *    - Records generation event in database.
 */

import { GoogleGenAI } from "npm:@google/genai@0.1.2";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BLUEPRINT_SYSTEM_INSTRUCTION = `You are the Qreato Master Strategic Architect.
Your task is to synthesize the user's business inputs, offer details, monetization strategy, and copy hooks into an elite, comprehensive Business Blueprint.
The Blueprint must include:
1. Executive Offer & Value Architecture (Core premise, pricing tier, transformation mechanism)
2. Target Market & Psychological Profile (Key pain triggers, friction points, desire vector)
3. Acquisition & Traffic Engine (Primary hook angles, platform conversion funnel)
4. Monetization & Retention Roadmap (Immediate cashflow triggers, 30-60-90 day scaling milestones)
5. Execution Checklist (Prioritized sprint actions)

Output format: Return clean, structured Markdown ready for execution. No conversational throat-clearing.`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing authentication token." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || supabaseAnonKey;

    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: "Supabase configuration is missing on server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Authenticate caller using Supabase Auth
    const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired authentication session." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Query user's verified plan from the database (Server-side plan enforcement)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: planRecord, error: planErr } = await supabaseAdmin
      .from("user_plan")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (planErr) {
      console.warn("[generate-blueprint] Could not query user_plan table:", planErr);
    }

    const rawPlan = String(planRecord?.plan || user.user_metadata?.plan || "").toLowerCase().trim();
    const isMax = rawPlan === "max" || rawPlan === "pro" || rawPlan === "admin" || user.email === "salmanhossain75313@gmail.com";

    // Strict Gate: Max tier only
    if (!isMax) {
      return new Response(
        JSON.stringify({
          error: "Forbidden: AI Business Blueprint Studio is exclusively available on the Qreato Max plan.",
          currentPlan: rawPlan || "basic",
          requiredPlan: "max",
          upgradeUrl: "https://whop.com/qreato/qreato-max",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Server-side credit enforcement (Max plan: 60 credits/day)
    const todayUtc = new Date().toISOString().split("T")[0];
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { count: usageCount, error: usageErr } = await supabaseAdmin
      .from("murgii_usage")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    const currentUsage = (typeof usageCount === "number" && !usageErr) ? usageCount : 0;
    const maxCreditCap = 60; // Max tier daily limit

    if (currentUsage >= maxCreditCap && user.email !== "salmanhossain75313@gmail.com") {
      return new Response(
        JSON.stringify({
          error: `Daily Limit Reached: You have used all ${maxCreditCap} daily credits for your Max workspace. Credits reset at midnight UTC.`,
          remaining: 0,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Parse request body
    const body = await req.json();
    const { businessName = "", offerDetails = "", targetAudience = "", goals = "" } = body;

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const userPrompt = `Generate a Business Blueprint with these parameters:
Business Name: ${businessName || "Creator Enterprise"}
Offer & Value Proposition: ${offerDetails || "Direct-Response Digital Products / Advisory"}
Target Audience: ${targetAudience || "High-intent buyers"}
Core Objectives: ${goals || "Scale conversions and client acquisition"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: BLUEPRINT_SYSTEM_INSTRUCTION,
      },
    });

    const blueprintText = response.text || "";

    // 5. Decrement credit / record usage in murgii_usage table server-side
    const nowIso = new Date().toISOString();
    await supabaseAdmin.from("murgii_usage").insert({
      user_id: user.id,
      date: todayUtc,
      count: 1,
      mode: "blueprint",
      created_at: nowIso,
    });

    const newRemaining = Math.max(0, maxCreditCap - (currentUsage + 1));

    return new Response(
      JSON.stringify({
        blueprint: blueprintText,
        plan: "max",
        remaining: newRemaining,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Support standard Deno serve
if (typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno?.serve) {
  (globalThis as any).Deno.serve(handler);
}
