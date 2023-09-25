import React from "react";
import AccountPatientForm from "../components/PatientPortal/AccountPatient/AccountPatientForm";
import { Helmet } from "react-helmet";

const PatientAccountPage = () => {
  return (
    <div className="patient-account-section">
      <Helmet>
        <title>Calvin EMR My account</title>
      </Helmet>
      <div className="patient-account-section-title">
        My personal informations
      </div>
      <AccountPatientForm />
    </div>
  );
};

export default PatientAccountPage;
