import React, { useState } from "react";
import { Helmet } from "react-helmet";
import CredentialsForm from "../components/Credentials/CredentialsForm";
import VerifyPassword from "../components/Credentials/VerifyPassword";

const CredentialsPage = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="credentials">
      <Helmet>
        <title>Credentials</title>
      </Helmet>
      <div className="credentials-title">Change email/password</div>
      {!verified ? (
        <VerifyPassword setVerified={setVerified} />
      ) : (
        <CredentialsForm />
      )}
    </div>
  );
};

export default CredentialsPage;
