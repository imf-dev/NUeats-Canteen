import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getNewUsersData } from "../../../lib/customerAnalyticsService";
import "./CA_NewUsers.css";

const CA_NewUsers = () => {
  const [viewMode, setViewMode] = useState("currentWeek"); // "currentWeek" or "last7Days"

  const [stats, setStats] = useState({ total: 0, today: 0, chart: [] });

  useEffect(() => {
    const load = async () => {
      const { totalInRange, todayCount, chartData } = await getNewUsersData(viewMode);
      setStats({ total: totalInRange, today: todayCount, chart: chartData });
    };
    load();
  }, [viewMode]);

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
    if (!stats.chart.length) return viewMode === "currentWeek" ? "Current Week" : "Last 7 Days";
    const first = stats.chart[0];
    const last = stats.chart[stats.chart.length - 1];
    const start = new Date(first.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const end = new Date(last.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${viewMode === "currentWeek" ? "Current Week" : "Last 7 Days"}: ${start} - ${end}`;
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
            <div className="ca-new-users-stat-number">{stats.total}</div>
            <div className="ca-new-users-stat-label">Total New Users</div>
            <div className="ca-new-users-stat-sublabel">
              {viewMode === "currentWeek" ? "This Week" : "Last 7 Days"}
            </div>
          </div>

          <div className="ca-new-users-stat-card ca-new-users-today-users">
            <div className="ca-new-users-stat-number">{stats.today}</div>
            <div className="ca-new-users-stat-label">New Users Today</div>
            <div className="ca-new-users-stat-sublabel">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="ca-new-users-chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={stats.chart}
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

      {/* Debug info removed */}
    </div>
  );
};

export default CA_NewUsers;
