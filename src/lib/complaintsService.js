// src/lib/complaintsService.js
import { supabase } from "./supabaseClient";

function toTitleCase(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * Fetch complaints from DB and map to UI shape
 */
export async function getAllComplaints() {
  try {
    const { data, error } = await supabase
      .from("complaints")
      .select("complaint_id, user_id, category, title, description, status, created_at, resolved_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching complaints:", error);
      return [];
    }

    return (data || []).map((c) => ({
      complaint_id: c.complaint_id,
      customer_id: c.user_id, // map for UI
      title: c.title,
      description: c.description,
      status: c.status, // 'Pending' | 'Open' | 'Resolved'
      category: toTitleCase(c.category), // display nice
      created_at: c.created_at,
      resolved_at: c.resolved_at,
      updated_at: c.updated_at,
      admin_responses: [], // placeholder for UI compatibility
    }));
  } catch (err) {
    console.error("Unexpected error fetching complaints:", err);
    return [];
  }
}

/**
 * Fetch responses for a set of complaint IDs, grouped by complaint_id
 */
export async function getResponsesForComplaints(complaintIds) {
  if (!complaintIds || complaintIds.length === 0) return {};
  try {
    const { data, error } = await supabase
      .from("complaint_responses")
      .select("response_id, complaint_id, admin_id, admin_name, response_text, created_at")
      .in("complaint_id", complaintIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching complaint responses:", error);
      return {};
    }

    const map = {};
    (data || []).forEach((r) => {
      if (!map[r.complaint_id]) map[r.complaint_id] = [];
      map[r.complaint_id].push({
        response_id: r.response_id,
        admin_id: r.admin_id,
        admin_name: r.admin_name,
        response_text: r.response_text,
        response_date: r.created_at,
      });
    });
    return map;
  } catch (err) {
    console.error("Unexpected error fetching responses:", err);
    return {};
  }
}

/**
 * Create a new complaint response (admin only via RLS)
 */
export async function createComplaintResponse(complaintId, responseText) {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return { success: false, error: userError || new Error("Not authenticated") };
    }
    const userId = userData.user.id;

    // Fetch admin_name from profiles (fallback to user email)
    let adminName = null;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("display_name, email")
      .eq("id", userId)
      .single();

    if (!profileError && profile) {
      adminName = profile.display_name || profile.email || null;
    }

    const payload = {
      complaint_id: complaintId,
      admin_id: userId,
      admin_name: adminName,
      response_text: responseText,
    };

    const { data, error } = await supabase
      .from("complaint_responses")
      .insert(payload)
      .select("response_id, complaint_id, admin_id, admin_name, response_text, created_at")
      .single();

    if (error) {
      console.error("Failed to create complaint response:", error);
      return { success: false, error };
    }

    return {
      success: true,
      response: {
        response_id: data.response_id,
        admin_id: data.admin_id,
        admin_name: data.admin_name,
        response_text: data.response_text,
        response_date: data.created_at,
      },
    };
  } catch (err) {
    console.error("Unexpected error creating complaint response:", err);
    return { success: false, error: err };
  }
}

/**
 * Update complaint status (e.g., Pending -> Open, Open -> Resolved)
 */
export async function updateComplaintStatus(complaintId, newStatus) {
  try {
    const payload = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Only set resolved_at when moving to Resolved
    if (newStatus === "Resolved") {
      payload.resolved_at = new Date().toISOString();
    } else if (newStatus === "Open" || newStatus === "Pending") {
      payload.resolved_at = null;
    }

    const { error } = await supabase
      .from("complaints")
      .update(payload)
      .eq("complaint_id", complaintId);

    if (error) {
      console.error("Failed to update complaint status:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Unexpected error updating complaint status:", err);
    return { success: false, error: err };
  }
}


