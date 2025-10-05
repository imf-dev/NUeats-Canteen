import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { fetchUserRole, clearRoleCache } from "../lib/profileService";
import LoadingScreen from "./common/LoadingScreen";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      setIsChecking(true);
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      const session = data.session;
      const authed = !!session;
      setIsAuthenticated(authed);
      if (authed) {
        const userId = session.user.id;
        try {
          console.log("🔍 Fetching role for user:", userId);
          const role = await fetchUserRole(userId);
          console.log("👤 User role:", role);
          setIsAdmin(role === "admin");
        } catch (err) {
          console.error("❌ Profile fetch error in checkSession:", err);
          console.error("❌ Error details:", err.message, err.code);
          
          // If we're authenticated but can't fetch role, stay on current page
          // Don't assume non-admin - this prevents losing access on reload
          console.log("⚠️ Role fetch failed, keeping previous admin state");
          // setIsAdmin(false); // Commented out - don't change admin state on error
        }
      } else {
        setIsAdmin(false);
      }
      setIsChecking(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      setIsChecking(true);
      const authed = !!session;
      setIsAuthenticated(authed);
      if (authed) {
        const userId = session.user.id;
        try {
          console.log("🔄 Auth state change - fetching role for user:", userId);
          const role = await fetchUserRole(userId);
          console.log("👤 Auth state change - user role:", role);
          setIsAdmin(role === "admin");
        } catch (err) {
          console.error("❌ Profile fetch error in auth state change:", err);
          console.error("❌ Error details:", err.message, err.code);
          
          // Only clear admin state if this is a fresh login (no previous admin state)
          // This prevents losing admin status on connection issues
          console.log("⚠️ Role fetch failed during auth state change");
          // setIsAdmin(false); // Commented out - preserve admin state on errors
        }
      } else {
        setIsAdmin(false);
        clearRoleCache(); // Clear cache when user signs out
      }
      if (!isMounted) return;
      setIsChecking(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isChecking) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !isAdmin) {
    // Avoid navigating to the same route repeatedly
    if (location.pathname !== "/NUeats-Canteen/") {
      return <Navigate to="/NUeats-Canteen/" replace />;
    }
    return null;
  }
  return children;
};

export default ProtectedRoute;
