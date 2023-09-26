//Librairies
import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toLocalTimeWithSeconds } from "../../../../utils/formatDates";

const DoctorItem = ({ item }) => {
  const { clinic } = useAuth();
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
        Created by{" "}
        {staffIdToTitleAndName(clinic.staffInfos, item.created_by_id, true)} on{" "}
        {toLocalTimeWithSeconds(item.date_created)}
      </p>
    </div>
  );
};

export default DoctorItem;
