// One-shot exporter: returns all rows from public tables as JSON.
// Bypasses RLS by using the service role key.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TABLES = [
  "organizations",
  "user_profiles",
  "user_roles",
  "role_audit_log",
  "health_examinations",
  "occupational_health_records",
  "ergonomic_assessments",
  "risk_assessments",
  "safety_trainings",
  "incidents",
  "work_permits",
  "daily_reports",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const out: Record<string, unknown[]> = {};
  for (const t of TABLES) {
    const { data, error } = await supabase.from(t).select("*").limit(10000);
    out[t] = error ? [] : (data ?? []);
  }

  // Also pull auth users (email + id + created_at) so we can seed local_users.
  try {
    const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    out["auth_users"] = (data?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email,
      name: (u.user_metadata as any)?.name ?? null,
      created_at: u.created_at,
    }));
  } catch {
    out["auth_users"] = [];
  }

  return new Response(JSON.stringify(out), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
