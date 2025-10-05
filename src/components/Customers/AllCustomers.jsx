import React, { useState, useMemo, useEffect } from "react";
import CAC_SearchFilters from "./AllCustomers/CAC_SearchFilters";
import CAC_CustomerList from "./AllCustomers/CAC_CustomerList";
import LoadingScreen from "../common/LoadingScreen";
import { getAllCustomers, setCustomerSuspended } from "../../lib/customersService";
import "./AllCustomers.css";

const AllCustomers = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter and search customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Apply status filter
    if (filterValue !== "all") {
      filtered = filtered.filter((customer) => customer.status === filterValue);
    }

    // Apply search filter
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      filtered = filtered.filter((customer) => {
        const fullName =
          `${customer.first_name} ${customer.last_name}`.toLowerCase();
        const email = customer.email.toLowerCase();
        const customerId = customer.customer_id.toLowerCase();

        return (
          fullName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          customerId.includes(searchTerm)
        );
      });
    }

    return filtered;
  }, [customers, searchValue, filterValue]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleCustomerClick = (customer) => {
    console.log("Customer clicked:", customer);
    // Handle customer click - navigate to customer details, open modal, etc.
  };

  const handleCustomerStatusUpdate = async (customerId, newStatus) => {
    try {
      const isSuspended = newStatus === "suspended";
      const { success } = await setCustomerSuspended(customerId, isSuspended);
      if (success) {
        // Update local state immediately for snappy UI
        setCustomers((prev) =>
          prev.map((c) =>
            c.customer_id === customerId
              ? { ...c, status: newStatus, is_suspended: isSuspended }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to update customer status:", err);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="ac-all-customers">
      <CAC_SearchFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchValue={searchValue}
        filterValue={filterValue}
      />

      <CAC_CustomerList
        customers={filteredCustomers}
        onCustomerClick={handleCustomerClick}
        onCustomerStatusUpdate={handleCustomerStatusUpdate}
      />
    </div>
  );
};

export default AllCustomers;
