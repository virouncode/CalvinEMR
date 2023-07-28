//Librairies
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const GuestPatientResultItem = ({ guest, handleAddGuest }) => {
  return (
    <li key={guest.id} data-key={guest.id} data-type="patient">
      <span>{guest.full_name} (Patient)</span>
      <i
        className="fa-solid fa-user-plus"
        onClick={(e) => handleAddGuest(guest, e)}
      ></i>
    </li>
  );
};

export default GuestPatientResultItem;
