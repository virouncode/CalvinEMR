import React from "react";
import SignupStaffForm from "../components/Signup/SignupStaffForm";
import { Helmet } from "react-helmet";

const SignupPageStaff = () => {
  return (
    <main className="signup-section">
      <Helmet>
        <title>Calvin EMR New Staff Member</title>
      </Helmet>
      <div className="signup-section-title">Create a new staff account</div>
      <SignupStaffForm />
    </main>
  );
};

export default SignupPageStaff;
