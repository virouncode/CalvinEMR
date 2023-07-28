import React from "react";
import logo from "../../assets/img/logo.png";

const LoginCarousel = () => {
  return (
    <div className="login-carousel">
      <img src={logo} alt="Alpha EMR logo" width="200px" />
      <h1>Electronic Medical Records</h1>
    </div>
  );
};

export default LoginCarousel;
