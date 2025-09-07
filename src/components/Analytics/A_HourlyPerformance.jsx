// src/components/Analytics/A_HourlyPerformance.jsx
import React from "react";
import "./A_HourlyPerformance.css";

const A_HourlyPerformance = ({ hourlyData }) => {
  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  const formatTime = (hour) => {
    if (hour === 12) return "12 PM";
    if (hour === 0) return "12 AM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  return (
    <div className="hourly_analytics-card hourly_hourly-performance-card">
      <div className="hourly_card-header">
        <h3>Hourly Performance</h3>
        <p>Orders and revenue by hour today</p>
      </div>
      <div className="hourly_line-chart-container">
        <div className="hourly_line-chart">
          <svg
            width="100%"
            height="300"
            viewBox="0 0 500 300"
            className="hourly_line-chart-svg"
          >
            {/* Background gradient */}
            <defs>
              <linearGradient
                id="hourlyAreaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#667eea" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient
                id="hourlyLineGradient"
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
              fill="url(#hourlyAreaGradient)"
              className="hourly_area-fill"
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
              stroke="url(#hourlyLineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hourly_line-path"
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
                    className="hourly_data-point-glow"
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
                    className="hourly_data-point"
                    style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#667eea"
                    className="hourly_data-point-inner"
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
          <div className="hourly_chart-tooltips">
            {hourlyData.map((hour, i) => (
              <div
                key={hour.hour}
                className="hourly_chart-tooltip"
                style={{
                  left: `${16 + i * 7.6}%`,
                  top: `${17 + (1 - hour.orders / 40) * 67}%`,
                }}
              >
                <div className="hourly_tooltip-content">
                  <div className="hourly_tooltip-time">
                    {formatTime(hour.hour)}
                  </div>
                  <div className="hourly_tooltip-orders">
                    Orders: {hour.orders}
                  </div>
                  <div className="hourly_tooltip-revenue">
                    Revenue: {formatCurrency(hour.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default A_HourlyPerformance;
