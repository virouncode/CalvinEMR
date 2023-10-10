import React, { useState } from "react";
import { Helmet } from "react-helmet";
import CredentialsFormPatient from "../components/PatientPortal/CredentialsPatient/CredentialsFormPatient";
import VerifyPasswordPatient from "../components/PatientPortal/CredentialsPatient/VerifyPasswordPatient";

const PatientCredentialsPage = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="credentials">
      <Helmet>
        <title>Credentials</title>
      </Helmet>
      <div className="credentials-title">Change email/password</div>
      {!verified ? (
        <VerifyPasswordPatient setVerified={setVerified} />
      ) : (
        <CredentialsFormPatient />
      )}
    </div>
  );
};

export default PatientCredentialsPage;
