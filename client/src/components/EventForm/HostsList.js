import React from "react";
import HostOption from "./HostOption";

const HostsList = ({
  staffInfos,
  handleHostChange,
  hostId,
  disabled = false,
  style,
}) => {
  return (
    <select
      name="host_id"
      onChange={handleHostChange}
      value={hostId}
      disabled={disabled}
      style={style}
    >
      <option value="" disabled>
        Choose a host...
      </option>
      {staffInfos.map((staff) => (
        <HostOption title={staff.title} staff={staff} key={staff.id} />
      ))}
    </select>
  );
};

export default HostsList;
