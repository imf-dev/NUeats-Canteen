// Check current RLS policies for order_cancellations
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function check() {
  console.log("🔍 Checking RLS policies for order_cancellations...\n");

  // Check if RLS is enabled
  const { data: rlsEnabled, error: rlsError } = await supabase
    .rpc('check_rls_enabled', { table_name: 'order_cancellations' })
    .catch(() => {
      // Fallback query
      return supabase
        .from('pg_tables')
        .select('*')
        .eq('tablename', 'order_cancellations')
        .eq('schemaname', 'public');
    });

  console.log("📋 RLS Status:", { rlsEnabled, rlsError });

  // List all policies
  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'order_cancellations');

  if (policiesError) {
    console.error("❌ Error fetching policies:", policiesError);
  } else {
    console.log("📋 Current policies:");
    if (policies && policies.length > 0) {
      policies.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} (${policy.permissive ? 'permissive' : 'restrictive'})`);
        console.log(`    Roles: ${policy.roles || 'N/A'}`);
        console.log(`    Using: ${policy.qual || 'N/A'}`);
        console.log(`    With check: ${policy.with_check || 'N/A'}`);
        console.log("");
      });
    } else {
      console.log("  ❌ No policies found!");
    }
  }

  // Test direct query with service role
  console.log("🧪 Testing direct query with service role...");
  const { data: testData, error: testError } = await supabase
    .from('order_cancellations')
    .select('*')
    .limit(5);

  console.log("📊 Test query result:", {
    count: testData?.length || 0,
    error: testError,
    sample: testData?.[0] || null
  });
}

check().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
