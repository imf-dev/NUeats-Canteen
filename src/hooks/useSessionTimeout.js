import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_TIME = 4 * 60 * 1000; // 4 minutes - show warning 1 minute before logout

export const useSessionTimeout = () => {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Reset timers when user is active
  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsActive(true);
    setIsWarningVisible(false);
    setTimeLeft(0);

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set warning timer (4 minutes)
    warningTimeoutRef.current = setTimeout(() => {
      setIsWarningVisible(true);
      setTimeLeft(60); // 60 seconds warning
      
      // Start countdown
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIME);

    // Set logout timer (5 minutes)
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      // Clear all timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local storage
      localStorage.removeItem('isAuthenticated');
      sessionStorage.clear();
      
      // Reload page to ensure clean state
      window.location.href = '/NUeats-Canteen/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Force reload even if logout fails
      window.location.href = '/NUeats-Canteen/';
    }
  }, []);

  // Extend session (called when user dismisses warning)
  const extendSession = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  // Activity detection
  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = () => {
      if (isActive) {
        resetTimers();
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer setup
    resetTimers();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, resetTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isWarningVisible,
    timeLeft,
    extendSession,
    handleLogout
  };
};
