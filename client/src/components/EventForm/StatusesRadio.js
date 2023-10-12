import React from "react";
import StatusRadioItem from "./StatusRadioItem";

const StatusesRadio = ({
  handleStatusChange,
  selectedStatus,
  statuses,
  label = true,
}) => {
  const isStatusSelected = (status) => selectedStatus === status;
  return (
    <div className="event-form-row-radio">
      {label && <p>Status</p>}
      <div className="event-form-row-radio-container">
        {statuses.map((status) => (
          <StatusRadioItem
            key={status}
            status={status}
            handleStatusChange={handleStatusChange}
            isStatusSelected={isStatusSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusesRadio;
