import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <main className="unauthorized">
      <Helmet>
        <title>Calvin EMR Unauthorized</title>
      </Helmet>
      <h2>Unauthorized Page : you don't have access to the requested page</h2>
      <p>Please contact admin</p>
      <p style={{ textDecoration: "underline" }}>
        <NavLink to="/login">Return to login page</NavLink>
      </p>
    </main>
  );
};

export default UnauthorizedPage;
