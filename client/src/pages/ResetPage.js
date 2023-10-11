import React from "react";
import { Helmet } from "react-helmet";
import ForgotPassword from "../components/ResetPassword/ForgotPassword";

const ResetPage = () => {
  return (
    <div className="reset-section">
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <ForgotPassword />
    </div>
  );
};

export default ResetPage;
