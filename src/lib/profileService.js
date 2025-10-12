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
  // 1) Check cache first (in-memory or localStorage)
  const cached = getCachedRole(userId);
  if (cached) {
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

    if (error) {
      console.error("🚨 Supabase error:", error);
      throw error;
    }

    const role = data?.role ?? null;

    if (role) {
      setCachedRole(userId, role);
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

/**
 * Fetch the current admin profile from the database
 */
export async function fetchAdminProfile() {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error fetching current user:", userError);
      throw new Error("Failed to fetch current user");
    }

    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Fetch profile data from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw new Error("Failed to fetch profile data");
    }

    // Parse display_name to extract first and last name
    const displayName = profile?.display_name || "";
    const nameParts = displayName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return {
      id: user.id,
      firstName,
      lastName,
      email: profile?.email || user.email || "",
      phone: profile?.phone || "",
      profilePicture: profile?.avatar_url || null,
      role: profile?.role || "admin",
    };
  } catch (error) {
    console.error("Error in fetchAdminProfile:", error);
    throw error;
  }
}

/**
 * Upload profile picture to Supabase Storage
 */
export async function uploadProfilePicture(file) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("No authenticated user found");
    }

    // Generate unique filename with user ID and timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw new Error("Failed to upload profile picture: " + uploadError.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log("✅ Profile picture uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadProfilePicture:", error);
    throw error;
  }
}

/**
 * Delete profile picture from Supabase Storage
 */
export async function deleteProfilePicture(avatarUrl) {
  try {
    if (!avatarUrl) return;

    // Extract filename from URL
    const urlParts = avatarUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Delete file from storage
    const { error } = await supabase.storage
      .from('avatars')
      .remove([fileName]);

    if (error) {
      console.error("Error deleting file:", error);
      // Don't throw error, just log it - we can still update the profile
      console.warn("Could not delete old avatar file, continuing with profile update");
    } else {
      console.log("✅ Old profile picture deleted successfully");
    }
  } catch (error) {
    console.error("Error in deleteProfilePicture:", error);
    // Don't throw error, just log it
  }
}

/**
 * Update admin profile in the database
 */
export async function updateAdminProfile(profileData) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("No authenticated user found");
    }

    // Combine firstName and lastName into display_name
    const displayName = `${profileData.firstName} ${profileData.lastName}`.trim();

    // Update profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        phone: profileData.phone,
        email: profileData.email,
        avatar_url: profileData.profilePicture,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error("Failed to update profile");
    }

    // If email changed, update auth email
    if (profileData.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: profileData.email,
      });

      if (emailError) {
        console.error("Error updating auth email:", emailError);
        throw new Error("Failed to update email. " + emailError.message);
      }
    }

    console.log("✅ Profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateAdminProfile:", error);
    throw error;
  }
}

/**
 * Update admin password
 */
export async function updateAdminPassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
      throw new Error("Failed to update password: " + error.message);
    }

    console.log("✅ Password updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateAdminPassword:", error);
    throw error;
  }
}

/**
 * Fetch security settings for the admin
 */
export async function fetchSecuritySettings() {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("No authenticated user found");
    }

    // Fetch security settings from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("security_settings")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching security settings:", profileError);
      // Return default settings if none exist
      return {
        twoFactorEnabled: false,
        loginNotifications: true,
        sessionTimeout: "30 minutes",
        passwordExpiry: "90 days",
      };
    }

    // Parse security settings or return defaults
    const settings = profile?.security_settings || {};
    return {
      twoFactorEnabled: settings.twoFactorEnabled || false,
      loginNotifications: settings.loginNotifications !== false, // Default to true
      sessionTimeout: settings.sessionTimeout || "30 minutes",
      passwordExpiry: settings.passwordExpiry || "90 days",
    };
  } catch (error) {
    console.error("Error in fetchSecuritySettings:", error);
    // Return default settings on error
    return {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: "30 minutes",
      passwordExpiry: "90 days",
    };
  }
}

/**
 * Update security settings for the admin
 */
export async function updateSecuritySettings(settings) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("No authenticated user found");
    }

    // Update security settings in profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        security_settings: {
          twoFactorEnabled: settings.twoFactorEnabled,
          loginNotifications: settings.loginNotifications,
          sessionTimeout: settings.sessionTimeout,
          passwordExpiry: settings.passwordExpiry,
        },
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating security settings:", updateError);
      throw new Error("Failed to update security settings");
    }

    console.log("✅ Security settings updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateSecuritySettings:", error);
    throw error;
  }
}


