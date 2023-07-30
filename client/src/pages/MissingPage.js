import React from "react";
import { NavLink } from "react-router-dom";

const MissingPage = () => {
  return (
    <main className="missing">
      <h2>Page not found</h2>
      <p style={{ textDecoration: "underline" }}>
        <NavLink to="/login">Return to login page</NavLink>
      </p>
    </main>
  );
};

export default MissingPage;
