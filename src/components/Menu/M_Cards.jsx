import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import "./M_Cards.css";

const M_Cards = ({ menuItems, onToggleAvailability, onEdit, onDelete }) => {
  return (
    <div className="mcards_items-grid">
      {menuItems.map((item) => (
        <div key={item.id} className="mcards_item-card">
          <div className="mcards_item-image-container">
            <img
              src={item.image}
              alt={item.name}
              className="mcards_item-image"
            />
            {!item.isAvailable && (
              <div className="mcards_unavailable-overlay">
                <span className="mcards_unavailable-badge">Unavailable</span>
              </div>
            )}
          </div>

          <div className="mcards_item-content">
            <div className="mcards_item-category">
              <span className="mcards_category-badge">{item.category}</span>
            </div>

            <h3 className="mcards_item-name">{item.name}</h3>
            <p className="mcards_item-description">{item.description}</p>

            <div className="mcards_item-footer">
              <span className="mcards_item-price">₱{item.price}</span>

              <div className="mcards_item-actions">
                <button
                  className={`mcards_availability-btn ${
                    item.isAvailable ? "mcards_disable" : "mcards_enable"
                  }`}
                  onClick={() => onToggleAvailability(item.id)}
                >
                  {item.isAvailable ? "Disable" : "Enable"}
                </button>

                <button
                  className="mcards_action-btn mcards_edit-btn"
                  onClick={() => onEdit(item.id)}
                >
                  <MdEdit />
                </button>

                <button
                  className="mcards_action-btn mcards_delete-btn"
                  onClick={() => onDelete(item.id)}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default M_Cards;
