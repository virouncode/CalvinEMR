//Librairies
import React from "react";
//Components
import LoginForm from "./LoginForm";
import LoginCarousel from "./LoginCarousel";

const LoginCard = () => {
  return (
    <section className="login-card">
      <LoginCarousel />
      <LoginForm />
    </section>
  );
};

export default LoginCard;
