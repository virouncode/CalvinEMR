import React, { useState } from "react";
import VerifyPassword from "../components/Credentials/VerifyPassword";
import CredentialsForm from "../components/Credentials/CredentialsForm";

const CredentialsPage = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="credentials">
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
