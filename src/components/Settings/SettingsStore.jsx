import React, { useState, useEffect } from "react";
import { storeDemoData } from "../../demodata/storeDemoData";
import SS_CanteenInfo from "./SettingsStore/SS_CanteenInfo";
import SS_OperatingHours from "./SettingsStore/SS_OperatingHours";
import SS_PaymentMethod from "./SettingsStore/SS_PaymentMethod";
import CustomModal from "../common/CustomModal";
import "./SettingsStore.css";

const SettingsStore = () => {
  const [canteenInfo, setCanteenInfo] = useState(storeDemoData.canteenInfo);
  const [operatingHours, setOperatingHours] = useState(
    storeDemoData.operatingHours
  );
  const [paymentMethods, setPaymentMethods] = useState(
    storeDemoData.paymentMethods
  );
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("settings-loaded");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

  const handleCanteenInfoSave = (success, message, type) => {
    if (success) {
      showModal("success", "Success", message);
    } else {
      showModal(type, type === "error" ? "Error" : "Information", message);
    }
  };

  const handleOperatingHoursSave = (success, message, type) => {
    if (success) {
      showModal("success", "Success", message);
    } else {
      showModal(type, type === "error" ? "Error" : "Information", message);
    }
  };

  const handlePaymentMethodsSave = (success, message, type) => {
    if (success) {
      showModal("success", "Success", message);
    } else {
      showModal(type, type === "error" ? "Error" : "Information", message);
    }
  };

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
      />

      <SS_OperatingHours
        operatingHours={operatingHours}
        onSave={handleOperatingHoursSave}
        onOperatingHourChange={handleOperatingHourChange}
      />

      <SS_PaymentMethod
        paymentMethods={paymentMethods}
        onSave={handlePaymentMethodsSave}
        onPaymentMethodChange={handlePaymentMethodChange}
      />
    </div>
  );
};

export default SettingsStore;
