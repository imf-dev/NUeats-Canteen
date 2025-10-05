// scripts/seedMenuItems.mjs
import "dotenv/config";
// Seed the menu_items table in Supabase using demo data from src/demodata/menuDemoData.js

import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Resolve project root to import the demo data reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Import demo data (ESM) - convert Windows path to file:// URL for Node ESM loader
const demoDataPath = path.join(projectRoot, "src/demodata/menuDemoData.js");
const demoDataUrl = pathToFileURL(demoDataPath).href;
const { menuItems } = await import(demoDataUrl);

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

function getPrepTime(item) {
  if (typeof item.prepTime === "number" && Number.isFinite(item.prepTime)) {
    return Math.max(0, Math.floor(item.prepTime));
  }
  const category = (item.category || "").toLowerCase();
  if (category.includes("meal")) return 15;
  if (category.includes("snack")) return 7;
  if (category.includes("beverage")) return 3;
  if (category.includes("dessert")) return 12;
  return 10;
}

function mapToDb(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    image: item.image,
    is_available: item.isAvailable,
    prep_time: getPrepTime(item),
  };
}

async function seed() {
  console.log("🌱 Seeding menu_items...");
  const rows = menuItems.map(mapToDb);

  const { data, error } = await supabase
    .from("menu_items")
    .upsert(rows, { onConflict: "id" })
    .select("id, name");

  if (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data?.length ?? 0} items into menu_items`);
}

seed().catch((err) => {
  console.error("💥 Unexpected error while seeding:", err);
  process.exit(1);
});


