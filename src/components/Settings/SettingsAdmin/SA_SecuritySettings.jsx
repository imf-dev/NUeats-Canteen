import React from "react";
import {
  FaShieldAlt,
  FaKey,
  FaBell,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import "./SA_SecuritySettings.css";

const SA_SecuritySettings = ({
  credentialsData,
  sessionTimeoutOptions,
  passwordExpiryOptions,
  sessionTimeoutOpen,
  passwordExpiryOpen,
  onCredentialsChange,
  onToggleDropdown,
  onSaveSecuritySettings,
  isSaving,
}) => {
  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (onToggleDropdown) {
        onToggleDropdown("sessionTimeoutOpen", false);
        onToggleDropdown("passwordExpiryOpen", false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onToggleDropdown]);

  return (
    <div className="sasecuritysettings_settings-card">
      <div className="sasecuritysettings_card-header">
        <div className="sasecuritysettings_card-title-section">
          <FaShieldAlt className="sasecuritysettings_card-icon" />
          <div>
            <h3>Security Settings</h3>
            <p>Configure security preferences for admin account</p>
          </div>
        </div>
      </div>

      <div className="sasecuritysettings_security-option">
        <div className="sasecuritysettings_security-option-info">
          <FaKey className="sasecuritysettings_security-icon" />
          <div>
            <h4>Two-Factor Authentication</h4>
            <p>Add an extra layer of security to account</p>
          </div>
        </div>
        <button
          className={`sasecuritysettings_toggle-switch ${
            credentialsData.twoFactorEnabled ? "sasecuritysettings_active" : ""
          }`}
          onClick={() =>
            onCredentialsChange(
              "twoFactorEnabled",
              !credentialsData.twoFactorEnabled
            )
          }
        >
          {credentialsData.twoFactorEnabled ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </div>

      <div className="sasecuritysettings_security-option">
        <div className="sasecuritysettings_security-option-info">
          <FaBell className="sasecuritysettings_security-icon" />
          <div>
            <h4>Login Notifications</h4>
            <p>Get notified of new login attempts</p>
          </div>
        </div>
        <button
          className={`sasecuritysettings_toggle-switch ${
            credentialsData.loginNotifications
              ? "sasecuritysettings_active"
              : ""
          }`}
          onClick={() =>
            onCredentialsChange(
              "loginNotifications",
              !credentialsData.loginNotifications
            )
          }
        >
          {credentialsData.loginNotifications ? (
            <FaToggleOn />
          ) : (
            <FaToggleOff />
          )}
        </button>
      </div>

      <div className="sasecuritysettings_form-row">
        <div className="sasecuritysettings_form-group">
          <label>Session Timeout</label>
          <div
            className={`sasecuritysettings_dropdown ${
              sessionTimeoutOpen ? "sasecuritysettings_open" : ""
            }`}
          >
            <button
              className="sasecuritysettings_dropdown-toggle"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDropdown("sessionTimeoutOpen", !sessionTimeoutOpen);
                onToggleDropdown("passwordExpiryOpen", false);
              }}
            >
              {credentialsData.sessionTimeout}
              <span className="sasecuritysettings_dropdown-arrow">▼</span>
            </button>
            {sessionTimeoutOpen && (
              <div className="sasecuritysettings_dropdown-menu">
                {sessionTimeoutOptions.map((option) => (
                  <button
                    key={option}
                    className="sasecuritysettings_dropdown-item"
                    onClick={() => {
                      onCredentialsChange("sessionTimeout", option);
                      onToggleDropdown("sessionTimeoutOpen", false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sasecuritysettings_form-group">
          <label>Password Expiry</label>
          <div
            className={`sasecuritysettings_dropdown ${
              passwordExpiryOpen ? "sasecuritysettings_open" : ""
            }`}
          >
            <button
              className="sasecuritysettings_dropdown-toggle"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDropdown("passwordExpiryOpen", !passwordExpiryOpen);
                onToggleDropdown("sessionTimeoutOpen", false);
              }}
            >
              {credentialsData.passwordExpiry}
              <span className="sasecuritysettings_dropdown-arrow">▼</span>
            </button>
            {passwordExpiryOpen && (
              <div className="sasecuritysettings_dropdown-menu">
                {passwordExpiryOptions.map((option) => (
                  <button
                    key={option}
                    className="sasecuritysettings_dropdown-item"
                    onClick={() => {
                      onCredentialsChange("passwordExpiry", option);
                      onToggleDropdown("passwordExpiryOpen", false);
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

      <div className="sasecuritysettings_card-actions">
        <button
          className="sasecuritysettings_save-btn"
          onClick={onSaveSecuritySettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Security Settings"}
        </button>
      </div>
    </div>
  );
};

export default SA_SecuritySettings;
