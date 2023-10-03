import React from "react";
import { Helmet } from "react-helmet";
import ForgotPassword from "../components/ResetPassword/ForgotPassword";

const ResetPage = () => {
  return (
    <main className="reset-section">
      <Helmet>
        <title>Calvin EMR Forgot Password</title>
      </Helmet>
      <ForgotPassword />
    </main>
  );
};

export default ResetPage;
