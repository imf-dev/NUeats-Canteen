// scripts/syncProfilesFromAuth.mjs
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("❌ SUPABASE_URL (or VITE_SUPABASE_URL) is not set in the environment.");
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set in the environment.");
  console.error("   Create a service role key in Supabase and set it before running this script.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function extractPhone(user) {
  const meta = user?.user_metadata || user?.raw_user_meta_data || {};
  return (
    meta.phone ||
    meta.phone_number ||
    meta.contact_number ||
    null
  );
}

function extractDisplayName(user) {
  const meta = user?.user_metadata || user?.raw_user_meta_data || {};
  return (
    meta.display_name ||
    meta.full_name ||
    meta.name ||
    null
  );
}

function extractAvatarUrl(user) {
  const meta = user?.user_metadata || user?.raw_user_meta_data || {};
  return (
    meta.avatar_url ||
    meta.picture ||
    null
  );
}

async function syncPage(page, perPage) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
  if (error) throw error;

  const users = data?.users ?? [];
  if (users.length === 0) return { count: 0 };

  const rows = users.map((u) => ({
    id: u.id,
    email: u.email ?? null,
    phone: extractPhone(u),
    display_name: extractDisplayName(u),
    avatar_url: extractAvatarUrl(u),
  }));

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert(rows, { onConflict: "id" });

  if (upsertError) throw upsertError;
  return { count: rows.length };
}

async function main() {
  console.log("🔄 Syncing profiles (email, phone) from Auth -> public.profiles ...");
  const perPage = 1000;
  let page = 1;
  let total = 0;

  // Page until no users are returned
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { count } = await syncPage(page, perPage);
    if (count === 0) break;
    total += count;
    console.log(`  ✅ Synced ${count} users on page ${page}`);
    page += 1;
  }

  console.log(`🎉 Done. Upserted ${total} profile rows.`);
}

main().catch((err) => {
  console.error("💥 Sync failed:", err);
  process.exit(1);
});


