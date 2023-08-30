import React from "react";
import MyAccountForm from "../components/Account/MyAccountForm";

const MyAccountPage = () => {
  return (
    <div className="myaccount-section">
      <div className="myaccount-section-title">My personal informations</div>
      <MyAccountForm />
    </div>
  );
};

export default MyAccountPage;
