import React from "react";
import PatientsListItem from "./PatientsListItem";
import useAuth from "../../hooks/useAuth";

const PatientsList = ({ isPatientChecked, handleCheckPatient }) => {
  const { clinic } = useAuth();
  return (
    <ul className="patients-list">
      {clinic.patientsInfos.map((info) => (
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
