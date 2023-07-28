//Librairies
import React from "react";

const HostOption = ({ staff, title }) => {
  return (
    <option value={staff.id} key={staff.id}>
      {title === "Doctor" ? "Dr. " : ""}
      {staff.full_name}
    </option>
  );
};

export default HostOption;
