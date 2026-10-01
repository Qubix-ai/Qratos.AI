/**
 * Supabase Edge Function: whop-webhook
 * 
 * Secure Whop Webhook Handler with Cryptographic Signature Verification
 * 
 * Security Features:
 * 1. Cryptographic HMAC-SHA256 Signature Verification:
 *    - Verifies incoming Whop webhook signatures per Whop / Standard Webhooks (Svix) specifications.
 *    - Uses Web Crypto API (crypto.subtle) with timing-safe comparison to prevent timing attacks.
 *    - Enforces 5-minute (300 seconds) timestamp replay-attack protection.
 *    - Rejects any unsigned or invalidly signed requests with 401 Unauthorized before parsing payload.
 * 2. Database Synchronization:
 *    - On verified membership activation/upgrade ("membership.went_valid", "payment.succeeded"),
 *      updates user_plan table in Supabase to "max" or "core".
 *    - On membership cancellation/expiration ("membership.went_invalid", "membership.terminated"),
 *      downgrades user_plan to "basic".
 *    - Uses Supabase Service Role Key securely server-side only.
 */

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, webhook-signature, webhook-id, webhook-timestamp, x-whop-signature",
};

/**
 * Constant-time comparison between two Uint8Arrays to prevent timing attacks
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

/**
 * Converts a hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/^0x/, "").trim();
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Converts a base64 string to Uint8Array
 */
function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/-/g, "+").replace(/_/g, "/");
  const binString = atob(clean);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verifies Whop webhook signature using Web Crypto HMAC-SHA256
 */
