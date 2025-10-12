// Script to test if the profile trigger is working correctly
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

async function testProfileTrigger() {
  console.log("🧪 Testing Profile Trigger...\n");

  try {
    // Check if trigger function exists
    console.log("1. Checking if trigger function exists...");
    const { data: functions, error: funcError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'handle_new_user');

    if (funcError) {
      console.log("❌ Error checking functions:", funcError);
    } else if (functions && functions.length > 0) {
      console.log("✅ handle_new_user function exists");
    } else {
      console.log("❌ handle_new_user function not found");
    }

    // Check if trigger exists
    console.log("\n2. Checking if trigger exists...");
    const { data: triggers, error: triggerError } = await supabase
      .from('pg_trigger')
      .select('tgname')
      .eq('tgname', 'on_auth_user_created');

    if (triggerError) {
      console.log("❌ Error checking triggers:", triggerError);
    } else if (triggers && triggers.length > 0) {
      console.log("✅ on_auth_user_created trigger exists");
    } else {
      console.log("❌ on_auth_user_created trigger not found");
    }

    // Check recent profiles vs recent auth users
    console.log("\n3. Checking recent profile creation...");
    
    // Get profiles created in the last 24 hours
    const { data: recentProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, email, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (profilesError) {
      console.log("❌ Error getting recent profiles:", profilesError);
    } else {
      console.log(`📊 Found ${recentProfiles?.length || 0} profiles created in last 24 hours`);
      if (recentProfiles && recentProfiles.length > 0) {
        console.log("Recent profiles:");
        recentProfiles.forEach((profile, index) => {
          console.log(`  ${index + 1}. ${profile.display_name || 'No name'} (${profile.email || 'No email'}) - ${profile.created_at}`);
        });
      }
    }

    // Check for orphaned profiles (profiles without corresponding auth users)
    console.log("\n4. Checking for data consistency...");
    const { data: orphanedProfiles, error: orphanedError } = await supabase
      .rpc('check_orphaned_profiles');

    if (orphanedError) {
      console.log("ℹ️  Orphaned profiles check not available (function may not exist)");
    } else {
      console.log(`📊 Orphaned profiles: ${orphanedProfiles || 0}`);
    }

    // Test the update function
    console.log("\n5. Testing profile data update function...");
    const { data: updateTest, error: updateTestError } = await supabase
      .rpc('get_profile_data_stats');

    if (updateTestError) {
      console.log("❌ Error testing update function:", updateTestError);
    } else if (updateTest && updateTest.length > 0) {
      const stats = updateTest[0];
      console.log("✅ Update function working:");
      console.log(`  Total Profiles: ${stats.total_profiles}`);
      console.log(`  Missing Email: ${stats.profiles_missing_email}`);
      console.log(`  Missing Phone: ${stats.profiles_missing_phone}`);
    }

  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

testProfileTrigger().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
