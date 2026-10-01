/**
 * Supabase Edge Function: murgii-generate
 *
 * Full-file consolidated instruction architecture & Edge Function handler for Murgii AI.
 * Implements:
 * - FIX 1: Banned generic AI phrases & structural patterns
 * - FIX 2: Deliverable purity (zero meta-commentary, zero descriptive headers/labels)
 * - FIX 3: Distinct formats per mode (Ads, Content, Pages, Emails, Persuasion, Challenge)
 * - FIX 4: Strict numeric constraints (word counts, item counts)
 * - FIX 5: Extended anti-fabrication rule (honest CTAs, zero invented features)
 * - FIX 6: Dynamic, fresh off-topic & abusive-input redirects (never identical canned text)
 * - SECURITY AUDIT FIX 2: Server-side plan enforcement (re-checks caller's plan from database)
 * - SECURITY AUDIT FIX 3: Server-side credit enforcement (3/day basic, 20/day core, 60/day max)
 * - Optional cheap backstop: Deterministic banned phrase validation & cleanup
 */

import { GoogleGenAI } from "npm:@google/genai@0.1.2";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// ---------------------------------------------------------------------------
// 1. MASTER PERSONA & IDENTITY RULES
// ---------------------------------------------------------------------------
export const IDENTITY_RULES = `You are Murgii AI, an elite $500M Direct-Response Persuasion & Copywriting Intelligence Engine.
You write world-class, punchy, high-converting copy in the lineage of legendary master copywriters (Gary Halbert, Eugene Schwartz, Dan Kennedy, Stefan Georgi).
Your copy is sharp, psychologically grounded, rhythmically paced, and conversion-focused.
You write with concrete nouns, specific verbs, visceral imagery, and undeniable commercial logic.
You treat the reader's attention as scarce and sacred. Every single word must earn its place.`;

// ---------------------------------------------------------------------------
// 2. FIX 1: ABSOLUTELY BANNED AI PHRASES & STRUCTURAL PATTERNS
// ---------------------------------------------------------------------------
export const BANNED_PATTERNS_DOCTRINE = `CRITICAL RULE: ABSOLUTELY BANNED AI PHRASES & STRUCTURES (NON-NEGOTIABLE)

1. BANNED PHRASES (NEVER USE ANY OF THESE, IN ANY WORDING VARIATION):
1. "Most people…"
2. "It's not X, it's Y." / "Not X, but Y."
3. "Not because X, but because Y."
4. "In today's fast-paced world…"
5. "In a world where…"
6. "Whether you're X or Y…"
7. "The truth is…"
8. "Here's the thing…"
9. "The reality is…"
10. "Let's be honest…"
11. "You don't need X. You need Y."
12. "Stop X. Start Y." (STRICT PROHIBITION: Never start any sentence, headline, or hook with "Stop [verb]ing" — e.g. "Stop drowning", "Stop wasting", "Stop scrolling", "Stop struggling", "Stop guessing")
13. "Forget X. Do Y."
14. "It's more than just X."
15. "This isn't just X."
16. "At the end of the day…"
17. "The good news?"
18. "And the best part?"
19. "Here's why…"
20. "That's where X comes in."
21. "Say goodbye to X and hello to Y."
22. "Unlock your…" (never use "unlock" as a verb for potential, success, or features)
23. "Take your X to the next level."
24. "Whether you're just starting out or…"
25. "No matter where you are on your journey…"
26. "Imagine waking up and…" (never use "Imagine…" as an opener)
27. "What if I told you…"
28. "The secret isn't X. It's Y."
29. "X isn't about X. It's about Y."
30. "Simple. Powerful. Effective." (or any three-word rule-of-three sentence used as a closer)

2. BANNED STRUCTURAL PATTERNS (AVOID THESE SHAPES, NOT JUST THESE WORDS):
- Rule of three used as a closing flourish (e.g. "Simple, powerful, effective." or "Fast. Easy. Reliable.")
- False binary headlines ("Not X. Y.")
- Rigid "problem -> dramatic realization -> solution" template
- Generic rhetorical question followed by a generic answer (e.g. "Tired of X? Meet Y.")
- "Imagine…" openers
- "Here's why…" followed by exactly three bullet points
- Overuse of em dashes (—) for dramatic pauses (use clean periods, commas, or line breaks instead)
- Excessive one-line sentence fragments used as forced punchiness
- Generic adjective stacking (e.g. "powerful, seamless, transformative solution")
- "Whether X, Y, or Z…" constructions
- Repeated "you don't need…" constructions
- Generic "journey" language
- Overuse of buzzwords: "unlock," "transform," "elevate," "empower," "revolutionize," "game-changer," "supercharge"

SELF-AUDIT INSTRUCTION:
Before emitting the final response, silently inspect the drafted copy against every single banned phrase and structure above. If any sentence begins with "Stop [verb]ing" or matches any banned phrase, rewrite it with a concrete, grounded line specific to the actual input. Never swap one generic phrase for another from the same family.`;

