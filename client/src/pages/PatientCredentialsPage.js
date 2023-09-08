import React, { useState } from "react";
import VerifyPasswordPatient from "../components/PatientPortal/CredentialsPatient/VerifyPasswordPatient";
import CredentialsFormPatient from "../components/PatientPortal/CredentialsPatient/CredentialsFormPatient";

const PatientCredentialsPage = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="credentials">
      <div className="credentials-title">Change credentials</div>
      {!verified ? (
        <VerifyPasswordPatient setVerified={setVerified} />
      ) : (
        <CredentialsFormPatient />
      )}
    </div>
  );
};

export default PatientCredentialsPage;
