import React, { useState, useMemo, useEffect } from "react";
import CC_ComplaintFilters from "./Complaints/CC_ComplaintFilters";
import CC_ComplaintCards from "./Complaints/CC_ComplaintCards";
import { getAllComplaints, getResponsesForComplaints, updateComplaintStatus, createComplaintResponse } from "../../lib/complaintsService";
import { getAllCustomers } from "../../lib/customersService";
import "./Complaints.css";

const Complaints = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [complaints, setComplaints] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cData, custData] = await Promise.all([
          getAllComplaints(),
          getAllCustomers(),
        ]);
        // Fetch responses for these complaints
        const idList = cData.map((c) => c.complaint_id);
        const responsesMap = await getResponsesForComplaints(idList);

        // Attach responses to complaints for UI compatibility
        const enriched = cData.map((c) => ({
          ...c,
          admin_responses: responsesMap[c.complaint_id] || [],
        }));

        setComplaints(enriched);
        setCustomers(custData);
      } catch (err) {
        console.error("Failed to load complaints/customers:", err);
      }
    };
    load();
  }, []);

  // Filter complaints based on selected filters
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const statusMatch =
        statusFilter === "all" || complaint.status === statusFilter;
      const categoryMatch =
        categoryFilter === "all" || complaint.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [complaints, statusFilter, categoryFilter]);

  const handleOpenComplaint = async (complaintId) => {
    try {
      const { success } = await updateComplaintStatus(complaintId, "Open");
      if (success) {
        setComplaints((prev) =>
          prev.map((c) => (c.complaint_id === complaintId ? { ...c, status: "Open" } : c))
        );
      }
    } catch (err) {
      console.error("Failed to open complaint:", err);
    }
  };

  const handleSubmitResponse = async ({ complaintId, responseText }) => {
    const result = await createComplaintResponse(complaintId, responseText);
    if (result.success) {
      const newResp = result.response;
      
      // Update complaint status to "Resolved" when admin responds
      const statusResult = await updateComplaintStatus(complaintId, "Resolved");
      
      if (statusResult.success) {
        // Add response to UI and update status to Resolved
        setComplaints((prev) =>
          prev.map((c) =>
            c.complaint_id === complaintId
              ? { 
                  ...c, 
                  admin_responses: [newResp, ...(c.admin_responses || [])],
                  status: "Resolved",
                  resolved_at: new Date().toISOString()
                }
              : c
          )
        );
      } else {
        // If status update failed, still add the response but show error
        console.error("Failed to update complaint status:", statusResult.error);
        setComplaints((prev) =>
          prev.map((c) =>
            c.complaint_id === complaintId
              ? { ...c, admin_responses: [newResp, ...(c.admin_responses || [])] }
              : c
          )
        );
        throw new Error("Response added but failed to mark as resolved");
      }
    } else {
      throw result.error || new Error("Failed to send response");
    }
  };

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
        customers={customers}
        onOpenComplaint={handleOpenComplaint}
        onResponseSubmit={handleSubmitResponse}
      />
    </div>
  );
};

export default Complaints;
