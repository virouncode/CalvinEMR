import React from "react";

const StatusRadioItem = ({ status, handleStatusChange, isStatusSelected }) => {
  return (
    <div className="event-form-row-item event-form-row-item--radio">
      <input
        type="radio"
        name="status"
        id={status}
        value={status}
        onChange={handleStatusChange}
        checked={isStatusSelected(status)}
      />
      <label htmlFor={status}>{status}</label>
    </div>
  );
};

export default StatusRadioItem;
