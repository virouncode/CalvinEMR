import React, { useState } from "react";
import VerifyPasswordPatient from "../components/PatientPortal/CredentialsPatient/VerifyPasswordPatient";
import CredentialsFormPatient from "../components/PatientPortal/CredentialsPatient/CredentialsFormPatient";
import { Helmet } from "react-helmet";

const PatientCredentialsPage = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="credentials">
      <Helmet>
        <title>Calvin EMR Credentials</title>
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
