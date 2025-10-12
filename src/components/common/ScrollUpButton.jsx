import React, { useState, useEffect, useCallback } from "react";
import { FiArrowUp } from "react-icons/fi";

const RobustScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Use useCallback to ensure stable function reference
  const toggleVisibility = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    // Add multiple event listeners for better compatibility
    const handleScroll = () => {
      toggleVisibility();
    };

    // Add listeners to both window and document
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    // Force initial check
    toggleVisibility();

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [toggleVisibility]);

  // Also check scroll position when component mounts/updates
  useEffect(() => {
    const timer = setTimeout(() => {
      toggleVisibility();
    }, 100);

    return () => clearTimeout(timer);
  }, [toggleVisibility]);

  const buttonStyles = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "50px",
    height: "50px",
    backgroundColor: "#3b4cb8",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease-in-out",
    zIndex: 10000, // Very high z-index
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? "visible" : "hidden",
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    pointerEvents: isVisible ? "auto" : "none", // Prevent clicks when hidden
  };

  const hoverStyles = {
    backgroundColor: "#2d3a8c",
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...buttonStyles,
        ...(isHovered && isVisible ? hoverStyles : {}),
      }}
      aria-label="Scroll to top"
      data-testid="scroll-up-button" // For debugging
    >
      <FiArrowUp />
    </button>
  );
};

export default RobustScrollUpButton;
