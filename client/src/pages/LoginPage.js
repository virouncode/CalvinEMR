import React from "react";
import { Helmet } from "react-helmet";
import LoginCard from "../components/Login/LoginCard";

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
