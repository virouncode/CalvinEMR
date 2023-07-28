import React from "react";
import SignupPatientForm from "../components/Signup/SignupPatientForm";

const SignupPagePatient = () => {
  return (
    <main className="signup-section">
      <div className="signup-section-title">Create a new patient account</div>
      <SignupPatientForm />
    </main>
  );
};

export default SignupPagePatient;
