import React, { useState } from "react";
import VerifyPassword from "../components/Credentials/VerifyPassword";
import CredentialsForm from "../components/Credentials/CredentialsForm";
import { Helmet } from "react-helmet";

const CredentialsPage = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="credentials">
      <Helmet>
        <title>Calvin EMR Credentials</title>
      </Helmet>
      <div className="credentials-title">Change credentials</div>
      {!verified ? (
        <VerifyPassword setVerified={setVerified} />
      ) : (
        <CredentialsForm />
      )}
    </div>
  );
};

export default CredentialsPage;
