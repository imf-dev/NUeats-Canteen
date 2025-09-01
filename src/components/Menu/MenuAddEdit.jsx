import React, { useState, useEffect, useRef } from "react";
import "./MenuAddEdit.css";

const MenuAddEdit = ({
  isOpen,
  onClose,
  mode, // 'add' or 'edit'
  itemToEdit,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fileInputRef = useRef(null);
  const originalDataRef = useRef({});

  const categories = ["Meals", "Snacks", "Beverages", "Desserts"];

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && itemToEdit) {
        const editData = {
          name: itemToEdit.name,
          description: itemToEdit.description,
          price: itemToEdit.price.toString(),
          category: itemToEdit.category,
          image: null,
          imagePreview: itemToEdit.image,
        };
        setFormData(editData);
        originalDataRef.current = editData;
      } else {
        const emptyData = {
          name: "",
          description: "",
          price: "",
          category: "",
          image: null,
          imagePreview: null,
        };
        setFormData(emptyData);
        originalDataRef.current = emptyData;
      }
      setErrors({});
      setHasChanges(false);
    }
  }, [isOpen, mode, itemToEdit]);

  // Check for changes
  useEffect(() => {
    if (mode === "edit") {
      const hasChanged =
        formData.name !== originalDataRef.current.name ||
        formData.description !== originalDataRef.current.description ||
        formData.price !== originalDataRef.current.price ||
        formData.category !== originalDataRef.current.category ||
        formData.image !== null;
      setHasChanges(hasChanged);
    }
  }, [formData, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file (JPG or PNG only)",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Menu item name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (mode === "add" && !formData.image) {
      newErrors.image = "Please select an image for the menu item";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (mode === "add") {
      setConfirmationMessage(
        `Are you sure you want to add "${formData.name}" to the menu?`
      );
    } else {
      if (!hasChanges) {
        setErrors({ general: "No changes detected" });
        return;
      }
      setConfirmationMessage(
        `Are you sure you want to update "${formData.name}"?`
      );
    }

    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setShowConfirmation(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const menuItemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.imagePreview, // In real app, this would be uploaded to server
        isAvailable: mode === "add" ? true : itemToEdit.isAvailable,
      };

      if (mode === "edit") {
        menuItemData.id = itemToEdit.id;
      }

      onSave(menuItemData, mode);
      handleClose();
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      imagePreview: null,
    });
    setErrors({});
    setShowConfirmation(false);
    setIsLoading(false);
    setHasChanges(false);
    onClose();
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`menuaddedit_modal-overlay ${isOpen ? "open" : ""}`}>
        <div className="menuaddedit_modal-container">
          <div className="menuaddedit_modal-header">
            <div>
              <h2 className="menuaddedit_modal-title">
                {mode === "add" ? "Add New Menu Item" : "Edit Menu Item"}
              </h2>
              <p className="menuaddedit_modal-subtitle">
                Fill in the details for the menu item
              </p>
            </div>
            <button className="menuaddedit_close-btn" onClick={handleClose}>
              ×
            </button>
          </div>

          <div className="menuaddedit_modal-body">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="menuaddedit_form-row">
                <div className="menuaddedit_form-group">
                  <label htmlFor="name" className="menuaddedit_form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Menu item name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`menuaddedit_form-input ${
                      errors.name ? "error" : ""
                    }`}
                  />
                  {errors.name && (
                    <div
                      className={`menuaddedit_error-message ${
                        errors.name ? "show" : ""
                      }`}
                    >
                      ⚠ {errors.name}
                    </div>
                  )}
                </div>

                <div className="menuaddedit_form-group">
                  <label htmlFor="price" className="menuaddedit_form-label">
                    Price (₱)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`menuaddedit_form-input ${
                      errors.price ? "error" : ""
                    }`}
                  />
                  {errors.price && (
                    <div
                      className={`menuaddedit_error-message ${
                        errors.price ? "show" : ""
                      }`}
                    >
                      ⚠ {errors.price}
                    </div>
                  )}
                </div>
              </div>

              <div className="menuaddedit_form-group">
                <label htmlFor="description" className="menuaddedit_form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description of the menu item"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`menuaddedit_form-textarea ${
                    errors.description ? "error" : ""
                  }`}
                  rows={4}
                />
                {errors.description && (
                  <div
                    className={`menuaddedit_error-message ${
                      errors.description ? "show" : ""
                    }`}
                  >
                    ⚠ {errors.description}
                  </div>
                )}
              </div>

              <div className="menuaddedit_form-row">
                <div className="menuaddedit_form-group">
                  <label htmlFor="category" className="menuaddedit_form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`menuaddedit_form-select ${
                      errors.category ? "error" : ""
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div
                      className={`menuaddedit_error-message ${
                        errors.category ? "show" : ""
                      }`}
                    >
                      ⚠ {errors.category}
                    </div>
                  )}
                </div>

                <div className="menuaddedit_form-group">
                  <label className="menuaddedit_form-label">Image</label>
                  <div
                    className={`menuaddedit_image-upload ${
                      errors.image ? "error" : ""
                    } ${formData.imagePreview ? "has-image" : ""}`}
                    onClick={handleImageUploadClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageChange}
                      className="menuaddedit_image-upload-input"
                    />

                    {formData.imagePreview ? (
                      <>
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="menuaddedit_image-preview"
                        />
                        <div className="menuaddedit_upload-text">
                          Click to change image
                        </div>
                        {formData.image && (
                          <div className="menuaddedit_image-name">
                            {formData.image.name}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="menuaddedit_upload-text">
                          Select image to upload
                        </div>
                        <div className="menuaddedit_upload-subtext">
                          JPG or PNG only
                        </div>
                      </>
                    )}
                  </div>
                  {errors.image && (
                    <div
                      className={`menuaddedit_error-message ${
                        errors.image ? "show" : ""
                      }`}
                    >
                      ⚠ {errors.image}
                    </div>
                  )}
                </div>
              </div>

              {errors.general && (
                <div
                  className={`menuaddedit_error-message ${
                    errors.general ? "show" : ""
                  }`}
                  style={{ marginTop: "16px" }}
                >
                  ⚠ {errors.general}
                </div>
              )}

              <div className="menuaddedit_modal-actions">
                <button
                  type="button"
                  className="menuaddedit_modal-btn menuaddedit_cancel-btn"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="menuaddedit_modal-btn menuaddedit_primary-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="menuaddedit_loading">
                      <span className="menuaddedit_spinner"></span>
                      {mode === "add" ? "Adding..." : "Updating..."}
                    </span>
                  ) : mode === "add" ? (
                    "Add Item"
                  ) : (
                    "Update Item"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div
        className={`menuaddedit_confirmation-overlay ${
          showConfirmation ? "open" : ""
        }`}
      >
        <div className="menuaddedit_confirmation-modal">
          <h3 className="menuaddedit_confirmation-title">Confirm Action</h3>
          <p className="menuaddedit_confirmation-message">
            {confirmationMessage}
          </p>
          <div className="menuaddedit_confirmation-actions">
            <button
              className="menuaddedit_confirmation-btn menuaddedit_confirm-cancel"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </button>
            <button
              className="menuaddedit_confirmation-btn menuaddedit_confirm-ok"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuAddEdit;
