import React from "react";
import MyAccountForm from "../components/Account/MyAccountForm";

const MyAccountPage = () => {
  return (
    <main className="myaccount-section">
      <div className="myaccount-section-title">My personal informations</div>
      <MyAccountForm />
    </main>
  );
};

export default MyAccountPage;
