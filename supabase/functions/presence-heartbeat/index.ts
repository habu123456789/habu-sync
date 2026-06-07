// Site presence heartbeat — uses service role to upsert the row for the
// current visitor without exposing public UPDATE privileges on the table.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const VISITOR_RE = /^[a-z0-9-]{8,64}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: { visitor_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const visitorId = typeof body.visitor_id === "string" ? body.visitor_id.trim() : "";
  if (!VISITOR_RE.test(visitorId)) {
    return json({ error: "Invalid visitor_id" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Server misconfigured" }, 500);

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { error } = await admin
    .from("site_presence")
    .upsert(
      { visitor_id: visitorId, last_seen: new Date().toISOString() },
      { onConflict: "visitor_id" },
    );

  if (error) {
    console.error("presence-heartbeat upsert failed", error);
    return json({ error: "Heartbeat failed" }, 500);
  }

  return json({ ok: true });
});
