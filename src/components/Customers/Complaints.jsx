import React, { useState, useMemo } from "react";
import CC_ComplaintFilters from "./Complaints/CC_ComplaintFilters";
import CC_ComplaintCards from "./Complaints/CC_ComplaintCards";
import complaintsDemoData from "../../demodata/complaintsDemoData";
import allcustomersDemoData from "../../demodata/allcustomersDemoData";
import "./Complaints.css";

const Complaints = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter complaints based on selected filters
  const filteredComplaints = useMemo(() => {
    return complaintsDemoData.filter((complaint) => {
      const statusMatch =
        statusFilter === "all" || complaint.status === statusFilter;
      const categoryMatch =
        categoryFilter === "all" || complaint.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [statusFilter, categoryFilter]);

  return (
    <div className="comp-complaints-container">
      <CC_ComplaintFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <CC_ComplaintCards
        complaints={filteredComplaints}
        customers={allcustomersDemoData}
      />
    </div>
  );
};

export default Complaints;
