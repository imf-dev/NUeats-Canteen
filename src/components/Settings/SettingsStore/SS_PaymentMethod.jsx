import React, { useState } from "react";
import { FiSave, FiCreditCard } from "react-icons/fi";
import "./SS_PaymentMethod.css";

const SS_PaymentMethod = ({
  paymentMethods,
  onSave,
  onPaymentMethodChange,
  isSaving,
}) => {
  const [originalData, setOriginalData] = useState({ ...paymentMethods });

  const handleSave = () => {
    if (JSON.stringify(paymentMethods) === JSON.stringify(originalData)) {
      onSave(false, "No changes detected", "info");
      return;
    }

    // Save successful
    setOriginalData({ ...paymentMethods });
    onSave(true, "Payment methods saved successfully!", "success");
  };

  return (
    <div className="ss-payment-method_card ss-payment-method_payment-methods-card">
      <div className="ss-payment-method_card-header">
        <div className="ss-payment-method_card-title">
          <FiCreditCard className="ss-payment-method_card-icon" />
          <div>
            <h3>Payment Methods</h3>
            <p>Configure which payment methods are accepted at your canteen</p>
          </div>
        </div>
      </div>

      <div className="ss-payment-method_payment-options">
        <div className="ss-payment-method_payment-option">
          <label className="ss-payment-method_checkbox-label">
            <input
              type="checkbox"
              checked={paymentMethods.cashPayment}
              onChange={(e) =>
                onPaymentMethodChange("cashPayment", e.target.checked)
              }
            />
            <span className="ss-payment-method_checkmark"></span>
            <span className="ss-payment-method_payment-name">Cash Payment</span>
          </label>
        </div>
        <div className="ss-payment-method_payment-option">
          <label className="ss-payment-method_checkbox-label">
            <input
              type="checkbox"
              checked={paymentMethods.payMongo}
              onChange={(e) =>
                onPaymentMethodChange("payMongo", e.target.checked)
              }
            />
            <span className="ss-payment-method_checkmark"></span>
            <span className="ss-payment-method_payment-name">PayMongo</span>
          </label>
        </div>
        <div className="ss-payment-method_payment-option">
          <label className="ss-payment-method_checkbox-label">
            <input
              type="checkbox"
              checked={paymentMethods.creditDebitCard}
              onChange={(e) =>
                onPaymentMethodChange("creditDebitCard", e.target.checked)
              }
            />
            <span className="ss-payment-method_checkmark"></span>
            <span className="ss-payment-method_payment-name">
              Credit/Debit Card
            </span>
          </label>
        </div>
      </div>

      <div className="ss-payment-method_card-actions">
        <button 
          className="ss-payment-method_save-btn" 
          onClick={handleSave}
          disabled={isSaving}
        >
          <FiSave />
          {isSaving ? "Saving..." : "Save Payment Methods"}
        </button>
      </div>
    </div>
  );
};

export default SS_PaymentMethod;
