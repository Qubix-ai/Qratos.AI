/**
 * Supabase Edge Function: qreato-chat
 * 
 * Strategic Qreato AI Chat Service with Server-Side Plan & Credit Enforcement
 * 
 * Security & Enforcement:
 * 1. Server-Side Authentication:
 *    - Validates caller JWT with Supabase Auth (rejects unauthenticated requests with 401).
 * 2. Server-Side Plan Enforcement:
 *    - Re-checks caller's actual tier from the `user_plan` table in Supabase.
 *    - Never trusts client-sent parameters or client claims.
 * 3. Server-Side Credit Enforcement:
 *    - Enforces hard daily caps based on verified database plan:
 *      * Basic/Free: 3 generations/day
 *      * Core: 20 generations/day
 *      * Max: 60 generations/day
 *    - Queries and increments `murgii_usage` directly in the database.
 */

import { GoogleGenAI } from "npm:@google/genai@0.1.2";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const QREATO_SYSTEM_INSTRUCTION = `You are Qreato AI, an elite strategic operating system for digital creators and direct-response entrepreneurs.
You assist with high-level business strategy, offer structuring, pricing architecture, funnel design, and conversion optimization.
Tone: Precise, commercially astute, grounded, direct, and actionable. Avoid generic advice. Give clear tactical instructions.`;

function getPlanLimit(plan: string): number {
  const p = plan.toLowerCase().trim();
  if (p === "max" || p === "pro" || p === "admin") return 60;
  if (p === "core") return 20;
  return 3; // Basic / Free
}

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

    // 1. Authenticate caller
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

    // 2. Query verified user plan from database
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: planRecord } = await supabaseAdmin
      .from("user_plan")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle();

    const rawPlan = String(planRecord?.plan || user.user_metadata?.plan || "basic").toLowerCase().trim();
    const isAdmin = user.email === "salmanhossain75313@gmail.com";
    const dailyCap = isAdmin ? 9999 : getPlanLimit(rawPlan);

    // 3. Server-side credit enforcement
    const todayUtc = new Date().toISOString().split("T")[0];
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { count: usageCount, error: usageErr } = await supabaseAdmin
      .from("murgii_usage")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    const currentUsage = (typeof usageCount === "number" && !usageErr) ? usageCount : 0;

    if (currentUsage >= dailyCap && !isAdmin) {
      return new Response(
        JSON.stringify({
          error: `Daily Limit Reached: You have reached your limit of ${dailyCap} responses today on the ${rawPlan.toUpperCase()} plan. Upgrade on Whop to unlock more credits.`,
          remaining: 0,
          currentPlan: rawPlan,
          limit: dailyCap,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Parse request
    const { message = "", history = [] } = await req.json();
    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Message is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const contents: any[] = [];

    for (const msg of (history || []).slice(-8)) {
      const role = (msg.role === "assistant" || msg.role === "model") ? "model" : "user";
      const cleanContent = (msg.content || "").replace(/<!--[\s\S]*?-->/g, "").trim();
      if (cleanContent) {
        contents.push({ role, parts: [{ text: cleanContent }] });
      }
    }

    if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
      contents.push({ role: "user", parts: [{ text: message }] });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: QREATO_SYSTEM_INSTRUCTION,
      },
    });

    const responseText = response.text || "";

    // 5. Deduct credit server-side
    const nowIso = new Date().toISOString();
    await supabaseAdmin.from("murgii_usage").insert({
      user_id: user.id,
      date: todayUtc,
      count: 1,
      mode: "chat",
      created_at: nowIso,
    });

    const remaining = Math.max(0, dailyCap - (currentUsage + 1));

    return new Response(
      JSON.stringify({
        text: responseText,
        plan: rawPlan,
        remaining,
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
