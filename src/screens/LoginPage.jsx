import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // <-- added

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

  //demo only!!
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const demoEmail = "admin1234";
    const demoPassword = "admin1234";

    if (email === demoEmail && password === demoPassword) {
      setShowAlert(false);
      console.log("Demo account signed in successfully!");
      navigate("/dashboard"); // redirect
    } else {
      setShowAlert(true); // Show the alert
    }
  };

  // New function to submit on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      className="login-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="login-content">
        <div className="logo-container">
          <img src={nueatsLogo} alt="NUeats Logo" className="logo-image" />
        </div>

        <h1 className="portal-title">Canteen Admin Portal</h1>

        <div className="login-form-container">
          <h2 className="form-title">Sign In</h2>
          <p className="form-subtitle">Sign in with your account</p>

          <div className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <svg
                  className="input-icon"
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
                  onKeyDown={handleKeyPress} // <-- Enter key support
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <svg
                  className="input-icon"
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
                  onKeyDown={handleKeyPress} // <-- Enter key support
                  placeholder="Enter your password"
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    {/* Eye outline */}
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

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                />
                Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            {showAlert && (
              <div className="login-alert">
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
                <span>Invalid email or password. Please try again.</span>
              </div>
            )}

            <button
              type="button"
              className="signin-button"
              onClick={handleSubmit}
            >
              Sign In
            </button>

            <div className="signup-link">
              Don't have an account?{" "}
              <a href="#" className="signup-link-a">
                Sign up here
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        © 2025 NUeats - NU-Dasmariñas Canteen. All rights reserved.
      </div>
    </motion.div>
  );
};

export default LoginPage;