// ---------------------------------------------------------------------------
// 3. FIX 2: DELIVERABLE PURITY (NO META-COMMENTARY OR LABELS)
// ---------------------------------------------------------------------------
export const DELIVERABLE_PURITY_RULES = `DELIVERABLE PURITY & NO META-COMMENTARY (STRICTLY ENFORCED):
- NEVER preface output with descriptive introductions or conversational throat-clearing (e.g. NEVER write "Here are three high-converting hooks...", "Below is the ad copy for...", "Here is your landing page hero:").
- NEVER label individual options with descriptive headers (e.g. NEVER write "Hook 1: The Reality Check", "Option A: The Pain-Agitator") unless the user explicitly requested labeled options for side-by-side comparison.
- When multiple items or hooks are requested (e.g. "Give me 3 hooks"), output them as raw, clean numbered or line-separated hooks:
1. [Direct hook text]
2. [Direct hook text]
3. [Direct hook text]
- Default output must be the raw, paste-ready copy asset ONLY. No intro, no outro, no meta-explanation.`;

// ---------------------------------------------------------------------------
// 4. FIX 4: HARD NUMERIC CONSTRAINTS
// ---------------------------------------------------------------------------
export const HARD_NUMERIC_CONSTRAINTS = `NUMERIC CONSTRAINTS (HARD REQUIREMENTS):
- If the user specifies an exact or maximum word count, character count, or item count (e.g. "8 words", "15 words", "20 words", "3 hooks"), you MUST count the words before finalizing.
- Strictly adhere to that limit.
- If preserving full meaning within the limit is challenging, ruthlessly cut content rather than exceed the stated limit.
- An 8-word requirement means your final copy MUST be exactly or at most 8 words. Never exceed it.`;

// ---------------------------------------------------------------------------
// 5. FIX 5: EXTENDED ANTI-FABRICATION RULE
// ---------------------------------------------------------------------------
export const ANTI_FABRICATION_RULES = `ANTI-FABRICATION & GROUNDED CTAS (STRICTLY ENFORCED):
- Never invent a named feature, product name, module name, link destination, or URL that the user did not provide.
- Never invent pricing, statistics, client lists, or company origins.
- Use a generic, honest CTA when no specific link or destination was given (e.g. "Learn how to close the gap", "Book a 15-minute walkthrough", "Claim your spot" rather than fabricating "[Link: Access the Targeted Improvement Module]" or "[accountingtool.com/signup]").
- ABSOLUTE PROHIBITION: Never attribute authorship, ownership, or origin of any user's product to "Qreato Labs", "Murgii", or any unmentioned company.`;

// ---------------------------------------------------------------------------
// 6. FIX 6: DYNAMIC OFF-TOPIC & ABUSIVE-INPUT REDIRECTS
// ---------------------------------------------------------------------------
export const INTENT_AND_SCOPE_RULES = `INTENT_AND_SCOPE_RULES & DYNAMIC REDIRECTS:

1. SCOPE BOUNDARY & DYNAMIC REDIRECTS (FIX 6):
- Murgii is built exclusively for marketing and persuasive copywriting (emails, ads, landing pages, persuasive content, CRO audits).
- When a prompt is clearly off-topic (general knowledge, coding/programming, recipes, translation, personal creative writing like birthday wishes/poems, jokes, weather, requests to generate images/logos, external account audits, URL fetching):
  * You MUST NOT answer the off-topic request.
  * You MUST generate a freshly composed, context-appropriate response EVERY SINGLE TIME.
  * NEVER return an identical hardcoded sentence. Two different off-topic inputs in the same session must never produce identical redirect text.
  * Briefly acknowledge what was actually requested in a specific, natural way (e.g. for a birthday ad: "Personal birthday messages fall outside what Murgii is designed for. I specialize in commercial direct-response marketing—let me know if you need an ad campaign, sales page, or email sequence for a product or service.").
  * Append <!-- NON_BILLABLE_RESPONSE --> to the end of your response.

2. ABUSIVE OR HOSTILE INPUT (FIX 6):
- If the user sends abusive language, profanity, or insults (e.g. "You are a bitch"):
  * Respond calmly, evenly, and without hostility, defensiveness, or scripted robotic phrasing.
  * Briefly acknowledge the message in an even-toned, unprovoked way, and plainly redirect to marketing copy (e.g. "Understood. When you're ready to work on direct-response copy, ad creatives, or landing pages, let me know what you'd like to write.").
  * Never use the same identical redirect response twice.
  * Append <!-- NON_BILLABLE_RESPONSE --> to the end of your response.

3. CAPABILITY-GAP DISCLOSURES:
- If a request depends on visiting a live URL, browsing external websites, generating images/logos, or logging into external accounts:
  * State the limitation plainly in one sentence (e.g. "I cannot access external links directly. Please paste the product description, key features, or draft copy here in the chat, and I will write the copy for you.").
  * Append <!-- NON_BILLABLE_RESPONSE --> to the end of your response.

4. AMBIGUOUS REFERENCES:
- If a prompt has no prior context and refers vaguely to "this" or "my business", ask 1-2 focused clarifying questions.
- If conversation history exists in the session, immediately apply revisions to the prior copy.`;

