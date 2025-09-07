import React, { useState, useEffect } from "react";
import { MdClose, MdSave, MdCancel, MdAdd } from "react-icons/md";
import "./IL_EditModal.css";
import { categories } from "../../../demodata/inventoryDemoData";

const Inventory_EditModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  isAddMode = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    unit: "",
    costPerUnit: "",
    supplier: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data based on mode (add or edit)
  useEffect(() => {
    if (isOpen) {
      if (isAddMode || !item) {
        // Reset form for new item
        const emptyData = {
          name: "",
          category: "",
          currentStock: "",
          minStock: "",
          maxStock: "",
          unit: "",
          costPerUnit: "",
          supplier: "",
        };
        setFormData(emptyData);
        setOriginalData(emptyData);
      } else {
        // Populate form for editing existing item
        const itemData = {
          name: item.name || "",
          category: item.category || "",
          currentStock: item.currentStock?.toString() || "",
          minStock: item.minStock?.toString() || "",
          maxStock: item.maxStock?.toString() || "",
          unit: item.unit || "",
          costPerUnit: item.costPerUnit?.toString() || "",
          supplier: item.supplier || "",
        };
        setFormData(itemData);
        setOriginalData(itemData);
      }
      setErrors({});
    }
  }, [item, isOpen, isAddMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateFields = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Item name must be at least 2 characters long";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.currentStock) {
      newErrors.currentStock = "Current stock is required";
    } else if (
      isNaN(formData.currentStock) ||
      parseFloat(formData.currentStock) < 0
    ) {
      newErrors.currentStock =
        "Current stock must be a valid number (0 or greater)";
    }

    if (!formData.minStock) {
      newErrors.minStock = "Minimum stock is required";
    } else if (isNaN(formData.minStock) || parseFloat(formData.minStock) < 0) {
      newErrors.minStock =
        "Minimum stock must be a valid number (0 or greater)";
    }

    if (!formData.maxStock) {
      newErrors.maxStock = "Maximum stock is required";
    } else if (isNaN(formData.maxStock) || parseFloat(formData.maxStock) < 0) {
      newErrors.maxStock =
        "Maximum stock must be a valid number (0 or greater)";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (!formData.costPerUnit) {
      newErrors.costPerUnit = "Cost per unit is required";
    } else if (
      isNaN(formData.costPerUnit) ||
      parseFloat(formData.costPerUnit) < 0
    ) {
      newErrors.costPerUnit =
        "Cost per unit must be a valid number (0 or greater)";
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = "Supplier is required";
    } else if (formData.supplier.trim().length < 2) {
      newErrors.supplier = "Supplier name must be at least 2 characters long";
    }

    // Additional validations
    if (
      formData.minStock &&
      formData.maxStock &&
      !isNaN(formData.minStock) &&
      !isNaN(formData.maxStock) &&
      parseFloat(formData.minStock) >= parseFloat(formData.maxStock)
    ) {
      newErrors.maxStock = "Maximum stock must be greater than minimum stock";
    }

    // Check if current stock is reasonable compared to min/max
    if (
      formData.currentStock &&
      formData.maxStock &&
      !isNaN(formData.currentStock) &&
      !isNaN(formData.maxStock) &&
      parseFloat(formData.currentStock) > parseFloat(formData.maxStock)
    ) {
      newErrors.currentStock = "Current stock cannot exceed maximum stock";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    if (isAddMode) {
      // In add mode, check if any field has been filled
      return Object.keys(formData).some((key) => formData[key].trim() !== "");
    }
    // In edit mode, check if any field has been changed
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
  };

  const handleSave = () => {
    if (!validateFields()) return;

    if (isAddMode) {
      // In add mode, always show confirmation if fields are filled
      if (hasChanges()) {
        setShowConfirmation(true);
      } else {
        // No data entered, just close
        onClose();
      }
    } else {
      // In edit mode, show confirmation only if there are changes
      if (!hasChanges()) {
        onClose();
        return;
      }
      setShowConfirmation(true);
    }
  };

  const confirmSave = () => {
    if (isAddMode) {
      // Create new item
      const newItem = {
        id: Date.now(), // Generate temporary ID (you might want to use a proper ID generation method)
        name: formData.name.trim(),
        category: formData.category,
        currentStock: parseInt(formData.currentStock),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock),
        unit: formData.unit.trim(),
        costPerUnit: parseFloat(formData.costPerUnit),
        supplier: formData.supplier.trim(),
        dateAdded: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      onSave(newItem);
    } else {
      // Update existing item
      const updatedItem = {
        ...item,
        name: formData.name.trim(),
        category: formData.category,
        currentStock: parseInt(formData.currentStock),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock),
        unit: formData.unit.trim(),
        costPerUnit: parseFloat(formData.costPerUnit),
        supplier: formData.supplier.trim(),
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      onSave(updatedItem);
    }

    setShowConfirmation(false);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges()) {
      const message = isAddMode
        ? "You have unsaved data. Are you sure you want to close without adding this item?"
        : "You have unsaved changes. Are you sure you want to close?";

      if (window.confirm(message)) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`inventory-edit-modal-overlay ${isOpen ? "show" : ""}`}
        onClick={handleOverlayClick}
      >
        <div className="inventory-edit-modal">
          <div className="inventory-edit-modal-header">
            <div>
              <h2>
                {isAddMode ? "Add New Inventory Item" : "Edit Inventory Item"}
              </h2>
              <p>
                {isAddMode
                  ? "Enter the details for the new inventory item"
                  : "Update the details for this inventory item"}
              </p>
            </div>
            <button
              className="inventory-edit-modal-close"
              onClick={handleClose}
            >
              <MdClose size={24} />
            </button>
          </div>

          <div className="inventory-edit-modal-content">
            <div className="inventory-edit-form-row two-columns">
              <div className="inventory-edit-form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "error" : ""}
                  placeholder="Enter item name"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="inventory-edit-form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={errors.category ? "error" : ""}
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((cat) => cat !== "All Categories")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <span className="error-message">{errors.category}</span>
                )}
              </div>
            </div>

            <div className="inventory-edit-form-row two-columns">
              <div className="inventory-edit-form-group">
                <label>Current Stock *</label>
                <input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) =>
                    handleInputChange("currentStock", e.target.value)
                  }
                  className={errors.currentStock ? "error" : ""}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                {errors.currentStock && (
                  <span className="error-message">{errors.currentStock}</span>
                )}
              </div>

              <div className="inventory-edit-form-group">
                <label>Minimum Stock *</label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) =>
                    handleInputChange("minStock", e.target.value)
                  }
                  className={errors.minStock ? "error" : ""}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                {errors.minStock && (
                  <span className="error-message">{errors.minStock}</span>
                )}
              </div>
            </div>

            <div className="inventory-edit-form-row">
              <div className="inventory-edit-form-group">
                <label>Maximum Stock *</label>
                <input
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) =>
                    handleInputChange("maxStock", e.target.value)
                  }
                  className={errors.maxStock ? "error" : ""}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                {errors.maxStock && (
                  <span className="error-message">{errors.maxStock}</span>
                )}
              </div>
            </div>

            <div className="inventory-edit-form-row two-columns">
              <div className="inventory-edit-form-group">
                <label>Unit *</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className={errors.unit ? "error" : ""}
                  placeholder="kg, L, pcs, etc."
                />
                {errors.unit && (
                  <span className="error-message">{errors.unit}</span>
                )}
              </div>

              <div className="inventory-edit-form-group">
                <label>Cost per Unit (₱) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPerUnit}
                  onChange={(e) =>
                    handleInputChange("costPerUnit", e.target.value)
                  }
                  className={errors.costPerUnit ? "error" : ""}
                  placeholder="0.00"
                  min="0"
                />
                {errors.costPerUnit && (
                  <span className="error-message">{errors.costPerUnit}</span>
                )}
              </div>
            </div>

            <div className="inventory-edit-form-group full-width">
              <label>Supplier *</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                className={errors.supplier ? "error" : ""}
                placeholder="Enter supplier name"
              />
              {errors.supplier && (
                <span className="error-message">{errors.supplier}</span>
              )}
            </div>
          </div>

          <div className="inventory-edit-modal-footer">
            <button className="inventory-edit-cancel-btn" onClick={handleClose}>
              <MdCancel size={20} />
              Cancel
            </button>
            <button className="inventory-edit-save-btn" onClick={handleSave}>
              {isAddMode ? <MdAdd size={20} /> : <MdSave size={20} />}
              {isAddMode ? "Add Item" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className={`inventory-edit-confirmation-overlay show`}>
          <div className="inventory-edit-confirmation-modal">
            <h3>{isAddMode ? "Confirm Add Item" : "Confirm Changes"}</h3>
            <p>
              {isAddMode
                ? "Are you sure you want to add this new inventory item?"
                : "Are you sure you want to save the changes to this inventory item?"}
            </p>
            <div className="inventory-edit-confirmation-buttons">
              <button
                className="inventory-edit-confirmation-cancel"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="inventory-edit-confirmation-confirm"
                onClick={confirmSave}
              >
                {isAddMode ? "Yes, Add Item" : "Yes, Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory_EditModal;
