import React from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./SA_ChangePass.css";

const SA_ChangePass = ({
  passwords,
  passwordVisibility,
  onPasswordChange,
  onTogglePasswordVisibility,
  onUpdatePassword,
}) => {
  return (
    <div className="sachangepass_settings-card">
      <div className="sachangepass_card-header">
        <div className="sachangepass_card-title-section">
          <FaLock className="sachangepass_card-icon" />
          <div>
            <h3>Change Password</h3>
            <p>Update password to keep your account secure</p>
          </div>
        </div>
      </div>

      <div className="sachangepass_form-group">
        <label>Current Password</label>
        <div className="sachangepass_password-input-container">
          <input
            type={passwordVisibility.current ? "text" : "password"}
            value={passwords.current}
            onChange={(e) => onPasswordChange("current", e.target.value)}
            placeholder="Your current password"
            readOnly
          />
          <button
            type="button"
            className="sachangepass_password-toggle"
            onClick={() => onTogglePasswordVisibility("current")}
          >
            {passwordVisibility.current ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>

      <div className="sachangepass_form-group">
        <label>New Password *</label>
        <div className="sachangepass_password-input-container">
          <input
            type={passwordVisibility.new ? "text" : "password"}
            value={passwords.new}
            onChange={(e) => onPasswordChange("new", e.target.value)}
            placeholder="Enter your new password"
          />
          <button
            type="button"
            className="sachangepass_password-toggle"
            onClick={() => onTogglePasswordVisibility("new")}
          >
            {passwordVisibility.new ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <small className="sachangepass_password-hint">
          Password must be at least 8 characters with uppercase, lowercase,
          numbers, and special characters
        </small>
      </div>

      <div className="sachangepass_form-group">
        <label>Confirm New Password *</label>
        <div className="sachangepass_password-input-container">
          <input
            type={passwordVisibility.confirm ? "text" : "password"}
            value={passwords.confirm}
            onChange={(e) => onPasswordChange("confirm", e.target.value)}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            className="sachangepass_password-toggle"
            onClick={() => onTogglePasswordVisibility("confirm")}
          >
            {passwordVisibility.confirm ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>

      <div className="sachangepass_card-actions">
        <button className="sachangepass_save-btn" onClick={onUpdatePassword}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default SA_ChangePass;
