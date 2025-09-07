import React, { useState, useMemo } from "react";
import CAC_SearchFilters from "./AllCustomers/CAC_SearchFilters";
import CAC_CustomerList from "./AllCustomers/CAC_CustomerList";
import allcustomersDemoData from "../../demodata/allcustomersDemoData";
import "./AllCustomers.css";

const AllCustomers = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Filter and search customers
  const filteredCustomers = useMemo(() => {
    let filtered = allcustomersDemoData;

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
  }, [searchValue, filterValue]);

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
      />
    </div>
  );
};

export default AllCustomers;
