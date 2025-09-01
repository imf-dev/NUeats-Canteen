import React, { useRef } from "react";
import {
  FaUser,
  FaUpload,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import "./SA_AdminProfile.css";

const SA_AdminProfile = ({
  profileData,
  isEditMode,
  onProfileChange,
  onToggleEditMode,
  onSaveProfile,
  showModal,
}) => {
  const fileInputRef = useRef(null);

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
        onProfileChange("profilePicture", e.target.result);
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
        onProfileChange("profilePicture", null);
        showModal(
          "success",
          "Picture Removed",
          "Profile picture has been removed successfully!"
        );
      },
      "Remove"
    );
  };

  return (
    <div className="saadminprofile_settings-card">
      <div className="saadminprofile_card-header">
        <div className="saadminprofile_card-title-section">
          <FaUser className="saadminprofile_card-icon" />
          <div>
            <h3>Admin Profile</h3>
            <p>Manage personal information and account details</p>
          </div>
        </div>
        <button
          className={`saadminprofile_toggle-edit-btn ${
            isEditMode ? "saadminprofile_active" : ""
          }`}
          onClick={onToggleEditMode}
        >
          {isEditMode ? <FaToggleOn /> : <FaToggleOff />}
          <span>{isEditMode ? "Lock" : "Edit"}</span>
        </button>
      </div>

      <div className="saadminprofile_profile-picture-section">
        <h4>Profile Picture</h4>
        <div className="saadminprofile_profile-picture-container">
          <div className="saadminprofile_profile-picture">
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" />
            ) : (
              <div className="saadminprofile_profile-initials">
                {getInitials(profileData.firstName, profileData.lastName)}
              </div>
            )}
          </div>
          <div className="saadminprofile_profile-picture-actions">
            <button
              className="saadminprofile_upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload />
              Upload New
            </button>
            <button
              className="saadminprofile_remove-btn"
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

      <div className="saadminprofile_form-row">
        <div className="saadminprofile_form-group">
          <label>First Name *</label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => onProfileChange("firstName", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter your first name"
          />
        </div>
        <div className="saadminprofile_form-group">
          <label>Last Name *</label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => onProfileChange("lastName", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="saadminprofile_form-row">
        <div className="saadminprofile_form-group">
          <label>Email Address *</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => onProfileChange("email", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter your email address"
          />
        </div>
        <div className="saadminprofile_form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => onProfileChange("phone", e.target.value)}
            disabled={!isEditMode}
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div className="saadminprofile_card-actions">
        <button
          className="saadminprofile_save-btn"
          onClick={onSaveProfile}
          disabled={!isEditMode}
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default SA_AdminProfile;
