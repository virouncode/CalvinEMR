import React from "react";
import PatientsList from "./PatientsList";

const Patients = ({ isPatientChecked, handleCheckPatient }) => {
  return (
    <div className="patients">
      <div className="patients-title">Patients</div>
      <div className="patients-list">
        <PatientsList
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
        />
      </div>
    </div>
  );
};

export default Patients;
