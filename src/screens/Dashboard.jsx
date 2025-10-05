import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScrollUpButton from "../components/common/ScrollUpButton";
import { getDashboardData, updateOrderStatus } from "../lib/dashboardService";

import DashboardSummaryCards from "../components/Dashboard/D_SummaryCards";
import DashboardWeeklyCard from "../components/Dashboard/D_WeeklyCard";
import DashboardTopSellingCard from "../components/Dashboard/D_TopSellingCard";
import DashboardCurrentOrders from "../components/Dashboard/D_CurrentOrders";
import LoadingScreen from "../components/common/LoadingScreen";

import "../styles/Dashboard.css";

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = { type: "tween", duration: 0.5 };

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    statsCards: [],
    weeklyData: [],
    topSellingItems: [],
    currentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setIsUpdating(true);
    
    try {
      // Capitalize first letter to match database format
      const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      
      // Optimistically update the UI first
      setDashboardData((prevData) => {
        // If order reaches "Completed" or "Cancelled", remove it from current orders
        if (formattedStatus === "Completed" || formattedStatus === "Cancelled") {
          return {
            ...prevData,
            currentOrders: prevData.currentOrders.filter(
              (order) => order.id !== orderId
            ),
            statsCards: prevData.statsCards.map((card) => {
              if (card.id === "active-orders") {
                const newValue = parseInt(card.value) - 1;
                return {
                  ...card,
                  value: newValue.toString(),
                  subtitle: card.subtitle.replace(/\d+/, (prevData.currentOrders.filter(o => o.status === 'pending').length - (newStatus === 'pending' ? 1 : 0))),
                };
              }
              if (card.id === "completed-orders" && formattedStatus === "Completed") {
                return {
                  ...card,
                  value: (parseInt(card.value) + 1).toString(),
                };
              }
              return card;
            }),
          };
        } else {
          // Just update the status of the order
          return {
            ...prevData,
            currentOrders: prevData.currentOrders.map((order) =>
              order.id === orderId
                ? { ...order, status: newStatus }
                : order
            ),
          };
        }
      });

      // Update the backend
      const result = await updateOrderStatus(orderId, formattedStatus);
      
      if (result.success) {
        // Silently refresh data in the background to sync with server
        await fetchDashboardData(false);
      } else {
        console.error("Failed to update order status:", result.error);
        alert("Failed to update order status. Please try again.");
        // Revert by fetching fresh data
        await fetchDashboardData(false);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred while updating the order status.");
      // Revert by fetching fresh data
      await fetchDashboardData(false);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      className="dashboard_layout"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <main className="dashboard_main">
        <div className="dashboard_header">
          <h1>Dashboard</h1>
          <p>Here's what's happening today</p>
        </div>

        <DashboardSummaryCards statsCards={dashboardData.statsCards} />

        <div className="dashboard_charts-section">
          <DashboardWeeklyCard weeklyData={dashboardData.weeklyData} />
          <DashboardTopSellingCard
            topSellingItems={dashboardData.topSellingItems}
          />
        </div>
        <DashboardCurrentOrders 
          currentOrders={dashboardData.currentOrders}
          onOrderStatusChange={handleOrderStatusChange}
        />
      </main>
      <ScrollUpButton />
    </motion.div>
  );
};

export default Dashboard;
