import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const parseHashParams = () => {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.substring(1)
    : window.location.hash;
  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  const type = params.get("type");
  return { access_token, refresh_token, type };
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const { access_token, refresh_token, type } = useMemo(parseHashParams, []);

  useEffect(() => {
    let mounted = true;
    const ensureSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (!data.session && access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
      } catch (e) {
        // no-op: show form anyway and fail on submit if needed
      }
    };
    ensureSession();
    return () => {
      mounted = false;
    };
  }, [access_token, refresh_token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      setIsBusy(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage(error.message || "Failed to update password.");
        setIsBusy(false);
        return;
      }
      setMessage("Password updated. Redirecting to sign in...");
      setTimeout(() => navigate("/NUeats-Canteen/", { replace: true }), 1200);
    } catch (err) {
      setMessage(err.message || "Unexpected error.");
      setIsBusy(false);
    }
  };

  const isRecovery = type === "recovery";

  return (
    <div className="login_container" style={{ paddingTop: 60 }}>
      <div className="login_content" style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
        <h1 className="login_portal-title">Reset Password</h1>
        {!isRecovery && (
          <p style={{ color: "#ef4444", marginBottom: 16 }}>
            Invalid or missing recovery token. Open the link from your email again.
          </p>
        )}
        <form className="login_form" onSubmit={onSubmit}>
          <div className="login_form-group">
            <label className="login_form-label">New Password</label>
            <input
              type="password"
              className="login_form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="login_form-group">
            <label className="login_form-label">Confirm Password</label>
            <input
              type="password"
              className="login_form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>
          {message && (
            <div className="login_alert" style={{ marginTop: 8 }}>
              <span>{message}</span>
            </div>
          )}
          <button type="submit" className="login_signin-button" disabled={isBusy}>
            {isBusy ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;