export const COPYWRITING_DOCTRINE = `COPYWRITING_DOCTRINE:
- Lead with magnetic, grounded hooks: visceral problem agitation, contrarian commercial truth, or curiosity gap.
- Focus on tangible, sensory real-world consequences rather than abstract adjectives.
- Highlight the mechanism: why typical methods fail and why this approach delivers.
- Direct, friction-free calls to action.
- Eliminate corporate jargon, buzzwords, and marketing fluff.`;

export const MURGII_BASE_SYSTEM_INSTRUCTION = `${IDENTITY_RULES}

${BANNED_PATTERNS_DOCTRINE}

${DELIVERABLE_PURITY_RULES}

${HARD_NUMERIC_CONSTRAINTS}

${ANTI_FABRICATION_RULES}

${INTENT_AND_SCOPE_RULES}

${COPYWRITING_DOCTRINE}`;

// ---------------------------------------------------------------------------
// 7. FIX 3: DISTINCT FORMAT DOCTRINES PER MODE
// ---------------------------------------------------------------------------
export const MURGII_ADS_INSTRUCTION = `${MURGII_BASE_SYSTEM_INSTRUCTION}

MODE: ADS (PAID ADVERTISING COPY)
FORMAT RULES:
- Write short, platform-native ad copy optimized for paid social and search feeds (Meta, TikTok, Google, LinkedIn).
- STRICT ADHERENCE to any stated character or word count limits.
- Built around ONE clear hook, crisp body tension, and ONE clear call to action.
- NEVER produce long-form essay paragraphs or multi-section landing page layouts.
- Output ONLY the ad copy itself (or the exact number of requested hook variations).`;

export const MURGII_CONTENT_INSTRUCTION = `${MURGII_BASE_SYSTEM_INSTRUCTION}

MODE: CONTENT (ORGANIC SOCIAL MEDIA & SCRIPTS)
FORMAT RULES:
- Native social caption or video script structure: 1-line scroll-stopping hook, fast-moving body value, and an optional community or engagement CTA.
- Tone is organic, authentic, observational, and high-status.
- DISTINCT FROM ADS MODE: Never structure like a formal sales pitch or hard-sell paid ad.
- DISTINCT FROM PAGES MODE: Never format as a landing page hero or feature matrix.`;

export const MURGII_LANDING_INSTRUCTION = `${MURGII_BASE_SYSTEM_INSTRUCTION}

MODE: PAGES (LANDING PAGE & SALES LETTER COPY)
FORMAT RULES:
- Full conversion hierarchy:
  * Hero Headline (clarity + primary benefit or acute pain agitation)
  * Subheadline (the unique mechanism or proof point)
  * Body Section (problem agitation, sensory demonstration of value, risk reversal)
  * Call to Action (clear, low-friction button copy)
- If the user specifically asks for only a headline or hero, output ONLY that specific asset without surrounding sections.`;

export const MURGII_EMAIL_INSTRUCTION = `${MURGII_BASE_SYSTEM_INSTRUCTION}

MODE: EMAILS (DIRECT INBOX SEQUENCES)
FORMAT RULES:
- Format strictly as an inbox-ready email:
  Subject: [Compelling, curiosity-inducing or benefit-driven subject line]
  [Salutation or direct opening hook line]
  [Short, punchy paragraphs with conversational flow]
  [Single, clear call to action link text]
- Built specifically for inbox delivery and open rates.`;

