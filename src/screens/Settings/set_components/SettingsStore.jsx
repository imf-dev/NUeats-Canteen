import React, { useState, useEffect } from "react";
import {
  FiSave,
  FiClock,
  FiCreditCard,
  FiInfo,
  FiCheckCircle,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { storeDemoData } from "../../../demodata/storeDemoData";
import "./SettingsStore.css";

const SettingsStore = () => {
  const [canteenInfo, setCanteenInfo] = useState(storeDemoData.canteenInfo);
  const [operatingHours, setOperatingHours] = useState(
    storeDemoData.operatingHours
  );
  const [paymentMethods, setPaymentMethods] = useState(
    storeDemoData.paymentMethods
  );
  const [originalCanteenInfo, setOriginalCanteenInfo] = useState(
    storeDemoData.canteenInfo
  );
  const [originalOperatingHours, setOriginalOperatingHours] = useState(
    storeDemoData.operatingHours
  );
  const [originalPaymentMethods, setOriginalPaymentMethods] = useState(
    storeDemoData.paymentMethods
  );
  const [isEditingCanteen, setIsEditingCanteen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("settings-loaded");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const hasCanteenChanges = () => {
    return JSON.stringify(canteenInfo) !== JSON.stringify(originalCanteenInfo);
  };

  const hasOperatingHoursChanges = () => {
    return (
      JSON.stringify(operatingHours) !== JSON.stringify(originalOperatingHours)
    );
  };

  const hasPaymentMethodsChanges = () => {
    return (
      JSON.stringify(paymentMethods) !== JSON.stringify(originalPaymentMethods)
    );
  };

  const validateCanteenInfo = () => {
    const requiredFields = [
      "name",
      "description",
      "phoneNumber",
      "emailAddress",
      "streetAddress",
      "city",
      "province",
      "zipCode",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !canteenInfo[field]?.trim()
    );

    if (emptyFields.length > 0) {
      showNotification("Please fill in all required fields", "error");
      return false;
    }

    if (!hasCanteenChanges()) {
      showNotification("No changes detected", "info");
      return false;
    }

    return true;
  };

  const validateOperatingHours = () => {
    if (!hasOperatingHoursChanges()) {
      showNotification("No changes detected", "info");
      return false;
    }
    return true;
  };

  const validatePaymentMethods = () => {
    if (!hasPaymentMethodsChanges()) {
      showNotification("No changes detected", "info");
      return false;
    }
    return true;
  };

  const handleCanteenInfoChange = (field, value) => {
    setCanteenInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveCanteenInfo = () => {
    if (validateCanteenInfo()) {
      setOriginalCanteenInfo({ ...canteenInfo });
      setIsEditingCanteen(false);
      showNotification("Canteen information saved successfully!", "success");
    }
  };

  const handleSaveOperatingHours = () => {
    if (validateOperatingHours()) {
      setOriginalOperatingHours({ ...operatingHours });
      showNotification("Operating hours saved successfully!", "success");
    }
  };

  const handleSavePaymentMethods = () => {
    if (validatePaymentMethods()) {
      setOriginalPaymentMethods({ ...paymentMethods });
      showNotification("Payment methods saved successfully!", "success");
    }
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

  const toggleEditMode = () => {
    if (isEditingCanteen) {
      // Check if there are unsaved changes before exiting edit mode
      if (hasCanteenChanges()) {
        // In a real implementation, you might want to show a confirmation modal
        // For now, just reset the data
        setCanteenInfo(originalCanteenInfo);
      }
    } else {
      setOriginalCanteenInfo(canteenInfo);
    }
    setIsEditingCanteen(!isEditingCanteen);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      const time12 = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      const time24 = `${hour.toString().padStart(2, "0")}:00`;
      times.push({ value: time24, label: time12 });
    }
    return times;
  };

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="settingsstore_settings-store">
      {notification.show && (
        <div
          className={`settingsstore_notification settingsstore_${notification.type}`}
        >
          {notification.type === "success" && <FiCheckCircle />}
          {notification.type === "error" && <FiX />}
          {notification.type === "info" && <FiAlertCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Canteen Information Card */}
      <div className="settingsstore_card settingsstore_canteen-info-card">
        <div className="settingsstore_card-header">
          <div className="settingsstore_card-title">
            <FiInfo className="settingsstore_card-icon" />
            <div>
              <h3>Canteen Information</h3>
              <p>Manage canteen's basic information and contact details</p>
            </div>
          </div>
          <button
            className={`settingsstore_toggle-edit-btn ${
              isEditingCanteen ? "settingsstore_active" : ""
            }`}
            onClick={toggleEditMode}
          >
            {isEditingCanteen ? <FaToggleOn /> : <FaToggleOff />}
            <span>{isEditingCanteen ? "Lock" : "Edit"}</span>
          </button>
        </div>

        <div className="settingsstore_form-row">
          <div className="settingsstore_form-group settingsstore_full-width">
            <label>App/Canteen Name</label>
            <input
              type="text"
              value={canteenInfo.name}
              onChange={(e) => handleCanteenInfoChange("name", e.target.value)}
              disabled={!isEditingCanteen}
              className={!isEditingCanteen ? "settingsstore_disabled" : ""}
            />
          </div>
        </div>

        <div className="settingsstore_form-row">
          <div className="settingsstore_form-group settingsstore_full-width">
            <label>Description</label>
            <textarea
              value={canteenInfo.description}
              onChange={(e) =>
                handleCanteenInfoChange("description", e.target.value)
              }
              disabled={!isEditingCanteen}
              className={!isEditingCanteen ? "settingsstore_disabled" : ""}
              rows={3}
            />
          </div>
        </div>

        <div className="settingsstore_form-row">
          <div className="settingsstore_form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={canteenInfo.phoneNumber}
              onChange={(e) =>
                handleCanteenInfoChange("phoneNumber", e.target.value)
              }
              disabled={!isEditingCanteen}
              className={!isEditingCanteen ? "settingsstore_disabled" : ""}
            />
          </div>
          <div className="settingsstore_form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={canteenInfo.emailAddress}
              onChange={(e) =>
                handleCanteenInfoChange("emailAddress", e.target.value)
              }
              disabled={!isEditingCanteen}
              className={!isEditingCanteen ? "settingsstore_disabled" : ""}
            />
          </div>
        </div>

        <div className="settingsstore_address-section">
          <h4>Address</h4>
          <div className="settingsstore_form-row">
            <div className="settingsstore_form-group settingsstore_full-width">
              <label>Street Address</label>
              <input
                type="text"
                value={canteenInfo.streetAddress}
                onChange={(e) =>
                  handleCanteenInfoChange("streetAddress", e.target.value)
                }
                disabled={!isEditingCanteen}
                className={!isEditingCanteen ? "settingsstore_disabled" : ""}
              />
            </div>
          </div>
          <div className="settingsstore_form-row">
            <div className="settingsstore_form-group">
              <label>City</label>
              <input
                type="text"
                value={canteenInfo.city}
                onChange={(e) =>
                  handleCanteenInfoChange("city", e.target.value)
                }
                disabled={!isEditingCanteen}
                className={!isEditingCanteen ? "settingsstore_disabled" : ""}
              />
            </div>
            <div className="settingsstore_form-group">
              <label>Province</label>
              <input
                type="text"
                value={canteenInfo.province}
                onChange={(e) =>
                  handleCanteenInfoChange("province", e.target.value)
                }
                disabled={!isEditingCanteen}
                className={!isEditingCanteen ? "settingsstore_disabled" : ""}
              />
            </div>
            <div className="settingsstore_form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                value={canteenInfo.zipCode}
                onChange={(e) =>
                  handleCanteenInfoChange("zipCode", e.target.value)
                }
                disabled={!isEditingCanteen}
                className={!isEditingCanteen ? "settingsstore_disabled" : ""}
              />
            </div>
          </div>
        </div>

        <div className="settingsstore_card-actions">
          <button
            className="settingsstore_save-btn"
            onClick={handleSaveCanteenInfo}
            disabled={!isEditingCanteen}
          >
            <FiSave />
            Save Canteen Info
          </button>
        </div>
      </div>

      {/* Operating Hours Card */}
      <div className="settingsstore_card settingsstore_operating-hours-card">
        <div className="settingsstore_card-header">
          <div className="settingsstore_card-title">
            <FiClock className="settingsstore_card-icon" />
            <div>
              <h3>Operating Hours</h3>
              <p>Set the canteen's operating hours for each day of the week</p>
            </div>
          </div>
        </div>

        <div className="settingsstore_hours-list">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div key={day} className="settingsstore_hour-row">
              <div className="settingsstore_day-name">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </div>
              <div className="settingsstore_hour-controls">
                <label className="settingsstore_toggle-switch">
                  <input
                    type="checkbox"
                    checked={hours.open}
                    onChange={(e) =>
                      handleOperatingHourChange(day, "open", e.target.checked)
                    }
                  />
                  <span className="settingsstore_slider"></span>
                </label>
                <span className="settingsstore_status">
                  {hours.open ? "Open" : "Closed"}
                </span>
                {hours.open && (
                  <>
                    <select
                      value={hours.openTime}
                      onChange={(e) =>
                        handleOperatingHourChange(
                          day,
                          "openTime",
                          e.target.value
                        )
                      }
                      className="settingsstore_time-select"
                    >
                      {timeOptions.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                    <span className="settingsstore_to">to</span>
                    <select
                      value={hours.closeTime}
                      onChange={(e) =>
                        handleOperatingHourChange(
                          day,
                          "closeTime",
                          e.target.value
                        )
                      }
                      className="settingsstore_time-select"
                    >
                      {timeOptions.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="settingsstore_card-actions">
          <button
            className="settingsstore_save-btn"
            onClick={handleSaveOperatingHours}
          >
            <FiSave />
            Save Operating Hours
          </button>
        </div>
      </div>

      {/* Payment Methods Card */}
      <div className="settingsstore_card settingsstore_payment-methods-card">
        <div className="settingsstore_card-header">
          <div className="settingsstore_card-title">
            <FiCreditCard className="settingsstore_card-icon" />
            <div>
              <h3>Payment Methods</h3>
              <p>
                Configure which payment methods are accepted at your canteen
              </p>
            </div>
          </div>
        </div>

        <div className="settingsstore_payment-options">
          <div className="settingsstore_payment-option">
            <label className="settingsstore_checkbox-label">
              <input
                type="checkbox"
                checked={paymentMethods.cashPayment}
                onChange={(e) =>
                  handlePaymentMethodChange("cashPayment", e.target.checked)
                }
              />
              <span className="settingsstore_checkmark"></span>
              <span className="settingsstore_payment-name">Cash Payment</span>
            </label>
          </div>
          <div className="settingsstore_payment-option">
            <label className="settingsstore_checkbox-label">
              <input
                type="checkbox"
                checked={paymentMethods.payMongo}
                onChange={(e) =>
                  handlePaymentMethodChange("payMongo", e.target.checked)
                }
              />
              <span className="settingsstore_checkmark"></span>
              <span className="settingsstore_payment-name">PayMongo</span>
            </label>
          </div>
          <div className="settingsstore_payment-option">
            <label className="settingsstore_checkbox-label">
              <input
                type="checkbox"
                checked={paymentMethods.creditDebitCard}
                onChange={(e) =>
                  handlePaymentMethodChange("creditDebitCard", e.target.checked)
                }
              />
              <span className="settingsstore_checkmark"></span>
              <span className="settingsstore_payment-name">
                Credit/Debit Card
              </span>
            </label>
          </div>
        </div>

        <div className="settingsstore_card-actions">
          <button
            className="settingsstore_save-btn"
            onClick={handleSavePaymentMethods}
          >
            <FiSave />
            Save Payment Methods
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsStore;
