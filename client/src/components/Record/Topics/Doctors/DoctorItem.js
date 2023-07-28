//Librairies
import React from "react";

const DoctorItem = ({ item }) => {
  return (
    <div className="patient-doctors-content-event">
      <ul>
        <li>
          <label>Doctor: </label>
          <p>{item.Doctor_Name}</p>
        </li>
        <li>
          <label>Speciality: </label>
          <p>{item.Speciality}</p>
        </li>
        <li>
          <label>City: </label>
          <p>{item.City}</p>
        </li>
        <li>
          <label>Phone: </label>
          <p>{item.Phone}</p>
        </li>
      </ul>
      <p className="patient-doctors-content-event-sign">
        Created by {item.created_by_name.full_name} on{" "}
        {item.date_created.slice(0, 10)}
      </p>
    </div>
  );
};

export default DoctorItem;
