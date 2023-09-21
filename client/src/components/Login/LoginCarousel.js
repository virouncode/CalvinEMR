import React from "react";
import logo from "../../assets/img/logo.png";

const LoginCarousel = () => {
  return (
    <div className="login-carousel">
      <img src={logo} alt="Calvin EMR logo" width="100%" />
      <h1>Electronic Medical Records</h1>
    </div>
  );
};

export default LoginCarousel;
