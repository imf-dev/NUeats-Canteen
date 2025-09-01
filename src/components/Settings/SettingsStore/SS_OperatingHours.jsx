import React, { useState } from "react";
import { FiSave, FiClock } from "react-icons/fi";
import "./SS_OperatingHours.css";

const SS_OperatingHours = ({
  operatingHours,
  onSave,
  onOperatingHourChange,
}) => {
  const [originalData, setOriginalData] = useState({ ...operatingHours });

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      const time12 = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      const time24 = `${hour.toString().padStart(2, "0")}:00`;
      times.push({ value: time24, label: time12 });
    }
    return times;
  };

  const handleSave = () => {
    if (JSON.stringify(operatingHours) === JSON.stringify(originalData)) {
      onSave(false, "No changes detected", "info");
      return;
    }

    // Save successful
    setOriginalData({ ...operatingHours });
    onSave(true, "Operating hours saved successfully!", "success");
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="ss-operating-hours_card ss-operating-hours_operating-hours-card">
      <div className="ss-operating-hours_card-header">
        <div className="ss-operating-hours_card-title">
          <FiClock className="ss-operating-hours_card-icon" />
          <div>
            <h3>Operating Hours</h3>
            <p>Set the canteen's operating hours for each day of the week</p>
          </div>
        </div>
      </div>

      <div className="ss-operating-hours_hours-list">
        {Object.entries(operatingHours).map(([day, hours]) => (
          <div key={day} className="ss-operating-hours_hour-row">
            <div className="ss-operating-hours_day-name">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </div>
            <div className="ss-operating-hours_hour-controls">
              <label className="ss-operating-hours_toggle-switch">
                <input
                  type="checkbox"
                  checked={hours.open}
                  onChange={(e) =>
                    onOperatingHourChange(day, "open", e.target.checked)
                  }
                />
                <span className="ss-operating-hours_slider"></span>
              </label>
              <span className="ss-operating-hours_status">
                {hours.open ? "Open" : "Closed"}
              </span>
              {hours.open && (
                <>
                  <select
                    value={hours.openTime}
                    onChange={(e) =>
                      onOperatingHourChange(day, "openTime", e.target.value)
                    }
                    className="ss-operating-hours_time-select"
                  >
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                  <span className="ss-operating-hours_to">to</span>
                  <select
                    value={hours.closeTime}
                    onChange={(e) =>
                      onOperatingHourChange(day, "closeTime", e.target.value)
                    }
                    className="ss-operating-hours_time-select"
                  >
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ss-operating-hours_card-actions">
        <button className="ss-operating-hours_save-btn" onClick={handleSave}>
          <FiSave />
          Save Operating Hours
        </button>
      </div>
    </div>
  );
};

export default SS_OperatingHours;
