import React from "react";
import { Helmet } from "react-helmet";
import AccountPatientForm from "../components/PatientPortal/AccountPatient/AccountPatientForm";

const PatientAccountPage = () => {
  return (
    <div className="patient-account-section">
      <Helmet>
        <title>My account</title>
      </Helmet>
      <div className="patient-account-section-title">
        My personal informations
      </div>
      <AccountPatientForm />
    </div>
  );
};

export default PatientAccountPage;
