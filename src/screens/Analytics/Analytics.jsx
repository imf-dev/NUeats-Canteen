// src/components/Analytics.jsx
import React from "react";
import "./Analytics.css";
import {
  getTodaysAnalytics,
  getHourlyPerformance,
  getTopSellingItems,
} from "../../demodata/salesDemoData";
import {
  FiDollarSign,
  FiShoppingCart,
  FiClock,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const Analytics = () => {
  const analytics = getTodaysAnalytics();
  const popularItems = getTopSellingItems(5); // Get top 5 items from actual data
  const hourlyData = getHourlyPerformance();

  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  const formatTime = (hour) => {
    if (hour === 12) return "12 PM";
    if (hour === 0) return "12 AM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const maxRevenue = Math.max(...popularItems.map((item) => item.revenue));
  const maxOrders = Math.max(...hourlyData.map((h) => h.orders));

  return (
    <div className="analytics_analytics-container">
      <div className="analytics_analytics-header">
        <h1>Analytics & Reports</h1>
        <p>Track performance and insights</p>
      </div>

      {/* Top Stats Cards */}
      <div className="analytics_stats-grid">
        <div className="analytics_stat-card analytics_revenue-card">
          <div className="analytics_stat-icon">
            <FiDollarSign />
          </div>
          <div className="analytics_stat-content">
            <h3>Today's Revenue</h3>
            <div className="analytics_stat-value">
              {formatCurrency(analytics.revenue)}
            </div>
            <div
              className={`analytics_stat-change ${
                analytics.revenueGrowth >= 0
                  ? "analytics_positive"
                  : "analytics_negative"
              }`}
            >
              {analytics.revenueGrowth >= 0 ? (
                <FiTrendingUp />
              ) : (
                <FiTrendingDown />
              )}
              {analytics.revenueGrowth >= 0 ? "+" : ""}
              {analytics.revenueGrowth}% from yesterday
            </div>
          </div>
        </div>

        <div className="analytics_stat-card analytics_orders-card">
          <div className="analytics_stat-icon">
            <FiShoppingCart />
          </div>
          <div className="analytics_stat-content">
            <h3>Orders Today</h3>
            <div className="analytics_stat-value">{analytics.orders}</div>
            <div
              className={`analytics_stat-change ${
                analytics.ordersGrowth >= 0
                  ? "analytics_positive"
                  : "analytics_negative"
              }`}
            >
              {analytics.ordersGrowth >= 0 ? (
                <FiTrendingUp />
              ) : (
                <FiTrendingDown />
              )}
              {analytics.ordersGrowth >= 0 ? "+" : ""}
              {analytics.ordersGrowth}% from yesterday
            </div>
          </div>
        </div>

        <div className="analytics_stat-card analytics_completion-card">
          <div className="analytics_stat-icon">
            <FiClock />
          </div>
          <div className="analytics_stat-content">
            <h3>Completion Rate</h3>
            <div className="analytics_stat-value">
              {analytics.completionRate}%
            </div>
            <div className="analytics_stat-subtitle">
              Average order time: {analytics.avgOrderTime} min
            </div>
          </div>
        </div>

        <div className="analytics_stat-card analytics_customers-card">
          <div className="analytics_stat-icon">
            <FiUsers />
          </div>
          <div className="analytics_stat-content">
            <h3>Total Customers</h3>
            <div className="analytics_stat-value">
              {analytics.totalCustomers.toLocaleString()}
            </div>
            <div className="analytics_stat-subtitle">
              {analytics.newCustomersToday} new today
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="analytics_analytics-grid">
        {/* Popular Menu Items - Vertical Bar Chart */}
        <div className="analytics_analytics-card analytics_popular-items-card">
          <div className="analytics_card-header">
            <h3>Top Selling Items</h3>
            <p>Based on total units sold</p>
          </div>
          <div className="analytics_bar-chart-container">
            <div className="analytics_bar-chart">
              {popularItems.map((item, index) => {
                const barHeight =
                  (item.unitsSold / popularItems[0].unitsSold) * 200;

                return (
                  <div key={item.menuItemId} className="analytics_bar-item">
                    <div className="analytics_bar-wrapper">
                      <div
                        className="analytics_bar"
                        style={{ height: `${barHeight}px` }}
                        data-tooltip={JSON.stringify({
                          name: item.itemName,
                          units: item.unitsSold,
                          revenue: item.revenue,
                          rank: index + 1,
                        })}
                      >
                        <div className="analytics_bar-fill"></div>
                      </div>
                      {/* Hover tooltip */}
                      <div className="analytics_bar-tooltip">
                        <div className="analytics_tooltip-header">
                          #{index + 1} {item.itemName}
                        </div>
                        <div className="analytics_tooltip-stats">
                          <div>
                            Units Sold: <span>{item.unitsSold}</span>
                          </div>
                          <div>
                            Revenue: <span>{formatCurrency(item.revenue)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="analytics_bar-label">
                      <div className="analytics_bar-name">
                        {item.itemName.length > 12
                          ? item.itemName.substring(0, 10) + "..."
                          : item.itemName}
                      </div>
                      <div className="analytics_bar-units">
                        {item.unitsSold} sold
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hourly Performance - Enhanced Line Chart */}
        <div className="analytics_analytics-card analytics_hourly-performance-card">
          <div className="analytics_card-header">
            <h3>Hourly Performance</h3>
            <p>Orders and revenue by hour today</p>
          </div>
          <div className="analytics_line-chart-container">
            <div className="analytics_line-chart">
              <svg
                width="100%"
                height="300"
                viewBox="0 0 500 300"
                className="analytics_line-chart-svg"
              >
                {/* Background gradient */}
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                    <stop
                      offset="100%"
                      stopColor="#667eea"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="50%" stopColor="#764ba2" />
                    <stop offset="100%" stopColor="#667eea" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={i}
                    x1="60"
                    y1={50 + i * 40}
                    x2="450"
                    y2={50 + i * 40}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                ))}

                {/* Vertical grid lines */}
                {hourlyData.map((_, i) => (
                  <line
                    key={i}
                    x1={80 + i * 38}
                    y1="50"
                    x2={80 + i * 38}
                    y2="250"
                    stroke="#f8fafc"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}

                {/* Y-axis labels */}
                {[40, 32, 24, 16, 8, 0].map((value, i) => (
                  <text
                    key={i}
                    x="50"
                    y={55 + i * 40}
                    fontSize="11"
                    fill="#718096"
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {value}
                  </text>
                ))}

                {/* Area fill */}
                <path
                  d={`M 80 250 ${hourlyData
                    .map((hour, i) => {
                      const x = 80 + i * 38;
                      const y = 250 - (hour.orders / 40) * 200;
                      return `L ${x} ${y}`;
                    })
                    .join(" ")} L ${80 + (hourlyData.length - 1) * 38} 250 Z`}
                  fill="url(#areaGradient)"
                  className="analytics_area-fill"
                />

                {/* Main line path */}
                <path
                  d={hourlyData
                    .map((hour, i) => {
                      const x = 80 + i * 38;
                      const y = 250 - (hour.orders / 40) * 200;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="analytics_line-path"
                  filter="drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))"
                />

                {/* Data points */}
                {hourlyData.map((hour, i) => {
                  const x = 80 + i * 38;
                  const y = 250 - (hour.orders / 40) * 200;

                  return (
                    <g key={hour.hour}>
                      {/* Outer glow */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#667eea"
                        opacity="0.2"
                        className="analytics_data-point-glow"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                      {/* Main circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="white"
                        stroke="#667eea"
                        strokeWidth="3"
                        className="analytics_data-point"
                        style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                      />
                      {/* Inner dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#667eea"
                        className="analytics_data-point-inner"
                        style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                      />
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {hourlyData.map((hour, i) => (
                  <text
                    key={hour.hour}
                    x={80 + i * 38}
                    y="270"
                    fontSize="11"
                    fill="#718096"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {formatTime(hour.hour)}
                  </text>
                ))}

                {/* Y-axis title */}
                <text
                  x="25"
                  y="150"
                  fontSize="12"
                  fill="#718096"
                  textAnchor="middle"
                  transform="rotate(-90, 25, 150)"
                  fontWeight="600"
                >
                  Orders
                </text>

                {/* X-axis title */}
                <text
                  x="250"
                  y="295"
                  fontSize="12"
                  fill="#718096"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  Time of Day
                </text>
              </svg>

              {/* Interactive tooltips */}
              <div className="analytics_chart-tooltips">
                {hourlyData.map((hour, i) => (
                  <div
                    key={hour.hour}
                    className="analytics_chart-tooltip"
                    style={{
                      left: `${16 + i * 7.6}%`,
                      top: `${17 + (1 - hour.orders / 40) * 67}%`,
                    }}
                  >
                    <div className="analytics_tooltip-content">
                      <div className="analytics_tooltip-time">
                        {formatTime(hour.hour)}
                      </div>
                      <div className="analytics_tooltip-orders">
                        Orders: {hour.orders}
                      </div>
                      <div className="analytics_tooltip-revenue">
                        Revenue: {formatCurrency(hour.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
