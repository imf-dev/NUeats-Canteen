import React, { useState } from "react";
import { FiSave, FiInfo } from "react-icons/fi";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import "./SS_CanteenInfo.css";

const SS_CanteenInfo = ({ canteenInfo, onSave, onCanteenInfoChange, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({ ...canteenInfo });

  const toggleEditMode = () => {
    if (isEditing) {
      // Check if there are unsaved changes before exiting edit mode
      if (JSON.stringify(canteenInfo) !== JSON.stringify(originalData)) {
        // Reset the data to original
        Object.keys(originalData).forEach((key) => {
          onCanteenInfoChange(key, originalData[key]);
        });
      }
    } else {
      setOriginalData({ ...canteenInfo });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
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
      onSave(false, "Please fill in all required fields", "error");
      return;
    }

    if (JSON.stringify(canteenInfo) === JSON.stringify(originalData)) {
      onSave(false, "No changes detected", "info");
      return;
    }

    // Save successful
    setOriginalData({ ...canteenInfo });
    setIsEditing(false);
    onSave(true, "Canteen information saved successfully!", "success");
  };

  return (
    <div className="ss-canteen-info_card ss-canteen-info_canteen-info-card">
      <div className="ss-canteen-info_card-header">
        <div className="ss-canteen-info_card-title">
          <FiInfo className="ss-canteen-info_card-icon" />
          <div>
            <h3>Canteen Information</h3>
            <p>Manage canteen's basic information and contact details</p>
          </div>
        </div>
        <button
          className={`ss-canteen-info_toggle-edit-btn ${
            isEditing ? "ss-canteen-info_active" : ""
          }`}
          onClick={toggleEditMode}
        >
          {isEditing ? <FaToggleOn /> : <FaToggleOff />}
          <span>{isEditing ? "Lock" : "Edit"}</span>
        </button>
      </div>

      <div className="ss-canteen-info_form-row">
        <div className="ss-canteen-info_form-group ss-canteen-info_full-width">
          <label>App/Canteen Name</label>
          <input
            type="text"
            value={canteenInfo.name}
            onChange={(e) => onCanteenInfoChange("name", e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "ss-canteen-info_disabled" : ""}
          />
        </div>
      </div>

      <div className="ss-canteen-info_form-row">
        <div className="ss-canteen-info_form-group ss-canteen-info_full-width">
          <label>Description</label>
          <textarea
            value={canteenInfo.description}
            onChange={(e) => onCanteenInfoChange("description", e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "ss-canteen-info_disabled" : ""}
            rows={3}
          />
        </div>
      </div>

      <div className="ss-canteen-info_form-row">
        <div className="ss-canteen-info_form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={canteenInfo.phoneNumber}
            onChange={(e) => onCanteenInfoChange("phoneNumber", e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "ss-canteen-info_disabled" : ""}
          />
        </div>
        <div className="ss-canteen-info_form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={canteenInfo.emailAddress}
            onChange={(e) =>
              onCanteenInfoChange("emailAddress", e.target.value)
            }
            disabled={!isEditing}
            className={!isEditing ? "ss-canteen-info_disabled" : ""}
          />
        </div>
      </div>

      <div className="ss-canteen-info_address-section">
        <h4>Address</h4>
        <div className="ss-canteen-info_form-row">
          <div className="ss-canteen-info_form-group ss-canteen-info_full-width">
            <label>Street Address</label>
            <input
              type="text"
              value={canteenInfo.streetAddress}
              onChange={(e) =>
                onCanteenInfoChange("streetAddress", e.target.value)
              }
              disabled={!isEditing}
              className={!isEditing ? "ss-canteen-info_disabled" : ""}
            />
          </div>
        </div>
        <div className="ss-canteen-info_form-row">
          <div className="ss-canteen-info_form-group">
            <label>City</label>
            <input
              type="text"
              value={canteenInfo.city}
              onChange={(e) => onCanteenInfoChange("city", e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "ss-canteen-info_disabled" : ""}
            />
          </div>
          <div className="ss-canteen-info_form-group">
            <label>Province</label>
            <input
              type="text"
              value={canteenInfo.province}
              onChange={(e) => onCanteenInfoChange("province", e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "ss-canteen-info_disabled" : ""}
            />
          </div>
          <div className="ss-canteen-info_form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              value={canteenInfo.zipCode}
              onChange={(e) => onCanteenInfoChange("zipCode", e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "ss-canteen-info_disabled" : ""}
            />
          </div>
        </div>
      </div>

      <div className="ss-canteen-info_card-actions">
        <button
          className="ss-canteen-info_save-btn"
          onClick={handleSave}
          disabled={!isEditing || isSaving}
        >
          <FiSave />
          {isSaving ? "Saving..." : "Save Canteen Info"}
        </button>
      </div>
    </div>
  );
};

export default SS_CanteenInfo;
