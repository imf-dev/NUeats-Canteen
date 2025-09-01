import React, { useState } from "react";
import { adminDemoData } from "../../demodata/adminDemoData";
import CustomModal from "../common/CustomModal";
import SA_AdminProfile from "./SettingsAdmin/SA_AdminProfile";
import SA_ChangePass from "./SettingsAdmin/SA_ChangePass";
import SA_SecuritySettings from "./SettingsAdmin/SA_SecuritySettings";
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

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "OK",
  });

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

  // Profile handlers
  const handleProfileInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
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

  // Password handlers
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

  const hasPasswordChanges = () => {
    return passwords.new !== "" || passwords.confirm !== "";
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

  // Security settings handlers
  const handleCredentialsChange = (field, value) => {
    setCredentialsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleDropdown = (dropdown, value) => {
    if (dropdown === "sessionTimeoutOpen") {
      setSessionTimeoutOpen(value);
    } else if (dropdown === "passwordExpiryOpen") {
      setPasswordExpiryOpen(value);
    }
  };

  const hasCredentialChanges = () => {
    return (
      JSON.stringify(credentialsData) !==
      JSON.stringify(originalCredentialsData)
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
      <SA_AdminProfile
        profileData={profileData}
        isEditMode={isEditMode}
        onProfileChange={handleProfileInputChange}
        onToggleEditMode={toggleEditMode}
        onSaveProfile={handleSaveProfile}
        showModal={showModal}
      />

      {/* Change Password Card */}
      <SA_ChangePass
        passwords={passwords}
        passwordVisibility={passwordVisibility}
        onPasswordChange={handlePasswordChange}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onUpdatePassword={handleUpdatePassword}
      />

      {/* Security Settings Card */}
      <SA_SecuritySettings
        credentialsData={credentialsData}
        sessionTimeoutOptions={sessionTimeoutOptions}
        passwordExpiryOptions={passwordExpiryOptions}
        sessionTimeoutOpen={sessionTimeoutOpen}
        passwordExpiryOpen={passwordExpiryOpen}
        onCredentialsChange={handleCredentialsChange}
        onToggleDropdown={handleToggleDropdown}
        onSaveSecuritySettings={handleSaveSecuritySettings}
      />
    </div>
  );
};

export default SettingsAdmin;
