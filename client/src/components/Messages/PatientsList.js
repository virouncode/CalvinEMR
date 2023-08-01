import React from "react";
import PatientsListItem from "./PatientsListItem";

const PatientsList = ({
  patientsInfos,
  isPatientChecked,
  handleCheckPatient,
}) => {
  return (
    <ul className="patients-list">
      {patientsInfos.map((info) => (
        <PatientsListItem
          info={info}
          key={info.id}
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          patientName={info.full_name}
        />
      ))}
    </ul>
  );
};

export default PatientsList;
