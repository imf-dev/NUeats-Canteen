import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import allcustomersDemoData from "../../../demodata/allcustomersDemoData";
import "./CA_NewUsers.css";

const CA_NewUsers = () => {
  const [viewMode, setViewMode] = useState("currentWeek"); // "currentWeek" or "last7Days"

  // Get current week dates (Monday to Sunday of THIS week)
  const getCurrentWeekDates = () => {
    const today = new Date("2025-09-08"); // Monday 2am
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday

    // Calculate days to subtract to get to Monday
    const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Get last 7 days (rolling window)
  const getLast7Days = () => {
    const today = new Date("2025-09-08");
    const dates = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  // Get dates based on current view mode
  const getDateRange = () => {
    return viewMode === "currentWeek" ? getCurrentWeekDates() : getLast7Days();
  };

  // Filter customers who joined in the current date range
  const getNewCustomersInRange = () => {
    const dates = getDateRange();
    const startDate = new Date(dates[0]);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dates[dates.length - 1]);
    endDate.setHours(23, 59, 59, 999);

    const customers = allcustomersDemoData.filter((customer) => {
      const joinDate = new Date(customer.account_info.date_joined);
      return joinDate >= startDate && joinDate <= endDate;
    });

    console.log(
      `Date range: ${startDate.toDateString()} to ${endDate.toDateString()}`
    );
    console.log(`Found ${customers.length} customers in range:`, customers);

    return customers;
  };

  // Get customers who joined today
  const getNewCustomersToday = () => {
    const today = new Date("2025-09-08");
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    return allcustomersDemoData.filter((customer) => {
      const joinDate = new Date(customer.account_info.date_joined);
      return joinDate >= startOfToday && joinDate <= endOfToday;
    });
  };

  // Generate chart data
  const generateChartData = () => {
    const dates = getDateRange();

    // For current week, use day names. For last 7 days, use dates
    const getLabel = (date, index) => {
      if (viewMode === "currentWeek") {
        const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        return dayNames[index];
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    };

    return dates.map((date, index) => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const newUsersOnDay = allcustomersDemoData.filter((customer) => {
        const joinDate = new Date(customer.account_info.date_joined);
        return joinDate >= dayStart && joinDate <= dayEnd;
      }).length;

      return {
        day: getLabel(date, index),
        users: newUsersOnDay,
        date: date.toISOString().split("T")[0],
        fullDate: date.toDateString(),
      };
    });
  };

  const newCustomersInRange = getNewCustomersInRange();
  const newCustomersToday = getNewCustomersToday();
  const chartData = generateChartData();

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="ca-new-users-chart-tooltip">
          <p className="ca-new-users-tooltip-label">{`${label}`}</p>
          <p className="ca-new-users-tooltip-date">{data.fullDate}</p>
          <p className="ca-new-users-tooltip-value">{`New Users: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const getRangeDescription = () => {
    const dates = getDateRange();
    const start = dates[0].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const end = dates[dates.length - 1].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (viewMode === "currentWeek") {
      return `Current Week: ${start} - ${end}, 2025`;
    } else {
      return `Last 7 Days: ${start} - ${end}, 2025`;
    }
  };

  return (
    <div className="ca-new-users-section">
      <div className="ca-new-users-section-header">
        <h3>New Users/Customers</h3>
        <p>Track new users over time ({getRangeDescription()})</p>

        {/* View Mode Toggle */}
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => setViewMode("currentWeek")}
            style={{
              padding: "4px 12px",
              marginRight: "8px",
              backgroundColor:
                viewMode === "currentWeek" ? "#F59E0B" : "#f3f4f6",
              color: viewMode === "currentWeek" ? "white" : "#6b7280",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Current Week
          </button>
          <button
            onClick={() => setViewMode("last7Days")}
            style={{
              padding: "4px 12px",
              backgroundColor: viewMode === "last7Days" ? "#F59E0B" : "#f3f4f6",
              color: viewMode === "last7Days" ? "white" : "#6b7280",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Last 7 Days
          </button>
        </div>
      </div>

      <div className="ca-new-users-content">
        <div className="ca-new-users-stats-cards">
          <div className="ca-new-users-stat-card ca-new-users-total-users">
            <div className="ca-new-users-stat-number">
              {newCustomersInRange.length}
            </div>
            <div className="ca-new-users-stat-label">Total New Users</div>
            <div className="ca-new-users-stat-sublabel">
              {viewMode === "currentWeek" ? "This Week" : "Last 7 Days"}
            </div>
          </div>

          <div className="ca-new-users-stat-card ca-new-users-today-users">
            <div className="ca-new-users-stat-number">
              {newCustomersToday.length}
            </div>
            <div className="ca-new-users-stat-label">New Users Today</div>
            <div className="ca-new-users-stat-sublabel">Sept 8, 2025</div>
          </div>
        </div>

        <div className="ca-new-users-chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                domain={[0, "dataMax + 1"]}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#F59E0B", strokeWidth: 2 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Debug info */}
      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <details>
          <summary>Debug Info (click to expand)</summary>
          <div
            style={{
              marginTop: "8px",
              padding: "8px",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>Current Time:</strong> Monday, Sept 8, 2025 (2am)
            </p>
            <p>
              <strong>View Mode:</strong> {viewMode}
            </p>
            <p>
              <strong>Date Range:</strong> {getDateRange()[0].toDateString()} to{" "}
              {getDateRange()[6].toDateString()}
            </p>
            <p>
              <strong>New users found:</strong> {newCustomersInRange.length}
            </p>
            <div style={{ marginTop: "8px" }}>
              <strong>Users in range:</strong>
              <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                {newCustomersInRange.map((customer) => (
                  <li key={customer.customer_id}>
                    {customer.first_name} {customer.last_name} - Joined:{" "}
                    {new Date(customer.account_info.date_joined).toDateString()}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: "8px" }}>
              <strong>Chart Data:</strong>
              <pre style={{ fontSize: "10px", margin: "4px 0" }}>
                {JSON.stringify(chartData, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default CA_NewUsers;
