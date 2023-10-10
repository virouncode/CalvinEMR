import React from "react";
import { Helmet } from "react-helmet";
import BrowsePatient from "../components/Record/Search/BrowsePatient";

const SearchPatientPage = () => {
  return (
    <main className="browse-patient">
      <Helmet>
        <title>Patients</title>
      </Helmet>
      <BrowsePatient />
    </main>
  );
};

export default SearchPatientPage;
