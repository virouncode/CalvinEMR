import React from "react";
import LoginCard from "../components/Login/LoginCard";
import { Helmet } from "react-helmet";

const LoginPage = () => {
  return (
    <main className="login-section">
      <Helmet>
        <title>Calvin EMR Login</title>
      </Helmet>
      <LoginCard />
    </main>
  );
};

export default LoginPage;
