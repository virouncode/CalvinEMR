import React from "react";
import { NavLink } from "react-router-dom";

const GuestPatientItem = ({ guest, handleRemoveGuest }) => {
  return (
    <NavLink
      to={`patient-record/${guest.id}`}
      className="guest-patient-item"
      target="_blank"
    >
      <span data-key={guest.id} data-type="patient">
        <span>{guest.full_name} (Patient) </span>
        <i
          className="fa-solid fa-trash"
          onClick={handleRemoveGuest}
          style={{ cursor: "pointer" }}
        ></i>
        ,{" "}
      </span>
    </NavLink>
  );
};

export default GuestPatientItem;
