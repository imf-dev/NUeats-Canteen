import { supabase } from "./supabaseClient";

/**
 * Fetch store settings from the database
 * Returns the first (and should be only) store settings record
 */
export async function fetchStoreSettings() {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching store settings:", error);
      throw new Error("Failed to fetch store settings");
    }

    if (!data) {
      throw new Error("No store settings found");
    }

    // Transform database format to component format
    return {
      id: data.id,
      canteenInfo: {
        name: data.name || "",
        description: data.description || "",
        phoneNumber: data.phone_number || "",
        emailAddress: data.email_address || "",
        streetAddress: data.street_address || "",
        city: data.city || "",
        province: data.province || "",
        zipCode: data.zip_code || "",
      },
      operatingHours: data.operating_hours || {
        monday: { open: true, openTime: "08:00", closeTime: "17:00" },
        tuesday: { open: true, openTime: "08:00", closeTime: "17:00" },
        wednesday: { open: true, openTime: "08:00", closeTime: "17:00" },
        thursday: { open: true, openTime: "08:00", closeTime: "17:00" },
        friday: { open: true, openTime: "08:00", closeTime: "17:00" },
        saturday: { open: true, openTime: "08:00", closeTime: "17:00" },
        sunday: { open: false, openTime: "08:00", closeTime: "17:00" },
      },
      paymentMethods: data.payment_methods || {
        cashPayment: true,
        payMongo: false,
        creditDebitCard: false,
      },
    };
  } catch (error) {
    console.error("Error in fetchStoreSettings:", error);
    throw error;
  }
}

/**
 * Update canteen information in the database
 */
export async function updateCanteenInfo(settingsId, canteenInfo) {
  try {
    const { error } = await supabase
      .from("store_settings")
      .update({
        name: canteenInfo.name,
        description: canteenInfo.description,
        phone_number: canteenInfo.phoneNumber,
        email_address: canteenInfo.emailAddress,
        street_address: canteenInfo.streetAddress,
        city: canteenInfo.city,
        province: canteenInfo.province,
        zip_code: canteenInfo.zipCode,
      })
      .eq("id", settingsId);

    if (error) {
      console.error("Error updating canteen info:", error);
      throw new Error("Failed to update canteen information");
    }

    console.log("✅ Canteen info updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateCanteenInfo:", error);
    throw error;
  }
}

/**
 * Update operating hours in the database
 */
export async function updateOperatingHours(settingsId, operatingHours) {
  try {
    const { error } = await supabase
      .from("store_settings")
      .update({
        operating_hours: operatingHours,
      })
      .eq("id", settingsId);

    if (error) {
      console.error("Error updating operating hours:", error);
      throw new Error("Failed to update operating hours");
    }

    console.log("✅ Operating hours updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateOperatingHours:", error);
    throw error;
  }
}

/**
 * Update payment methods in the database
 */
export async function updatePaymentMethods(settingsId, paymentMethods) {
  try {
    const { error } = await supabase
      .from("store_settings")
      .update({
        payment_methods: paymentMethods,
      })
      .eq("id", settingsId);

    if (error) {
      console.error("Error updating payment methods:", error);
      throw new Error("Failed to update payment methods");
    }

    console.log("✅ Payment methods updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updatePaymentMethods:", error);
    throw error;
  }
}

/**
 * Update all store settings at once
 */
export async function updateStoreSettings(settingsId, settings) {
  try {
    const { error } = await supabase
      .from("store_settings")
      .update({
        name: settings.canteenInfo.name,
        description: settings.canteenInfo.description,
        phone_number: settings.canteenInfo.phoneNumber,
        email_address: settings.canteenInfo.emailAddress,
        street_address: settings.canteenInfo.streetAddress,
        city: settings.canteenInfo.city,
        province: settings.canteenInfo.province,
        zip_code: settings.canteenInfo.zipCode,
        operating_hours: settings.operatingHours,
        payment_methods: settings.paymentMethods,
      })
      .eq("id", settingsId);

    if (error) {
      console.error("Error updating store settings:", error);
      throw new Error("Failed to update store settings");
    }

    console.log("✅ Store settings updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateStoreSettings:", error);
    throw error;
  }
}

