import React from "react";
import AccountPatientForm from "../components/PatientPortal/AccountPatient/AccountPatientForm";

const PatientAccountPage = () => {
  return (
    <div className="patient-account-section">
      <div className="patient-account-section-title">
        My personal informations
      </div>
      <AccountPatientForm />
    </div>
  );
};

export default PatientAccountPage;
