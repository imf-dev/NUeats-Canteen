import React, { useState, useEffect } from "react";
import { storeDemoData } from "../../demodata/storeDemoData";
import SS_CanteenInfo from "./SettingsStore/SS_CanteenInfo";
import SS_OperatingHours from "./SettingsStore/SS_OperatingHours";
import SS_PaymentMethod from "./SettingsStore/SS_PaymentMethod";
import CustomModal from "../common/CustomModal";
import LoadingScreen from "../common/LoadingScreen";
import {
  fetchStoreSettings,
  updateCanteenInfo,
  updateOperatingHours,
  updatePaymentMethods,
} from "../../lib/storeSettingsService";
import "./SettingsStore.css";

const SettingsStore = () => {
  const [canteenInfo, setCanteenInfo] = useState(storeDemoData.canteenInfo);
  const [operatingHours, setOperatingHours] = useState(
    storeDemoData.operatingHours
  );
  const [paymentMethods, setPaymentMethods] = useState(
    storeDemoData.paymentMethods
  );
  const [settingsId, setSettingsId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  const showModal = (type, title, message) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "",
      title: "",
      message: "",
    });
  };

  // Load store settings from database
  useEffect(() => {
    const loadStoreSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await fetchStoreSettings();
        setSettingsId(settings.id);
        setCanteenInfo(settings.canteenInfo);
        setOperatingHours(settings.operatingHours);
        setPaymentMethods(settings.paymentMethods);
      } catch (error) {
        console.error("Error loading store settings:", error);
        showModal(
          "error",
          "Error Loading Settings",
          "Failed to load store settings. Using default values."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("settings-loaded");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCanteenInfoChange = (field, value) => {
    setCanteenInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOperatingHourChange = (day, field, value) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handlePaymentMethodChange = (method, value) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: value,
    }));
  };

  const handleCanteenInfoSave = async (success, message, type) => {
    if (!success) {
      showModal(type, type === "error" ? "Error" : "Information", message);
      return;
    }

    // Save to database
    setIsSaving(true);
    try {
      await updateCanteenInfo(settingsId, canteenInfo);
      showModal("success", "Success", "Canteen information saved successfully!");
    } catch (error) {
      console.error("Error saving canteen info:", error);
      showModal(
        "error",
        "Save Failed",
        error.message || "Failed to save canteen information. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleOperatingHoursSave = async (success, message, type) => {
    if (!success) {
      showModal(type, type === "error" ? "Error" : "Information", message);
      return;
    }

    // Save to database
    setIsSaving(true);
    try {
      await updateOperatingHours(settingsId, operatingHours);
      showModal("success", "Success", "Operating hours saved successfully!");
    } catch (error) {
      console.error("Error saving operating hours:", error);
      showModal(
        "error",
        "Save Failed",
        error.message || "Failed to save operating hours. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePaymentMethodsSave = async (success, message, type) => {
    if (!success) {
      showModal(type, type === "error" ? "Error" : "Information", message);
      return;
    }

    // Save to database
    setIsSaving(true);
    try {
      await updatePaymentMethods(settingsId, paymentMethods);
      showModal("success", "Success", "Payment methods saved successfully!");
    } catch (error) {
      console.error("Error saving payment methods:", error);
      showModal(
        "error",
        "Save Failed",
        error.message || "Failed to save payment methods. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading screen while fetching data
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="settingsstore_settings-store">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <SS_CanteenInfo
        canteenInfo={canteenInfo}
        onSave={handleCanteenInfoSave}
        onCanteenInfoChange={handleCanteenInfoChange}
        isSaving={isSaving}
      />

      <SS_OperatingHours
        operatingHours={operatingHours}
        onSave={handleOperatingHoursSave}
        onOperatingHourChange={handleOperatingHourChange}
        isSaving={isSaving}
      />

      <SS_PaymentMethod
        paymentMethods={paymentMethods}
        onSave={handlePaymentMethodsSave}
        onPaymentMethodChange={handlePaymentMethodChange}
        isSaving={isSaving}
      />
    </div>
  );
};

export default SettingsStore;
