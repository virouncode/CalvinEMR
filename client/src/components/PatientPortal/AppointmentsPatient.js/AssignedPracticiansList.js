import React from "react";
import { staffIdToTitle } from "../../../utils/staffIdToTitle";
import { staffIdToName } from "../../../utils/staffIdToName";
import formatName from "../../../utils/formatName";

const AssignedPracticiansList = ({
  assignedStaff,
  handlePracticianChange,
  practicianSelectedId,
  staffInfos,
}) => {
  return (
    <div className="assigned-practicians-list">
      <label>With: </label>
      <select
        style={{ marginLeft: "10px" }}
        onChange={handlePracticianChange}
        value={practicianSelectedId}
      >
        <option value="" disabled>
          Choose a practician...
        </option>
        {assignedStaff.map((staff) => (
          <option key={staff.id} value={staff.id}>
            {staff.category === "Doctor"
              ? staffIdToTitle(staffInfos, staff.id) +
                formatName(staffIdToName(staffInfos, staff.id))
              : formatName(staffIdToName(staffInfos, staff.id)) +
                `(${staff.category})`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AssignedPracticiansList;
