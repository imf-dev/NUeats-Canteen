import { supabase } from "./supabaseClient";

// Cache for user roles to avoid repeated fetches
const roleCache = new Map();

const LOCAL_CACHE_PREFIX = "roleCache:";
const LOCAL_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function getLocalStorageSafe() {
  try {
    return window?.localStorage ?? null;
  } catch (_err) {
    return null;
  }
}

export function getCachedRole(userId) {
  if (!userId) return null;

  // In-memory first
  if (roleCache.has(userId)) {
    return roleCache.get(userId);
  }

  // Then localStorage
  const ls = getLocalStorageSafe();
  if (!ls) return null;
  const key = `${LOCAL_CACHE_PREFIX}${userId}`;
  const raw = ls.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const isExpired = !parsed?.ts || Date.now() - parsed.ts > LOCAL_CACHE_TTL_MS;
    if (isExpired) {
      ls.removeItem(key);
      return null;
    }
    return parsed?.role ?? null;
  } catch (_e) {
    ls.removeItem(key);
    return null;
  }
}

function setCachedRole(userId, role) {
  if (!userId || !role) return;
  roleCache.set(userId, role);
  const ls = getLocalStorageSafe();
  if (ls) {
    const key = `${LOCAL_CACHE_PREFIX}${userId}`;
    ls.setItem(
      key,
      JSON.stringify({ role, ts: Date.now() })
    );
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Profile fetch timeout")), ms)
    ),
  ]);
}

export async function fetchUserRole(userId) {
  console.log("📡 Starting profile fetch for userId:", userId);

  // 1) Check cache first (in-memory or localStorage)
  const cached = getCachedRole(userId);
  if (cached) {
    console.log("💾 Using cached role for user:", cached);
    return cached;
  }

  // 2) Check if Supabase client is properly configured
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  try {
    // 3) Network fetch with timeout to avoid hanging on reload
    const queryPromise = supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const { data, error } = await withTimeout(queryPromise, 7000);

    console.log("📦 Supabase response received:", { data, error });

    if (error) {
      console.error("🚨 Supabase error:", error);
      throw error;
    }

    const role = data?.role ?? null;
    console.log("✅ Role extracted:", role);

    if (role) {
      setCachedRole(userId, role);
      console.log("💾 Cached role for future use");
    }

    return role;
  } catch (err) {
    console.error("💥 Profile fetch failed:", err);
    throw err; // Let the calling code handle the error properly
  }
}

// Clear cache when user signs out
export function clearRoleCache() {
  roleCache.clear();

  const ls = getLocalStorageSafe();
  if (ls) {
    // Remove all roleCache:* keys
    const keysToRemove = [];
    for (let i = 0; i < ls.length; i += 1) {
      const key = ls.key(i);
      if (key && key.startsWith(LOCAL_CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => ls.removeItem(k));
  }
  console.log("🗑️ Role cache cleared");
}


