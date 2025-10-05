// scripts/seedComplaints.mjs
import "dotenv/config";
// Seed the complaints table in Supabase

import { createClient } from "@supabase/supabase-js";

// Read env vars
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

// User IDs
const USER_IDS = [
  "667c3e89-f82e-4509-8dfa-811bb214bf26",
  "ae7c8e68-af55-49da-af66-c7a18f069694",
];

// Complaint categories
const CATEGORIES = {
  FOOD_QUALITY: "food quality",
  SERVICE: "service",
  APP_ISSUE: "app issue",
  BILLING: "billing",
  PICKUP_DELAY: "pickup delay",
  OTHER: "other",
};

// Complaint statuses
const STATUSES = ["Pending", "Open", "Resolved"];

// Complaint templates by category
const COMPLAINT_TEMPLATES = {
  [CATEGORIES.FOOD_QUALITY]: [
    {
      title: "Cold food received",
      description: "The food I ordered was cold when I picked it up. It seems like it was prepared too early and left sitting. Very disappointed with the quality.",
    },
    {
      title: "Incorrect order items",
      description: "I ordered chicken adobo but received pork adobo instead. Please check orders more carefully before serving.",
    },
    {
      title: "Food tastes different than usual",
      description: "The sisig I ordered today doesn't taste the same as before. It was too salty and the texture was off.",
    },
    {
      title: "Portion size too small",
      description: "The portion size of my meal was significantly smaller than what I usually get. Not worth the price.",
    },
    {
      title: "Food quality below standards",
      description: "The vegetables in my order were not fresh. Some looked wilted and discolored. Please improve quality control.",
    },
  ],
  [CATEGORIES.SERVICE]: [
    {
      title: "Rude staff behavior",
      description: "The staff at the counter was very rude when I asked about my order. Customer service needs improvement.",
    },
    {
      title: "Long wait time at pickup",
      description: "I waited 20 minutes past my scheduled pickup time. There was no apology or explanation from the staff.",
    },
    {
      title: "Staff didn't acknowledge me",
      description: "I stood at the counter for 5 minutes and no one even acknowledged my presence. Very poor service.",
    },
    {
      title: "Unhelpful staff",
      description: "When I asked about menu items, the staff seemed disinterested and couldn't answer my questions properly.",
    },
    {
      title: "Incorrect change given",
      description: "I paid cash and was given incorrect change. When I pointed it out, the staff was defensive instead of apologetic.",
    },
  ],
  [CATEGORIES.APP_ISSUE]: [
    {
      title: "App crashes during checkout",
      description: "The app keeps crashing when I try to complete my order. I've tried multiple times but can't place my order.",
    },
    {
      title: "Unable to apply promo code",
      description: "I have a valid promo code but the app won't accept it. Getting an error message every time I try.",
    },
    {
      title: "Order history not loading",
      description: "My order history won't load in the app. I need to track my previous orders but getting a blank screen.",
    },
    {
      title: "Payment not processing",
      description: "When I try to pay, the app gets stuck on the processing screen. I've waited 10 minutes with no response.",
    },
    {
      title: "Can't update profile information",
      description: "The app won't let me update my contact number. Every time I save, it reverts to the old number.",
    },
  ],
  [CATEGORIES.BILLING]: [
    {
      title: "Charged twice for one order",
      description: "I was charged twice for order #1234. My bank shows two separate charges for the same amount.",
    },
    {
      title: "Incorrect total amount",
      description: "The total amount charged doesn't match the prices shown in the app. I was overcharged by 50 pesos.",
    },
    {
      title: "Payment failed but money deducted",
      description: "The app said my payment failed, but the money was already deducted from my account. Need assistance.",
    },
    {
      title: "No receipt received",
      description: "I completed my order and payment but never received a receipt via email or in the app.",
    },
    {
      title: "Refund not processed",
      description: "My order was cancelled 3 days ago but I still haven't received my refund. Please process it immediately.",
    },
  ],
  [CATEGORIES.PICKUP_DELAY]: [
    {
      title: "Order not ready at scheduled time",
      description: "My order was scheduled for 12:00 PM but wasn't ready until 12:30 PM. This made me late for class.",
    },
    {
      title: "Excessive preparation time",
      description: "Simple orders shouldn't take 45 minutes to prepare. Please improve kitchen efficiency.",
    },
    {
      title: "No notification when order ready",
      description: "I didn't receive any notification that my order was ready. Had to keep checking manually.",
    },
    {
      title: "Pickup time keeps changing",
      description: "The estimated pickup time changed three times. Very frustrating when trying to plan my schedule.",
    },
    {
      title: "Order delayed without explanation",
      description: "My order was delayed by 30 minutes with no explanation or apology. Poor communication.",
    },
  ],
  [CATEGORIES.OTHER]: [
    {
      title: "Canteen cleanliness issue",
      description: "The tables and floors in the canteen area are dirty. Please maintain better cleanliness standards.",
    },
    {
      title: "Missing utensils",
      description: "My order didn't come with utensils. I had to eat with my hands which was very inconvenient.",
    },
    {
      title: "Packaging issue",
      description: "The food packaging was torn and some of the sauce leaked out. Please use better quality containers.",
    },
    {
      title: "Menu items not available",
      description: "Several menu items shown as available in the app were actually out of stock. Please update availability.",
    },
    {
      title: "Loyalty points not credited",
      description: "I've made several purchases but my loyalty points haven't been credited to my account.",
    },
  ],
};

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random element from an array
 */
