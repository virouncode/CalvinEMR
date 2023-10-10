import React from "react";
import { Helmet } from "react-helmet";
import MyAccountForm from "../components/Account/MyAccountForm";

const MyAccountPage = () => {
  return (
    <div className="myaccount-section">
      <Helmet>
        <title>My account</title>
      </Helmet>
      <div className="myaccount-section-title">My personal informations</div>
      <MyAccountForm />
    </div>
  );
};

export default MyAccountPage;
