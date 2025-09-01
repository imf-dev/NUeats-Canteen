import React, { useState, useRef } from "react";
import {
  FaUser,
  FaUpload,
  FaTrash,
  FaEdit,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShield,
  FaToggleOn,
  FaToggleOff,
  FaBell,
  FaClock,
  FaKey,
} from "react-icons/fa";
import { adminDemoData } from "../../../demodata/adminDemoData";
import "./SettingsAdmin.css";

const SettingsAdmin = () => {
  const [profileData, setProfileData] = useState(adminDemoData.profile);
  const [credentialsData, setCredentialsData] = useState(
    adminDemoData.credentials
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalProfileData, setOriginalProfileData] = useState(
    adminDemoData.profile
  );
  const [originalCredentialsData, setOriginalCredentialsData] = useState(
    adminDemoData.credentials
  );

  const [passwords, setPasswords] = useState({
    current: credentialsData.currentPassword,
    new: "",
    confirm: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [sessionTimeoutOpen, setSessionTimeoutOpen] = useState(false);
  const [passwordExpiryOpen, setPasswordExpiryOpen] = useState(false);

  const fileInputRef = useRef(null);

  const sessionTimeoutOptions = [
    "15 minutes",
    "30 minutes",
    "1 hour",
    "2 hour",
    "8 hour",
  ];
  const passwordExpiryOptions = [
    "30 days",
    "60 days",
    "90 days",
    "180 days",
    "1 year",
  ];

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    if (
      window.confirm("Are you sure you want to remove your profile picture?")
    ) {
      setProfileData((prev) => ({
        ...prev,
        profilePicture: null,
      }));
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // Reset to original data when canceling edit
      setProfileData(originalProfileData);
    } else {
      // Save current data as original when entering edit mode
      setOriginalProfileData(profileData);
    }
    setIsEditMode(!isEditMode);
  };

  const hasProfileChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalProfileData);
  };

  const hasCredentialChanges = () => {
    return (
      JSON.stringify(credentialsData) !==
      JSON.stringify(originalCredentialsData)
    );
  };

  const hasPasswordChanges = () => {
    return passwords.new !== "" || passwords.confirm !== "";
  };

  const handleSaveProfile = () => {
    const emptyFields = [];
    if (!profileData.firstName.trim()) emptyFields.push("First Name");
    if (!profileData.lastName.trim()) emptyFields.push("Last Name");
    if (!profileData.email.trim()) emptyFields.push("Email Address");
    if (!profileData.phone.trim()) emptyFields.push("Phone Number");

    if (emptyFields.length > 0) {
      alert(`Please fill in the following fields: ${emptyFields.join(", ")}`);
      return;
    }

    if (!hasProfileChanges()) {
      alert("No changes were made to save.");
      return;
    }

    setOriginalProfileData(profileData);
    setIsEditMode(false);
    alert("Profile saved successfully!");
  };

  const handleUpdatePassword = () => {
    if (!passwords.new.trim() || !passwords.confirm.trim()) {
      alert("Please fill in both new password fields.");
      return;
    }

    if (!hasPasswordChanges()) {
      alert("No password changes were made.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (passwords.new === passwords.current) {
      alert("New password must be different from current password.");
      return;
    }

    setCredentialsData((prev) => ({
      ...prev,
      currentPassword: passwords.new,
    }));

    setPasswords({
      current: passwords.new,
      new: "",
      confirm: "",
    });

    alert("Password updated successfully!");
  };

  const handleSaveSecuritySettings = () => {
    if (!hasCredentialChanges()) {
      alert("No security settings were changed.");
      return;
    }

    setOriginalCredentialsData(credentialsData);
    alert("Security settings saved successfully!");
  };

  return (
    <div className="settingsadmin_settings-admin-container">
      {/* Admin Profile Card */}
      <div className="settingsadmin_settings-card">
        <div className="settingsadmin_card-header">
          <div className="settingsadmin_card-title-section">
            <FaUser className="settingsadmin_card-icon" />
            <div>
              <h3>Admin Profile</h3>
              <p>Manage personal information and account details</p>
            </div>
          </div>
          <button
            className={`settingsadmin_toggle-edit-btn ${
              isEditMode ? "settingsadmin_active" : ""
            }`}
            onClick={toggleEditMode}
          >
            {isEditMode ? <FaToggleOn /> : <FaToggleOff />}
            <span>{isEditMode ? "Lock" : "Edit"}</span>
          </button>
        </div>

        <div className="settingsadmin_profile-picture-section">
          <h4>Profile Picture</h4>
          <div className="settingsadmin_profile-picture-container">
            <div className="settingsadmin_profile-picture">
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" />
              ) : (
                <div className="settingsadmin_profile-initials">
                  {getInitials(profileData.firstName, profileData.lastName)}
                </div>
              )}
            </div>
            <div className="settingsadmin_profile-picture-actions">
              <button
                className="settingsadmin_upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload />
                Upload New
              </button>
              <button
                className="settingsadmin_remove-btn"
                onClick={handleRemoveProfilePicture}
                disabled={!profileData.profilePicture}
              >
                <FaTrash />
                Remove
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="settingsadmin_form-row">
          <div className="settingsadmin_form-group">
            <label>First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) =>
                handleProfileInputChange("firstName", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="First Name"
            />
          </div>
          <div className="settingsadmin_form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) =>
                handleProfileInputChange("lastName", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="settingsadmin_form-row">
          <div className="settingsadmin_form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                handleProfileInputChange("email", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="Email Address"
            />
          </div>
          <div className="settingsadmin_form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                handleProfileInputChange("phone", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="Phone Number"
            />
          </div>
        </div>

        <div className="settingsadmin_card-actions">
          <button
            className="settingsadmin_save-btn"
            onClick={handleSaveProfile}
            disabled={!isEditMode}
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="settingsadmin_settings-card">
        <div className="settingsadmin_card-header">
          <div className="settingsadmin_card-title-section">
            <FaLock className="settingsadmin_card-icon" />
            <div>
              <h3>Change Password</h3>
              <p>Update password to keep your account secure</p>
            </div>
          </div>
        </div>

        <div className="settingsadmin_form-group">
          <label>Current Password</label>
          <div className="settingsadmin_password-input-container">
            <input
              type={passwordVisibility.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => handlePasswordChange("current", e.target.value)}
              placeholder="Current Password"
              readOnly
            />
            <button
              type="button"
              className="settingsadmin_password-toggle"
              onClick={() => togglePasswordVisibility("current")}
            >
              {passwordVisibility.current ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <div className="settingsadmin_form-group">
          <label>New Password</label>
          <div className="settingsadmin_password-input-container">
            <input
              type={passwordVisibility.new ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => handlePasswordChange("new", e.target.value)}
              placeholder="New Password"
            />
            <button
              type="button"
              className="settingsadmin_password-toggle"
              onClick={() => togglePasswordVisibility("new")}
            >
              {passwordVisibility.new ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <div className="settingsadmin_form-group">
          <label>Confirm New Password</label>
          <div className="settingsadmin_password-input-container">
            <input
              type={passwordVisibility.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => handlePasswordChange("confirm", e.target.value)}
              placeholder="Confirm New Password"
            />
            <button
              type="button"
              className="settingsadmin_password-toggle"
              onClick={() => togglePasswordVisibility("confirm")}
            >
              {passwordVisibility.confirm ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <div className="settingsadmin_card-actions">
          <button
            className="settingsadmin_save-btn"
            onClick={handleUpdatePassword}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Security Settings Card */}
      <div className="settingsadmin_settings-card">
        <div className="settingsadmin_card-header">
          <div className="settingsadmin_card-title-section">
            <FaShield className="settingsadmin_card-icon" />
            <div>
              <h3>Security Settings</h3>
              <p>Configure security preferences for admin account</p>
            </div>
          </div>
        </div>

        <div className="settingsadmin_security-option">
          <div className="settingsadmin_security-option-info">
            <FaKey className="settingsadmin_security-icon" />
            <div>
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to account</p>
            </div>
          </div>
          <button
            className={`settingsadmin_toggle-switch ${
              credentialsData.twoFactorEnabled ? "settingsadmin_active" : ""
            }`}
            onClick={() =>
              setCredentialsData((prev) => ({
                ...prev,
                twoFactorEnabled: !prev.twoFactorEnabled,
              }))
            }
          >
            {credentialsData.twoFactorEnabled ? (
              <FaToggleOn />
            ) : (
              <FaToggleOff />
            )}
          </button>
        </div>

        <div className="settingsadmin_security-option">
          <div className="settingsadmin_security-option-info">
            <FaBell className="settingsadmin_security-icon" />
            <div>
              <h4>Login Notifications</h4>
              <p>Get notified of new login attempts</p>
            </div>
          </div>
          <button
            className={`settingsadmin_toggle-switch ${
              credentialsData.loginNotifications ? "settingsadmin_active" : ""
            }`}
            onClick={() =>
              setCredentialsData((prev) => ({
                ...prev,
                loginNotifications: !prev.loginNotifications,
              }))
            }
          >
            {credentialsData.loginNotifications ? (
              <FaToggleOn />
            ) : (
              <FaToggleOff />
            )}
          </button>
        </div>

        <div className="settingsadmin_form-row">
          <div className="settingsadmin_form-group">
            <label>Session Timeout</label>
            <div
              className={`settingsadmin_dropdown ${
                sessionTimeoutOpen ? "settingsadmin_open" : ""
              }`}
            >
              <button
                className="settingsadmin_dropdown-toggle"
                onClick={() => setSessionTimeoutOpen(!sessionTimeoutOpen)}
              >
                {credentialsData.sessionTimeout}
                <span className="settingsadmin_dropdown-arrow">▼</span>
              </button>
              {sessionTimeoutOpen && (
                <div className="settingsadmin_dropdown-menu">
                  {sessionTimeoutOptions.map((option) => (
                    <button
                      key={option}
                      className="settingsadmin_dropdown-item"
                      onClick={() => {
                        setCredentialsData((prev) => ({
                          ...prev,
                          sessionTimeout: option,
                        }));
                        setSessionTimeoutOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="settingsadmin_form-group">
            <label>Password Expiry</label>
            <div
              className={`settingsadmin_dropdown ${
                passwordExpiryOpen ? "settingsadmin_open" : ""
              }`}
            >
              <button
                className="settingsadmin_dropdown-toggle"
                onClick={() => setPasswordExpiryOpen(!passwordExpiryOpen)}
              >
                {credentialsData.passwordExpiry}
                <span className="settingsadmin_dropdown-arrow">▼</span>
              </button>
              {passwordExpiryOpen && (
                <div className="settingsadmin_dropdown-menu">
                  {passwordExpiryOptions.map((option) => (
                    <button
                      key={option}
                      className="settingsadmin_dropdown-item"
                      onClick={() => {
                        setCredentialsData((prev) => ({
                          ...prev,
                          passwordExpiry: option,
                        }));
                        setPasswordExpiryOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="settingsadmin_card-actions">
          <button
            className="settingsadmin_save-btn"
            onClick={handleSaveSecuritySettings}
          >
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
