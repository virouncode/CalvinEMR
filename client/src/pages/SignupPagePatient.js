import React from "react";
import SignupPatientForm from "../components/Signup/SignupPatientForm";
import { Helmet } from "react-helmet";

const SignupPagePatient = () => {
  return (
    <main className="signup-section">
      <Helmet>
        <title>Calvin EMR New Patient</title>
      </Helmet>
      <div className="signup-section-title">Create a new patient account</div>
      <SignupPatientForm />
    </main>
  );
};

export default SignupPagePatient;