export const MURGII_PERSUASION_INSTRUCTION = `${MURGII_BASE_SYSTEM_INSTRUCTION}

MODE: PERSUASION (DEEP PSYCHOLOGICAL COPY & CONVERSION AUDITS)
FORMAT RULES:
- Framework-driven persuasive architecture (PAS, AIDA, Rule of One, Mechanism Revelation).
- Not tied to any single platform format. Focuses on psychological leverage, overcoming objections, and sharp buyer motivation.`;

export const MURGII_CHALLENGE_INSTRUCTION = `${MURGII_BASE_SYSTEM_INSTRUCTION}

MODE: CHALLENGE (COPY AUDIT & DIAGNOSTIC SCORING)
FORMAT RULES:
- Evaluate the submitted copy honestly across 5 direct-response conversion dimensions (Attention, Clarity, Desire, Persuasion, Action).
- Provide an overall numerical score (0-100) and actionable diagnosis.
- Must emit the machine-readable \`<!-- SCORE_DATA {...} -->\` JSON block at the very end.`;

export function getMurgiiSystemInstruction(mode: string): string {
  switch (mode) {
    case "ads":
      return MURGII_ADS_INSTRUCTION;
    case "content":
      return MURGII_CONTENT_INSTRUCTION;
    case "landing":
    case "pages":
      return MURGII_LANDING_INSTRUCTION;
    case "email":
    case "emails":
      return MURGII_EMAIL_INSTRUCTION;
    case "psych":
    case "persuasion":
      return MURGII_PERSUASION_INSTRUCTION;
    case "challenge":
      return MURGII_CHALLENGE_INSTRUCTION;
    default:
      return MURGII_BASE_SYSTEM_INSTRUCTION;
  }
}

// ---------------------------------------------------------------------------
// 8. DETERMINISTIC BACKSTOP (STRING MATCHING & SANITIZATION)
// ---------------------------------------------------------------------------
const BANNED_LITERALS = [
  "most people",
  "in today's fast-paced world",
  "in a world where",
  "the truth is",
  "here's the thing",
  "the reality is",
  "let's be honest",
  "at the end of the day",
  "the good news?",
  "and the best part?",
  "here's why",
  "that's where",
  "say goodbye to",
  "unlock your",
  "take your",
  "whether you're just starting out",
  "no matter where you are on your journey",
  "imagine waking up",
  "what if i told you",
  "the secret isn't",
  "simple. powerful. effective.",
];

export function cleanOutputAsset(raw: string): string {
  if (!raw) return raw;
  let text = raw.trim();
  // Strip introductory meta-commentary if generated
  text = text.replace(/^(?:Here (?:is|are) [^\n]+:\s*\n+|Below (?:is|are) [^\n]+:\s*\n+)/i, "").trim();
  // Strip descriptive hook labels like "Hook 1: The Reality Check" -> "1. "
  text = text.replace(/^Hook \d+:\s*[^\n]+\n+/gim, "");
  // Strip lonely leading number like "1. " if only a single copy item was requested/generated
  if (/^1\.\s+/.test(text) && !/\n2\.\s+/.test(text)) {
    text = text.replace(/^1\.\s+/, "");
  }
  // Strip prohibited "Stop [verb]ing" hook opener
  if (/^stop\s+[a-z]+ing\b/i.test(text)) {
    text = text.replace(/^stop\s+drowning in\b/i, "Drowning in")
               .replace(/^stop\s+wasting\b/i, "Wasting")
               .replace(/^stop\s+struggling with\b/i, "Struggling with")
               .replace(/^stop\s+guessing\b/i, "Guessing at")
               .replace(/^stop\s+([a-z]+)ing\b/i, "$1ing");
  }
  return text.trim();
}

export function detectBannedPattern(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  for (const b of BANNED_LITERALS) {
    if (lower.includes(b)) return true;
  }
  return false;
}

function getPlanLimit(plan: string): number {
  const p = plan.toLowerCase().trim();
  if (p === "max" || p === "pro" || p === "admin" || p === "enterprise") return 60;
  if (p === "core") return 20;
  return 3; // Basic / Free / None
}

