import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const MissingPage = () => {
  return (
    <main className="missing">
      <Helmet>
        <title>Calvin EMR Page not found</title>
      </Helmet>
      <h2>Page not found</h2>
      <p style={{ textDecoration: "underline" }}>
        <NavLink to="/login">Return to login page</NavLink>
      </p>
    </main>
  );
};

export default MissingPage;
