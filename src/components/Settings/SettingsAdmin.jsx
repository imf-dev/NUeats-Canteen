import React, { useState, useEffect } from "react";
import { adminDemoData } from "../../demodata/adminDemoData";
import CustomModal from "../common/CustomModal";
import LoadingScreen from "../common/LoadingScreen";
import SA_AdminProfile from "./SettingsAdmin/SA_AdminProfile";
import SA_ChangePass from "./SettingsAdmin/SA_ChangePass";
import SA_SecuritySettings from "./SettingsAdmin/SA_SecuritySettings";
import {
  fetchAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
  fetchSecuritySettings,
  updateSecuritySettings,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../../lib/profileService";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
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

  // Fetch admin profile and security settings on component mount
  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data
        const profile = await fetchAdminProfile();
        setProfileData({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          profilePicture: profile.profilePicture,
        });
        setOriginalProfileData({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          profilePicture: profile.profilePicture,
        });

        // Fetch security settings
        const securitySettings = await fetchSecuritySettings();
        setCredentialsData({
          currentPassword: "", // We don't fetch the actual password for security
          twoFactorEnabled: securitySettings.twoFactorEnabled,
          loginNotifications: securitySettings.loginNotifications,
          sessionTimeout: securitySettings.sessionTimeout,
          passwordExpiry: securitySettings.passwordExpiry,
        });
        setOriginalCredentialsData({
          currentPassword: "",
          twoFactorEnabled: securitySettings.twoFactorEnabled,
          loginNotifications: securitySettings.loginNotifications,
          sessionTimeout: securitySettings.sessionTimeout,
          passwordExpiry: securitySettings.passwordExpiry,
        });
      } catch (error) {
        console.error("Error loading admin data:", error);
        showModal(
          "error",
          "Error Loading Data",
          "Failed to load your profile data. Please refresh the page and try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Profile handlers
  const handleProfileInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

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

    setIsSaving(true);
    try {
      // Delete old profile picture from storage if it exists
      if (profileData.profilePicture) {
        await deleteProfilePicture(profileData.profilePicture);
      }

      // Upload new picture to Supabase Storage
      const publicUrl = await uploadProfilePicture(file);
      
      // Update local state
      setProfileData((prev) => ({
        ...prev,
        profilePicture: publicUrl,
      }));

      // Save to database
      await updateAdminProfile({
        ...profileData,
        profilePicture: publicUrl,
      });

      setOriginalProfileData({
        ...profileData,
        profilePicture: publicUrl,
      });

      showModal(
        "success",
        "Image Uploaded",
        "Profile picture has been uploaded successfully!"
      );
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      showModal(
        "error",
        "Upload Failed",
        error.message || "There was an error uploading your image. Please try again."
      );
    } finally {
      setIsSaving(false);
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
      async () => {
        setIsSaving(true);
        closeModal();
        try {
          // Delete from storage
          await deleteProfilePicture(profileData.profilePicture);

          // Update database
          await updateAdminProfile({
            ...profileData,
            profilePicture: null,
          });

          // Update local state
          setProfileData((prev) => ({
            ...prev,
            profilePicture: null,
          }));

          setOriginalProfileData({
            ...profileData,
            profilePicture: null,
          });

          showModal(
            "success",
            "Picture Removed",
            "Profile picture has been removed successfully!"
          );
        } catch (error) {
          console.error("Error removing profile picture:", error);
          showModal(
            "error",
            "Remove Failed",
            error.message || "Failed to remove profile picture. Please try again."
          );
        } finally {
          setIsSaving(false);
        }
      },
      "Remove"
    );
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

  const handleSaveProfile = async () => {
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

    // Save to database
    setIsSaving(true);
    try {
      await updateAdminProfile(profileData);
      setOriginalProfileData(profileData);
      setIsEditMode(false);
      showModal(
        "success",
        "Profile Saved",
        "Your profile has been saved successfully!"
      );
    } catch (error) {
      console.error("Error saving profile:", error);
      showModal(
        "error",
        "Save Failed",
        error.message || "Failed to save your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
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

    if (passwords.current && passwords.new === passwords.current) {
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
      async () => {
        setIsSaving(true);
        closeModal();
        try {
          await updateAdminPassword(passwords.new);

          setPasswords({
            current: "",
            new: "",
            confirm: "",
          });

          showModal(
            "success",
            "Password Updated",
            "Your password has been updated successfully! Please remember to use your new password for future logins."
          );
        } catch (error) {
          console.error("Error updating password:", error);
          showModal(
            "error",
            "Update Failed",
            error.message || "Failed to update password. Please try again."
          );
        } finally {
          setIsSaving(false);
        }
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
      async () => {
        setIsSaving(true);
        closeModal();
        try {
          await updateSecuritySettings({
            twoFactorEnabled: credentialsData.twoFactorEnabled,
            loginNotifications: credentialsData.loginNotifications,
            sessionTimeout: credentialsData.sessionTimeout,
            passwordExpiry: credentialsData.passwordExpiry,
          });

          setOriginalCredentialsData(credentialsData);
          showModal(
            "success",
            "Security Settings Saved",
            "Your security settings have been saved successfully!"
          );
        } catch (error) {
          console.error("Error saving security settings:", error);
          showModal(
            "error",
            "Save Failed",
            error.message || "Failed to save security settings. Please try again."
          );
        } finally {
          setIsSaving(false);
        }
      },
      "Save Settings"
    );
  };

  // Show loading screen while fetching data
  if (isLoading) {
    return <LoadingScreen />;
  }

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
        onFileUpload={handleFileUpload}
        onRemoveProfilePicture={handleRemoveProfilePicture}
        showModal={showModal}
        isSaving={isSaving}
      />

      {/* Change Password Card */}
      <SA_ChangePass
        passwords={passwords}
        passwordVisibility={passwordVisibility}
        onPasswordChange={handlePasswordChange}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onUpdatePassword={handleUpdatePassword}
        isSaving={isSaving}
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
        isSaving={isSaving}
      />
    </div>
  );
};

export default SettingsAdmin;
