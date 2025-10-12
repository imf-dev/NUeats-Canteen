// Simple script to update missing profile data
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

async function updateProfiles() {
  console.log("🔍 Updating missing profile data...\n");

  try {
    // First, let's manually update the profiles using direct SQL
    console.log("📊 Current state:");
    
    // Get current stats
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, phone');

    if (profilesError) {
      console.error("❌ Error getting profiles:", profilesError);
      return;
    }

    const totalProfiles = profiles.length;
    const profilesWithEmail = profiles.filter(p => p.email && p.email !== '').length;
    const profilesWithPhone = profiles.filter(p => p.phone && p.phone !== '').length;
    const missingEmail = totalProfiles - profilesWithEmail;
    const missingPhone = totalProfiles - profilesWithPhone;

    console.log(`  Total Profiles: ${totalProfiles}`);
    console.log(`  Profiles with Email: ${profilesWithEmail}`);
    console.log(`  Profiles with Phone: ${profilesWithPhone}`);
    console.log(`  Missing Email: ${missingEmail}`);
    console.log(`  Missing Phone: ${missingPhone}\n`);

    // Get auth users data
    console.log("🔍 Getting auth users data...");
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data');

    if (authError) {
      console.error("❌ Error getting auth users:", authError);
      return;
    }

    console.log(`  Found ${authUsers.length} auth users\n`);

    // Update missing emails
    console.log("📧 Updating missing emails...");
    let emailUpdates = 0;
    for (const profile of profiles) {
      if (!profile.email || profile.email === '') {
        const authUser = authUsers.find(au => au.id === profile.id);
        if (authUser && authUser.email) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ email: authUser.email })
            .eq('id', profile.id);
          
          if (!updateError) {
            emailUpdates++;
            console.log(`  ✅ Updated email for profile ${profile.id}: ${authUser.email}`);
          } else {
            console.log(`  ❌ Failed to update email for profile ${profile.id}:`, updateError);
          }
        }
      }
    }

    // Update missing phones
    console.log("\n📱 Updating missing phones...");
    let phoneUpdates = 0;
    for (const profile of profiles) {
      if (!profile.phone || profile.phone === '') {
        const authUser = authUsers.find(au => au.id === profile.id);
        if (authUser && authUser.raw_user_meta_data?.phone) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ phone: authUser.raw_user_meta_data.phone })
            .eq('id', profile.id);
          
          if (!updateError) {
            phoneUpdates++;
            console.log(`  ✅ Updated phone for profile ${profile.id}: ${authUser.raw_user_meta_data.phone}`);
          } else {
            console.log(`  ❌ Failed to update phone for profile ${profile.id}:`, updateError);
          }
        }
      }
    }

    console.log(`\n✅ Update completed:`);
    console.log(`  Email updates: ${emailUpdates}`);
    console.log(`  Phone updates: ${phoneUpdates}`);
    console.log(`  Total updates: ${emailUpdates + phoneUpdates}`);

    // Show final stats
    console.log("\n📊 Final state:");
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('id, email, phone');

    if (!finalError && finalProfiles) {
      const finalTotal = finalProfiles.length;
      const finalWithEmail = finalProfiles.filter(p => p.email && p.email !== '').length;
      const finalWithPhone = finalProfiles.filter(p => p.phone && p.phone !== '').length;
      const finalMissingEmail = finalTotal - finalWithEmail;
      const finalMissingPhone = finalTotal - finalWithPhone;

      console.log(`  Total Profiles: ${finalTotal}`);
      console.log(`  Profiles with Email: ${finalWithEmail}`);
      console.log(`  Profiles with Phone: ${finalWithPhone}`);
      console.log(`  Missing Email: ${finalMissingEmail}`);
      console.log(`  Missing Phone: ${finalMissingPhone}`);
    }

  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

updateProfiles().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
