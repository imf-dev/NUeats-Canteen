import React from "react";
import CA_NewUsers from "./Analytics/CA_NewUsers";
import CA_RatingDistribution from "./Analytics/CA_RatingDistribution";
import CA_CustomerFeedback from "./Analytics/CA_CustomerFeedback";
import "./CustomerAnalytics.css";

const CustomerAnalytics = () => {
  return (
    <div className="customer-analytics">
      <div className="analytics-container">
        <div className="analytics-single-column">
          <CA_NewUsers />
          <CA_RatingDistribution />
          <CA_CustomerFeedback />
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