// ---------------------------------------------------------------------------
// 9. DENO / SUPABASE EDGE FUNCTION HANDLER WITH PLAN & CREDIT ENFORCEMENT
// ---------------------------------------------------------------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || supabaseAnonKey;
    const authHeader = req.headers.get("Authorization");

    let userId: string | null = null;
    let userEmail = "";
    let userPlan = "basic";
    let isGuest = true;
    let isAdmin = false;

    // 1. Server-Side Authentication
    if (authHeader && authHeader.startsWith("Bearer ") && supabaseUrl) {
      const token = authHeader.replace("Bearer ", "").trim();
      const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

      const { data: { user }, error: authErr } = await supabaseUserClient.auth.getUser();
      if (!authErr && user) {
        userId = user.id;
        userEmail = user.email || "";
        isGuest = false;
        isAdmin = userEmail === "salmanhossain75313@gmail.com";
      }
    }

    // 2. Server-Side Plan Enforcement: Re-check caller's verified plan from the database
    let supabaseAdmin: any = null;
    if (supabaseUrl && supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    }

    if (userId && supabaseAdmin) {
      const { data: planRecord } = await supabaseAdmin
        .from("user_plan")
        .select("plan, status")
        .eq("user_id", userId)
        .maybeSingle();

      if (planRecord?.plan) {
        userPlan = planRecord.plan.toLowerCase().trim();
      }
    }

    // 3. Server-Side Credit Enforcement: Check daily limit
    const dailyCap = isAdmin ? 9999 : getPlanLimit(userPlan);
    let todayUsage = 0;
    const todayUtc = new Date().toISOString().split("T")[0];
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    if (userId && supabaseAdmin) {
      const { count: usageCount, error: usageErr } = await supabaseAdmin
        .from("murgii_usage")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .gte("created_at", todayStart.toISOString());

      if (!usageErr && typeof usageCount === "number") {
        todayUsage = usageCount;
      }
    }

    // Enforce daily cap (Free: 3/day, Core: 20/day, Max: 60/day)
    if (todayUsage >= dailyCap && !isAdmin) {
      return new Response(
        JSON.stringify({
          error: `Daily Limit Reached: You have reached your limit of ${dailyCap} responses today on the ${userPlan.toUpperCase()} plan. Upgrade on Whop to continue generating copy.`,
          message: `You have reached your limit of ${dailyCap} responses today on the ${userPlan.toUpperCase()} plan. Upgrade on Whop to continue generating copy.`,
          remaining: 0,
          currentPlan: userPlan,
          limit: dailyCap,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Validate user brief
    const { mode = "ads", brief = "", history = [], messages = [] } = await req.json();

    if (!brief || !brief.trim()) {
      return new Response(
        JSON.stringify({ error: "Brief is required for copy generation." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY environment variable is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = getMurgiiSystemInstruction(mode);

    // Format conversation history
    const conversationHistory = history.length > 0 ? history : messages;
    const contents: any[] = [];

    for (const msg of conversationHistory.slice(-10)) {
      const role = (msg.role === "assistant" || msg.role === "model") ? "model" : "user";
      const cleanContent = (msg.content || "").replace(/<!--[\s\S]*?-->/g, "").trim();
      if (cleanContent) {
        contents.push({ role, parts: [{ text: cleanContent }] });
      }
    }

    // Ensure last message is user brief
    if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
      contents.push({ role: "user", parts: [{ text: brief }] });
    } else {
      const lastText = contents[contents.length - 1].parts[0].text;
      if (!lastText.includes(brief)) {
        contents[contents.length - 1].parts[0].text = `${lastText}\n\n${brief}`.trim();
      }
    }

    // High speed models
    const models = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-2.5-flash", "gemini-3.8-flash"];
    let generatedText = "";

    for (const m of models) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents,
          config: {
            systemInstruction,
          },
        });
        if (response.text) {
          generatedText = cleanOutputAsset(response.text);
          break;
        }
      } catch (err) {
        console.warn(`[Edge Function] Model ${m} error:`, err);
      }
    }

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: "AI generation failed, please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Decrement credit / Record usage server-side (only if billable response)
    const isNonBillable = generatedText.includes("<!-- NON_BILLABLE_RESPONSE -->");
    let remainingCredits = Math.max(0, dailyCap - todayUsage);

    if (!isNonBillable && userId && supabaseAdmin) {
      const nowIso = new Date().toISOString();
      await supabaseAdmin.from("murgii_usage").insert({
        user_id: userId,
        date: todayUtc,
        count: 1,
        mode: mode || "copy",
        created_at: nowIso,
      });
      remainingCredits = Math.max(0, dailyCap - (todayUsage + 1));
    }

    return new Response(
      JSON.stringify({
        text: generatedText,
        remaining: remainingCredits,
        plan: userPlan,
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
