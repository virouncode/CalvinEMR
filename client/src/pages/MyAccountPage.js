import React from "react";
import MyAccountForm from "../components/Account/MyAccountForm";
import { Helmet } from "react-helmet";

const MyAccountPage = () => {
  return (
    <div className="myaccount-section">
      <Helmet>
        <title>Calvin EMR My account</title>
      </Helmet>
      <div className="myaccount-section-title">My personal informations</div>
      <MyAccountForm />
    </div>
  );
};

export default MyAccountPage;
