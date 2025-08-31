// components/LoadingScreen.jsx
import React from "react";

const LoadingScreen = () => {
  const styles = {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#0f0f0f",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    spinner: {
      border: "4px solid rgba(255, 255, 255, 0.2)",
      borderTop: "4px solid #fff",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      animation: "spin 1s linear infinite",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading, please wait...</p>

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
