import React from "react";
import { Helmet } from "react-helmet";
import Reference from "../components/Reference/Reference";

const ReferencePage = () => {
  return (
    <div className="reference-section">
      <Helmet>
        <title>Reference</title>
      </Helmet>
      <Reference />
    </div>
  );
};

export default ReferencePage;
