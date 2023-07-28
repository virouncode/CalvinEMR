import React from "react";

const DurationPicker = ({
  durationHours,
  durationMin,
  handleDurationHoursChange,
  handleDurationMinChange,
  disabled,
}) => {
  return (
    <>
      <label>Duration</label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "40%",
        }}
      >
        <label style={{ fontWeight: "normal" }}>Hrs</label>
        <input
          style={{ width: "50px" }}
          type="number"
          step="1"
          min="0"
          value={durationHours}
          onChange={handleDurationHoursChange}
          disabled={disabled}
        />
        <label style={{ fontWeight: "normal" }}>Min</label>
        <input
          style={{ width: "50px" }}
          type="number"
          step="1"
          max="59"
          min="0"
          value={durationMin}
          onChange={handleDurationMinChange}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default DurationPicker;
