import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./D_WeeklyCard.css";

const DashboardWeeklyCard = ({ weeklyData }) => {
  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="dashboard_chart-tooltip">
          <div className="dashboard_tooltip-header">
            <h4>{label}</h4>
            <p>{data.date}</p>
          </div>
          <div className="dashboard_tooltip-content">
            <div className="dashboard_tooltip-item">
              <span className="dashboard_tooltip-color revenue"></span>
              <span>Revenue: ₱{data.revenue.toLocaleString()}</span>
            </div>
            <div className="dashboard_tooltip-item">
              <span className="dashboard_tooltip-color orders"></span>
              <span>Orders: {data.orders}</span>
            </div>
            <div className="dashboard_tooltip-item">
              <span>Avg Order Value: ₱{data.avgOrderValue}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard_chart-container">
      <div className="dashboard_chart-header">
        <h3>Weekly Sales Overview</h3>
        <p>Daily sales and order volume for this week</p>
      </div>

      <div className="dashboard_weekly-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#718096", fontSize: 12 }}
            />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#718096", fontSize: 12 }}
              tickFormatter={(value) => `₱${value / 1000}K`}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#718096", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Revenue Line */}
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: "#F59E0B",
                strokeWidth: 2,
                fill: "#FFF",
              }}
            />

            {/* Orders Line */}
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ fill: "#4F46E5", strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: "#4F46E5",
                strokeWidth: 2,
                fill: "#FFF",
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="dashboard_chart-legend">
          <div className="dashboard_legend-item">
            <span className="dashboard_legend-color revenue"></span>
            <span>Revenue</span>
          </div>
          <div className="dashboard_legend-item">
            <span className="dashboard_legend-color orders"></span>
            <span>Orders</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWeeklyCard;
