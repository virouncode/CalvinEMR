import React from "react";
import { NavLink } from "react-router-dom";

const MissingPage = () => {
  return (
    <div className="missing">
      <h2>Page not found</h2>
      <p style={{ textDecoration: "underline" }}>
        <NavLink to="/login">Return to login page</NavLink>
      </p>
    </div>
  );
};

export default MissingPage;
