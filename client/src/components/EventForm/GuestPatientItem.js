//Librairies
import React from "react";

const GuestPatientItem = ({ guest, handleRemoveGuest }) => {
  return (
    <span data-key={guest.id} data-type="patient">
      <span>{guest.full_name} (Patient) </span>
      <i
        className="fa-solid fa-trash"
        onClick={handleRemoveGuest}
        style={{ cursor: "pointer" }}
      ></i>
      ,{" "}
    </span>
  );
};

export default GuestPatientItem;
