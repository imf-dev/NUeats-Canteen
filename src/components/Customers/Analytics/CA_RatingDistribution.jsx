import React from "react";
import { FaStar } from "react-icons/fa";
import { ordersData } from "../../../demodata/ordersDemoData";
import "./CA_RatingDistribution.css";

const CA_RatingDistribution = () => {
  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    ordersData.forEach((order) => {
      if (order.rating) {
        distribution[order.rating]++;
      }
    });

    return distribution;
  };

  // Calculate average rating
  const getAverageRating = () => {
    const ratings = ordersData
      .filter((order) => order.rating)
      .map((order) => order.rating);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();
  const totalRatings = Object.values(distribution).reduce(
    (sum, count) => sum + count,
    0
  );
  const maxCount = Math.max(...Object.values(distribution));

  // Calculate percentage for progress bars
  const getBarWidth = (count) => {
    if (maxCount === 0) return 0;
    return (count / maxCount) * 100;
  };

  return (
    <div className="ca-rating-distribution-section">
      <div className="ca-rating-distribution-section-header">
        <h3>Customer Rating Distribution</h3>
        <p>Breakdown of all customer ratings</p>
      </div>

      <div className="ca-rating-distribution-content">
        <div className="ca-rating-distribution-bars">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className="ca-rating-distribution-row"
              style={{ animationDelay: `${(5 - rating) * 0.1}s` }}
            >
              <div className="ca-rating-distribution-stars">
                <FaStar className="ca-rating-distribution-star-icon" />
                <span className="ca-rating-distribution-number">
                  {rating} Star
                </span>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }}></div>

              <div className="ca-rating-distribution-progress-container">
                <div
                  className="ca-rating-distribution-progress-bar"
                  style={{
                    "--target-width": `${getBarWidth(distribution[rating])}%`,
                    animationDelay: `${(5 - rating) * 0.2}s`,
                  }}
                />
              </div>
              <div className="ca-rating-distribution-count">
                {distribution[rating]}
              </div>
            </div>
          ))}
        </div>

        <div className="ca-rating-distribution-average">
          <div className="ca-rating-distribution-average-number">
            {averageRating}
          </div>
          <div className="ca-rating-distribution-average-label">
            Average Rating
          </div>
        </div>
      </div>
    </div>
  );
};

export default CA_RatingDistribution;
