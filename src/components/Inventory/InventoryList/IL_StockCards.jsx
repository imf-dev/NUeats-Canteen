import React from "react";
import "./IL_StockCards.css";
import { Edit3, Trash2, Package } from "lucide-react";

const IL_StockCards = ({
  filteredItems,
  getCategoryColor,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <div className="stockcards_items-list">
      {filteredItems.map((item) => (
        <div key={item.id} className="stockcards_item-card">
          <div className="stockcards_item-header">
            <div className="stockcards_item-main-info">
              <h3 className="stockcards_item-name">{item.name}</h3>
              <span
                className="stockcards_category-badge"
                style={{ backgroundColor: getCategoryColor(item.category) }}
              >
                {item.category}
              </span>
            </div>
            <div className="stockcards_item-actions">
              <button
                className="stockcards_action-btn stockcards_edit-btn"
                title="Edit"
                onClick={() => handleEditClick(item)}
              >
                <Edit3 size={16} />
              </button>
              <button
                className="stockcards_action-btn stockcards_delete-btn"
                title="Delete"
                onClick={() => handleDeleteClick(item)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="stockcards_item-details-grid">
            <div className="stockcards_detail-section">
              <div className="stockcards_detail-label">Current Stock</div>
              <div className="stockcards_detail-value current-stock">
                {item.currentStock} {item.unit}
              </div>
            </div>

            <div className="stockcards_detail-section">
              <div className="stockcards_detail-label">Min/Max</div>
              <div className="stockcards_detail-value">
                {item.minStock} / {item.maxStock} {item.unit}
              </div>
            </div>

            <div className="stockcards_detail-section">
              <div className="stockcards_detail-label">Cost per Unit</div>
              <div className="stockcards_detail-value price">
                ₱{item.costPerUnit}
              </div>
            </div>

            <div className="stockcards_detail-section">
              <div className="stockcards_detail-label">Supplier</div>
              <div className="stockcards_detail-value">{item.supplier}</div>
            </div>
          </div>
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="stockcards_no-results">
          <div className="stockcards_no-results-icon">
            <Package size={64} strokeWidth={1} />
          </div>
          <h3>No items found</h3>
          <p>Try adjusting your search terms or category filter</p>
        </div>
      )}
    </div>
  );
};

export default IL_StockCards;
