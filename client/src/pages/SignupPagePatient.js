import React from "react";
import { Helmet } from "react-helmet";
import SignupPatientForm from "../components/Signup/SignupPatientForm";

const SignupPagePatient = () => {
  return (
    <main className="signup-section">
      <Helmet>
        <title>New Patient</title>
      </Helmet>
      <div className="signup-section-title">Create a new patient account</div>
      <SignupPatientForm />
    </main>
  );
};

export default SignupPagePatient;