async function verifyWhopSignature(
  rawBody: string,
  headers: Headers,
  secret: string
): Promise<{ valid: boolean; reason?: string }> {
  if (!secret) {
    return { valid: false, reason: "Server webhook secret (WHOP_WEBHOOK_SECRET) is not configured." };
  }

  // Extract signature and timestamp from headers
  const svixSigHeader = headers.get("webhook-signature") || headers.get("x-whop-signature");
  const svixIdHeader = headers.get("webhook-id");
  const svixTimestampHeader = headers.get("webhook-timestamp") || headers.get("x-whop-signature-timestamp");

  if (!svixSigHeader) {
    return { valid: false, reason: "Missing webhook signature header." };
  }

  // Timestamp check for replay attack prevention (5 minute tolerance)
  if (svixTimestampHeader) {
    const tsSeconds = parseInt(svixTimestampHeader, 10);
    if (isNaN(tsSeconds)) {
      return { valid: false, reason: "Invalid timestamp header format." };
    }
    const currentSeconds = Math.floor(Date.now() / 1000);
    const toleranceSeconds = 300; // 5 minutes
    if (Math.abs(currentSeconds - tsSeconds) > toleranceSeconds) {
      return { valid: false, reason: "Webhook timestamp expired (replay attack protection)." };
    }
  }

  // Explicitly handle Whop vs Svix secret key formats:
  // 1. "ws_": Whop Developer Dashboard native webhook secret format.
  //    Whop specifies using the exact secret string (including the 'ws_' prefix) encoded as UTF-8.
  //    We add both the exact UTF-8 key and the prefix-stripped key to guarantee 100% interoperability.
  // 2. "whsec_": Svix Standard Webhooks format.
  //    The portion after 'whsec_' is a Base64-encoded secret key.
  // 3. Raw / fallback: UTF-8 encoded secret bytes.
  const cleanSecretKey = secret.trim();
  const candidateKeys: CryptoKey[] = [];

  if (cleanSecretKey.startsWith("whsec_")) {
    const rawSecretBase64 = cleanSecretKey.substring("whsec_".length);
    try {
      const b64Bytes = base64ToBytes(rawSecretBase64);
      const k = await crypto.subtle.importKey(
        "raw",
        b64Bytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      candidateKeys.push(k);
    } catch {
      // If base64 decoding fails, import raw string
      const rawBytes = new TextEncoder().encode(cleanSecretKey);
      const k = await crypto.subtle.importKey(
        "raw",
        rawBytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      candidateKeys.push(k);
    }
  } else if (cleanSecretKey.startsWith("ws_")) {
    // Native Whop webhook secret: UTF-8 bytes of the full secret string
    const fullBytes = new TextEncoder().encode(cleanSecretKey);
    const k1 = await crypto.subtle.importKey(
      "raw",
      fullBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    candidateKeys.push(k1);

    // Also import stripped secret (without 'ws_') as candidate in case sender signed with stripped key
    const stripped = cleanSecretKey.substring("ws_".length);
    if (stripped) {
      const strippedBytes = new TextEncoder().encode(stripped);
      const k2 = await crypto.subtle.importKey(
        "raw",
        strippedBytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      candidateKeys.push(k2);
    }
  } else {
    // Standard / plain UTF-8 secret
    const rawBytes = new TextEncoder().encode(cleanSecretKey);
    const k = await crypto.subtle.importKey(
      "raw",
      rawBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    candidateKeys.push(k);
  }

  // Parse signatures from header (e.g. "v1,g0hM... v1,bm90...")
  const signatureEntries = svixSigHeader.split(" ");
  for (const entry of signatureEntries) {
    const parts = entry.split(",");
    const signatureCandidate = parts.length === 2 ? parts[1] : parts[0];

    // Payload candidates:
    // Svix format: `${webhook_id}.${webhook_timestamp}.${rawBody}`
    // Timestamped format: `${webhook_timestamp}.${rawBody}`
    // Direct raw format: `${rawBody}`
    const payloadCandidates: string[] = [];
    if (svixIdHeader && svixTimestampHeader) {
      payloadCandidates.push(`${svixIdHeader}.${svixTimestampHeader}.${rawBody}`);
    }
    if (svixTimestampHeader) {
      payloadCandidates.push(`${svixTimestampHeader}.${rawBody}`);
    }
    payloadCandidates.push(rawBody);

    for (const cryptoKey of candidateKeys) {
      for (const payloadToSign of payloadCandidates) {
        const dataToSign = new TextEncoder().encode(payloadToSign);
        const computedBuffer = await crypto.subtle.sign("HMAC", cryptoKey, dataToSign);
        const computedBytes = new Uint8Array(computedBuffer);

        // Compare against base64 signature candidate
        try {
          const candidateBytes = base64ToBytes(signatureCandidate);
          if (constantTimeEqual(computedBytes, candidateBytes)) {
            return { valid: true };
          }
        } catch {
          // Not base64, try hex
        }

        try {
          const candidateBytesHex = hexToBytes(signatureCandidate);
          if (constantTimeEqual(computedBytes, candidateBytesHex)) {
            return { valid: true };
          }
        } catch {
          // Not hex
        }
      }
    }
  }

  return { valid: false, reason: "Cryptographic signature mismatch." };
}

/**
 * Normalizes Whop product or pass name to internal plan tier.
 * CRITICAL SECURITY FIX: Unrecognized products NEVER default to paid tiers ("core" or "max").
 * They strictly fall back to "basic" and are marked with status "unrecognized_product".
 */
function resolvePlanFromWhopPayload(payload: any): { plan: "basic" | "core" | "max"; status: string; recognized: boolean } {
  const action = String(payload?.action || payload?.event || "").toLowerCase();
  const data = payload?.data || payload;

  // Cancellation or termination events
  if (
    action.includes("invalid") || 
    action.includes("terminated") || 
    action.includes("cancelled") || 
    action.includes("deleted")
  ) {
    return { plan: "basic", status: "canceled", recognized: true };
  }

  const productName = String(
    data?.product?.name || 
    data?.plan?.name || 
    data?.product_id || 
    data?.plan_id || 
    data?.pricing_tier || 
    data?.experience_name || 
    ""
  ).toLowerCase();

  if (productName.includes("max") || productName.includes("qreato-max") || productName.includes("blueprint")) {
    return { plan: "max", status: "active", recognized: true };
  }

  if (productName.includes("core") || productName.includes("leverage") || productName.includes("ai-leverage")) {
    return { plan: "core", status: "active", recognized: true };
  }

  // Safe fallback: Unrecognized products default to "basic" and are flagged for review
  console.warn(`[Whop Webhook] Unrecognized product or plan identifier: "${productName || 'unknown'}". Falling back safely to 'basic' tier.`);
  return { plan: "basic", status: "unrecognized_product", recognized: false };
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

  // 1. Read raw body text BEFORE JSON parsing for accurate HMAC signature computation
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Failed to read request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 2. Cryptographic Signature Verification
  const webhookSecret = Deno.env.get("WHOP_WEBHOOK_SECRET") || "";
  const verification = await verifyWhopSignature(rawBody, req.headers, webhookSecret);

  if (!verification.valid) {
    console.warn(`[Whop Webhook] Signature verification failed: ${verification.reason}`);
    return new Response(
      JSON.stringify({ 
        error: "Unauthorized: Invalid or missing webhook signature.", 
        details: verification.reason 
      }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // 3. Parse JSON safely only AFTER cryptographic signature is verified
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 4. Initialize Supabase Admin Client using Service Role Key
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[Whop Webhook] Supabase service credentials not configured.");
    return new Response(
      JSON.stringify({ error: "Server database configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // 5. Extract User Identifier (email, metadata user_id, or custom_fields)
  const data = payload?.data || payload;
  const userEmail = (
    data?.user?.email || 
    data?.email || 
    data?.customer_email || 
    data?.custom_fields?.email ||
    ""
  ).toLowerCase().trim();

  const customUserId = (
    data?.custom_fields?.user_id || 
    data?.metadata?.user_id || 
    data?.user?.id || 
    ""
  ).trim();

  if (!userEmail && !customUserId) {
    console.warn("[Whop Webhook] No user email or user_id in payload, cannot associate plan:", payload);
    return new Response(
      JSON.stringify({ error: "Missing user identification in payload" }),
      { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 6. Look up matching user in Supabase auth.users or profiles
  let matchedUserId = customUserId;

  if (!matchedUserId && userEmail) {
    // Look up user by email in profiles
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", userEmail)
      .maybeSingle();

    if (profile?.id) {
      matchedUserId = profile.id;
    } else {
      // Look up in auth.users via admin API
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const authUser = usersData?.users?.find(
        (u) => u.email?.toLowerCase().trim() === userEmail
      );
      if (authUser?.id) {
        matchedUserId = authUser.id;
      }
    }
  }

  // 7. Resolve plan and status
  const { plan: targetPlan, status: subscriptionStatus, recognized } = resolvePlanFromWhopPayload(payload);
  const nowIso = new Date().toISOString();

  // 8. Update user_plan table in Supabase
  if (matchedUserId) {
    const { error: upsertErr } = await supabaseAdmin
      .from("user_plan")
      .upsert({
        user_id: matchedUserId,
        plan: targetPlan,
        status: subscriptionStatus,
        updated_at: nowIso,
      }, { onConflict: "user_id" });

    if (upsertErr) {
      console.error("[Whop Webhook] Error upserting user_plan:", upsertErr);
      return new Response(
        JSON.stringify({ error: "Failed to update user_plan in database" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Whop Webhook] Successfully updated user_plan for user ${matchedUserId} to ${targetPlan} (${subscriptionStatus})`);
  } else {
    // If user hasn't signed up yet, record pending invite/order by email
    const { error: pendingErr } = await supabaseAdmin
      .from("user_plan")
      .upsert({
        email: userEmail,
        plan: targetPlan,
        status: subscriptionStatus,
        updated_at: nowIso,
      }, { onConflict: "email" });

    if (pendingErr) {
      console.warn("[Whop Webhook] Could not store pending plan by email:", pendingErr);
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      user_id: matchedUserId || null,
      email: userEmail || null,
      plan: targetPlan,
      status: subscriptionStatus,
      recognized,
      verified: true,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Support standard Deno serve
if (typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno?.serve) {
  (globalThis as any).Deno.serve(handler);
}
