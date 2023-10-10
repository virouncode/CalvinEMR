import React from "react";
import { Helmet } from "react-helmet";
import SignupStaffForm from "../components/Signup/SignupStaffForm";

const SignupPageStaff = () => {
  return (
    <main className="signup-section">
      <Helmet>
        <title>New Staff Member</title>
      </Helmet>
      <div className="signup-section-title">Create a new staff account</div>
      <SignupStaffForm />
    </main>
  );
};

export default SignupPageStaff;