function randomPick(array) {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Generate a random time between 8am and 8pm on a given date
 */
function randomTimeInExtendedHours(date) {
  const hour = randomInt(8, 19); // 8am to 7pm
  const minute = randomInt(0, 59);
  const second = randomInt(0, 59);
  
  const newDate = new Date(date);
  newDate.setHours(hour, minute, second, 0);
  return newDate;
}

/**
 * Add hours to a date
 */
function addHours(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}

/**
 * Generate complaints
 */
function generateComplaints() {
  const complaints = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Generate complaints over the past 30 days
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);

    // Number of complaints per day (0-3, with some days having no complaints)
    const numComplaints = Math.random() < 0.3 ? 0 : randomInt(1, 3);

    for (let i = 0; i < numComplaints; i++) {
      const userId = randomPick(USER_IDS);
      const category = randomPick(Object.values(CATEGORIES));
      const templates = COMPLAINT_TEMPLATES[category];
      const template = randomPick(templates);
      const createdAt = randomTimeInExtendedHours(date);

      // Determine status based on how old the complaint is
      let status;
      let resolvedAt = null;
      
      if (dayOffset > 15) {
        // Older complaints (15+ days) are mostly resolved
        const rand = Math.random();
        if (rand < 0.85) {
          status = "Resolved";
          // Resolved 1-5 days after creation
          resolvedAt = addHours(createdAt, randomInt(24, 120));
        } else if (rand < 0.95) {
          status = "Open";
        } else {
          status = "Pending";
        }
      } else if (dayOffset > 7) {
        // Medium age complaints (7-15 days) are mixed
        const rand = Math.random();
        if (rand < 0.6) {
          status = "Resolved";
          resolvedAt = addHours(createdAt, randomInt(24, 96));
        } else if (rand < 0.85) {
          status = "Open";
        } else {
          status = "Pending";
        }
      } else {
        // Recent complaints (0-7 days) are mostly pending or open
        const rand = Math.random();
        if (rand < 0.3) {
          status = "Resolved";
          resolvedAt = addHours(createdAt, randomInt(12, 72));
        } else if (rand < 0.7) {
          status = "Open";
        } else {
          status = "Pending";
        }
      }

      const updatedAt = resolvedAt || createdAt;

      complaints.push({
        user_id: userId,
        category: category,
        title: template.title,
        description: template.description,
        status: status,
        created_at: createdAt.toISOString(),
        resolved_at: resolvedAt ? resolvedAt.toISOString() : null,
        updated_at: updatedAt.toISOString(),
      });
    }
  }

  return complaints;
}

/**
 * Main seeding function
 */
async function seed() {
  console.log("🌱 Seeding complaints...");

  // Clear existing complaints
  console.log("\n🧹 Clearing existing complaints...");
  const { error: deleteError } = await supabase
    .from("complaints")
    .delete()
    .neq("complaint_id", 0); // Delete all complaints
  
  if (deleteError) {
    console.error("⚠️  Warning: Could not clear complaints:", deleteError.message);
  } else {
    console.log("✅ Cleared complaints");
  }

  const complaints = generateComplaints();

  console.log(`\n📊 Generated ${complaints.length} complaints`);
  
  // Count by status
  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const openCount = complaints.filter(c => c.status === "Open").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;
  
  console.log(`   ${pendingCount} Pending, ${openCount} Open, ${resolvedCount} Resolved`);

  // Insert complaints
  console.log("\n💾 Inserting complaints...");
  const { data: complaintData, error: complaintError } = await supabase
    .from("complaints")
    .insert(complaints)
    .select("complaint_id");

  if (complaintError) {
    console.error("❌ Failed to insert complaints:", complaintError);
    process.exit(1);
  }
  console.log(`✅ Inserted ${complaintData?.length ?? 0} complaints`);

  console.log("\n🎉 Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("💥 Unexpected error while seeding:", err);
  process.exit(1);
});
