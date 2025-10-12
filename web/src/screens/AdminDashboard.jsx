import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // API call to get admin dashboard data
        console.log('Fetching admin dashboard data...');
        // Simulate data loading
        setDashboardData({
          totalUsers: 1250,
          totalOrders: 3400,
          revenue: 45600,
          activeUsers: 89
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{dashboardData.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{dashboardData.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>${dashboardData.revenue}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{dashboardData.activeUsers}</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="action-btn">Manage Users</button>
          <button className="action-btn">View Reports</button>
          <button className="action-btn">System Settings</button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;