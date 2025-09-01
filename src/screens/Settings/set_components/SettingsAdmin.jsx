import React, { useState, useRef } from "react";
import {
  FaUser,
  FaUpload,
  FaTrash,
  FaEdit,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaToggleOn,
  FaToggleOff,
  FaBell,
  FaClock,
  FaKey,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { adminDemoData } from "../../../demodata/adminDemoData";
import "./SettingsAdmin.css";

// Custom Modal Component
const CustomModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = "OK",
}) => {
  if (!isOpen) return null;

  const getModalIcon = () => {
    switch (type) {
      case "success":
        return (
          <FaCheck className="settingsadmin_modal-icon settingsadmin_success" />
        );
      case "warning":
        return (
          <FaExclamationTriangle className="settingsadmin_modal-icon settingsadmin_warning" />
        );
      case "error":
        return (
          <FaExclamationTriangle className="settingsadmin_modal-icon settingsadmin_error" />
        );
      case "confirm":
        return (
          <FaInfoCircle className="settingsadmin_modal-icon settingsadmin_info" />
        );
      default:
        return (
          <FaInfoCircle className="settingsadmin_modal-icon settingsadmin_info" />
        );
    }
  };

  return (
    <div className="settingsadmin_custom-modal-overlay" onClick={onClose}>
      <div
        className={`settingsadmin_custom-modal-content ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settingsadmin_modal-header">
          {getModalIcon()}
          <h3>{title}</h3>
          <button className="settingsadmin_modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="settingsadmin_modal-body">
          <p>{message}</p>
        </div>
        <div className="settingsadmin_modal-footer">
          {type === "confirm" ? (
            <>
              <button
                className="settingsadmin_modal-btn settingsadmin_secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="settingsadmin_modal-btn settingsadmin_primary"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              className="settingsadmin_modal-btn settingsadmin_primary"
              onClick={onClose}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "OK",
  });

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

  // Modal helper functions
  const showModal = (
    type,
    title,
    message,
    onConfirm = null,
    confirmText = "OK"
  ) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "info",
      title: "",
      message: "",
      onConfirm: null,
      confirmText: "OK",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showModal(
          "error",
          "File Too Large",
          "Please select an image file smaller than 5MB."
        );
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        showModal(
          "error",
          "Invalid File Type",
          "Please select a valid image file (JPG, PNG, GIF, etc.)."
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: e.target.result,
        }));
        showModal(
          "success",
          "Image Uploaded",
          "Profile picture has been uploaded successfully!"
        );
      };
      reader.onerror = () => {
        showModal(
          "error",
          "Upload Failed",
          "There was an error uploading your image. Please try again."
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    if (!profileData.profilePicture) {
      showModal(
        "warning",
        "No Profile Picture",
        "There is no profile picture to remove."
      );
      return;
    }

    showModal(
      "confirm",
      "Remove Profile Picture",
      "Are you sure you want to remove your profile picture?",
      () => {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: null,
        }));
        showModal(
          "success",
          "Picture Removed",
          "Profile picture has been removed successfully!"
        );
        closeModal();
      },
      "Remove"
    );
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
      // Check if there are unsaved changes before exiting edit mode
      if (hasProfileChanges()) {
        showModal(
          "confirm",
          "Unsaved Changes",
          "You have unsaved changes. Are you sure you want to discard them?",
          () => {
            setProfileData(originalProfileData);
            setIsEditMode(false);
            closeModal();
          },
          "Discard Changes"
        );
        return;
      }
      setProfileData(originalProfileData);
    } else {
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const handleSaveProfile = () => {
    if (!isEditMode) {
      showModal(
        "warning",
        "Edit Mode Required",
        "Please enable edit mode to make changes to your profile."
      );
      return;
    }

    const emptyFields = [];
    const invalidFields = [];

    // Check for empty required fields
    if (!profileData.firstName.trim()) emptyFields.push("First Name");
    if (!profileData.lastName.trim()) emptyFields.push("Last Name");
    if (!profileData.email.trim()) emptyFields.push("Email Address");
    if (!profileData.phone.trim()) emptyFields.push("Phone Number");

    // Check for valid email format
    if (profileData.email.trim() && !validateEmail(profileData.email)) {
      invalidFields.push("Email Address (invalid format)");
    }

    // Check for valid phone format
    if (profileData.phone.trim() && !validatePhone(profileData.phone)) {
      invalidFields.push("Phone Number (invalid format)");
    }

    if (emptyFields.length > 0) {
      showModal(
        "error",
        "Missing Required Fields",
        `Please fill in the following required fields: ${emptyFields.join(
          ", "
        )}`
      );
      return;
    }

    if (invalidFields.length > 0) {
      showModal(
        "error",
        "Invalid Information",
        `Please correct the following fields: ${invalidFields.join(", ")}`
      );
      return;
    }

    if (!hasProfileChanges()) {
      showModal(
        "warning",
        "No Changes Made",
        "You haven't made any changes to save."
      );
      return;
    }

    setOriginalProfileData(profileData);
    setIsEditMode(false);
    showModal(
      "success",
      "Profile Saved",
      "Your profile has been saved successfully!"
    );
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleUpdatePassword = () => {
    if (!passwords.new.trim() || !passwords.confirm.trim()) {
      showModal(
        "error",
        "Missing Password Fields",
        "Please fill in both new password and confirm password fields."
      );
      return;
    }

    if (!hasPasswordChanges()) {
      showModal(
        "warning",
        "No Password Changes",
        "You haven't made any password changes to save."
      );
      return;
    }

    if (passwords.new !== passwords.confirm) {
      showModal(
        "error",
        "Password Mismatch",
        "New password and confirm password do not match. Please try again."
      );
      return;
    }

    if (passwords.new === passwords.current) {
      showModal(
        "error",
        "Same Password",
        "New password must be different from your current password."
      );
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(passwords.new);
    if (passwordValidation) {
      showModal("error", "Weak Password", passwordValidation);
      return;
    }

    showModal(
      "confirm",
      "Update Password",
      "Are you sure you want to update your password? You will need to use the new password for future logins.",
      () => {
        setCredentialsData((prev) => ({
          ...prev,
          currentPassword: passwords.new,
        }));

        setPasswords({
          current: passwords.new,
          new: "",
          confirm: "",
        });

        showModal(
          "success",
          "Password Updated",
          "Your password has been updated successfully! Please remember to use your new password for future logins."
        );
        closeModal();
      },
      "Update Password"
    );
  };

  const handleSaveSecuritySettings = () => {
    if (!hasCredentialChanges()) {
      showModal(
        "warning",
        "No Changes Made",
        "You haven't made any changes to your security settings."
      );
      return;
    }

    showModal(
      "confirm",
      "Save Security Settings",
      "Are you sure you want to save these security settings? Some changes may affect how you access your account.",
      () => {
        setOriginalCredentialsData(credentialsData);
        showModal(
          "success",
          "Security Settings Saved",
          "Your security settings have been saved successfully!"
        );
        closeModal();
      },
      "Save Settings"
    );
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setSessionTimeoutOpen(false);
      setPasswordExpiryOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="settingsadmin_settings-admin-container">
      {/* Custom Modal */}
      <CustomModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
      />

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
            <label>First Name *</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) =>
                handleProfileInputChange("firstName", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="Enter your first name"
            />
          </div>
          <div className="settingsadmin_form-group">
            <label>Last Name *</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) =>
                handleProfileInputChange("lastName", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="settingsadmin_form-row">
          <div className="settingsadmin_form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                handleProfileInputChange("email", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="Enter your email address"
            />
          </div>
          <div className="settingsadmin_form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                handleProfileInputChange("phone", e.target.value)
              }
              disabled={!isEditMode}
              placeholder="Enter your phone number"
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
              placeholder="Your current password"
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
          <label>New Password *</label>
          <div className="settingsadmin_password-input-container">
            <input
              type={passwordVisibility.new ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => handlePasswordChange("new", e.target.value)}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="settingsadmin_password-toggle"
              onClick={() => togglePasswordVisibility("new")}
            >
              {passwordVisibility.new ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <small className="settingsadmin_password-hint">
            Password must be at least 8 characters with uppercase, lowercase,
            numbers, and special characters
          </small>
        </div>

        <div className="settingsadmin_form-group">
          <label>Confirm New Password *</label>
          <div className="settingsadmin_password-input-container">
            <input
              type={passwordVisibility.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => handlePasswordChange("confirm", e.target.value)}
              placeholder="Confirm your new password"
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
            <FaShieldAlt className="settingsadmin_card-icon" />
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSessionTimeoutOpen(!sessionTimeoutOpen);
                  setPasswordExpiryOpen(false);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setPasswordExpiryOpen(!passwordExpiryOpen);
                  setSessionTimeoutOpen(false);
                }}
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
