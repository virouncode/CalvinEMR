//Librairies
import React from "react";
import { NavLink } from "react-router-dom";
//Utils
import { getAge } from "../../../utils/getAge";
import { toLocalDate } from "../../../utils/formatDates";

const PatientResultItem = ({ patient }) => {
  return (
    <tr>
      <td>{patient.first_name}</td>
      <td>{patient.middle_name}</td>
      <td>
        <NavLink to={`/patient-record/${patient.id}`} className="record-link">
          {patient.last_name}
        </NavLink>
      </td>
      <td>{toLocalDate(patient.date_of_birth)}</td>
      <td>{getAge(toLocalDate(patient.date_of_birth))}</td>
      <td>{patient.email}</td>
      <td>{patient.cell_phone}</td>
      <td>{patient.home_phone}</td>
      <td>{patient.preferred_phone}</td>
      <td>{patient.health_insurance_number}</td>
      <td>{patient.address}</td>
      <td>{patient.postal_code}</td>
      <td>{patient.province_state}</td>
      <td>{patient.city}</td>
      <td>{patient.country}</td>
    </tr>
  );
};

export default PatientResultItem;
