// Script to update missing profile data and check statistics
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

async function updateProfileData() {
  console.log("🔍 Checking profile data statistics...\n");

  try {
    // First, get current statistics
    console.log("📊 Current Profile Data Statistics:");
    const { data: stats, error: statsError } = await supabase
      .rpc('get_profile_data_stats');

    if (statsError) {
      console.error("❌ Error getting statistics:", statsError);
      return;
    }

    if (stats && stats.length > 0) {
      const stat = stats[0];
      console.log(`  Total Profiles: ${stat.total_profiles}`);
      console.log(`  Profiles with Email: ${stat.profiles_with_email}`);
      console.log(`  Profiles with Phone: ${stat.profiles_with_phone}`);
      console.log(`  Missing Email: ${stat.profiles_missing_email}`);
      console.log(`  Missing Phone: ${stat.profiles_missing_phone}`);
      console.log(`  Missing Both: ${stat.profiles_missing_both}\n`);
    }

    // Update missing data
    console.log("🔄 Updating missing profile data...");
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_missing_profile_data');

    if (updateError) {
      console.error("❌ Error updating profiles:", updateError);
      return;
    }

    if (updateResult && updateResult.length > 0) {
      const result = updateResult[0];
      console.log("✅ Update completed:");
      console.log(`  Records Updated: ${result.updated_count}`);
      console.log(`  Missing Emails Before: ${result.missing_email_count}`);
      console.log(`  Missing Phones Before: ${result.missing_phone_count}`);
      console.log(`  Total Profiles: ${result.total_profiles}\n`);
    }

    // Get updated statistics
    console.log("📊 Updated Profile Data Statistics:");
    const { data: updatedStats, error: updatedStatsError } = await supabase
      .rpc('get_profile_data_stats');

    if (updatedStatsError) {
      console.error("❌ Error getting updated statistics:", updatedStatsError);
      return;
    }

    if (updatedStats && updatedStats.length > 0) {
      const stat = updatedStats[0];
      console.log(`  Total Profiles: ${stat.total_profiles}`);
      console.log(`  Profiles with Email: ${stat.profiles_with_email}`);
      console.log(`  Profiles with Phone: ${stat.profiles_with_phone}`);
      console.log(`  Missing Email: ${stat.profiles_missing_email}`);
      console.log(`  Missing Phone: ${stat.profiles_missing_phone}`);
      console.log(`  Missing Both: ${stat.profiles_missing_both}\n`);
    }

    // Show some sample profiles for verification
    console.log("🔍 Sample profiles (first 5):");
    const { data: sampleProfiles, error: sampleError } = await supabase
      .from('profiles')
      .select('id, display_name, email, phone, created_at')
      .limit(5);

    if (sampleError) {
      console.error("❌ Error getting sample profiles:", sampleError);
    } else if (sampleProfiles) {
      sampleProfiles.forEach((profile, index) => {
        console.log(`  ${index + 1}. ${profile.display_name || 'No name'}`);
        console.log(`     Email: ${profile.email || 'Missing'}`);
        console.log(`     Phone: ${profile.phone || 'Missing'}`);
        console.log(`     Created: ${profile.created_at}`);
        console.log("");
      });
    }

  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

updateProfileData().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
