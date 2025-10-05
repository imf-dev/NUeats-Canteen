import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { fetchUserRole } from "../lib/profileService";

import "../styles/LoginPage.css";
import nueatsLogo from "../assets/NUeats_wshadow.png";

// Transition variants
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = { type: "wait", duration: 0.5 };

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("Invalid email or password. Please try again.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);
    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAlertMsg(error.message || "Login failed");
        setShowAlert(true);
        return;
      }
      const userId = signInData?.user?.id;
      if (!userId) {
        setAlertMsg("No user returned from login");
        setShowAlert(true);
        return;
      }

      try {
        const role = await fetchUserRole(userId);
        if (role !== "admin") {
          setAlertMsg("Access denied: admin role required.");
          setShowAlert(true);
          await supabase.auth.signOut();
          return;
        }
      } catch (profileError) {
        setAlertMsg(profileError.message || "Failed to load profile");
        setShowAlert(true);
        await supabase.auth.signOut();
        return;
      }

      navigate("/NUeats-Canteen/dashboard/");
    } catch (err) {
      setAlertMsg(err.message || "Unexpected error");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed auto-redirect on mount to avoid navigation loops. We only navigate after
  // a successful admin login in handleSubmit.

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setAlertMsg("Enter your email to receive a reset link.");
      setShowAlert(true);
      return;
    }
    try {
      setIsResetting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setAlertMsg(error.message || "Failed to send reset email");
        setShowAlert(true);
        return;
      }
      setAlertMsg("Password reset email sent. Please check your inbox.");
      setShowAlert(true);
    } catch (err) {
      setAlertMsg(err.message || "Unexpected error while sending reset email");
      setShowAlert(true);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <motion.div
      className="login_container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="login_content">
        <div className="login_logo-container">
          <img
            src={nueatsLogo}
            alt="NUeats Logo"
            className="login_logo-image"
          />
        </div>

        <h1 className="login_portal-title">Canteen Admin Portal</h1>

        <div className="login_form-container">
          <h2 className="login_form-title">Sign In</h2>
          <p className="login_form-subtitle">Sign in with your account</p>

          <div className="login_form">
            <div className="login_form-group">
              <label htmlFor="email" className="login_form-label">
                Email Address
              </label>
              <div className="login_input-container">
                <svg
                  className="login_input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your email"
                  className="login_form-input"
                />
              </div>
            </div>

            <div className="login_form-group">
              <label htmlFor="password" className="login_form-label">
                Password
              </label>
              <div className="login_input-container">
                <svg
                  className="login_input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="16" r="1" fill="#9CA3AF" />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your password"
                  className="login_form-input"
                />
                <button
                  type="button"
                  className="login_password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {showPassword && (
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                      />
                    )}
                    {!showPassword && (
                      <path
                        d="M4 4L20 20"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="login_form-options">
              <label className="login_checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="login_checkbox"
                />
                Remember me
              </label>
              <a href="#" className="login_forgot-password" onClick={handleForgotPassword}>
                {isResetting ? "Sending..." : "Forgot Password?"}
              </a>
            </div>

            {showAlert && (
              <div className="login_alert">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    d="M12 2L2 22h20L12 2z"
                    stroke="#F35A5A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9v4"
                    stroke="#F35A5A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r="1" fill="#F35A5A" />
                </svg>
                <span>{alertMsg}</span>
              </div>
            )}

            <button
              type="button"
              className="login_signin-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>

      <div className="login_footer">
        © 2025 NUeats - NU-Dasmariñas Canteen. All rights reserved.
      </div>
    </motion.div>
  );
};

export default LoginPage;
