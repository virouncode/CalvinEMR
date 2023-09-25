import React from "react";
import BrowsePatient from "../components/Record/Search/BrowsePatient";
import { Helmet } from "react-helmet";

const SearchPatientPage = () => {
  return (
    <main className="browse-patient">
      <Helmet>
        <title>Calvin EMR Patients</title>
      </Helmet>
      <BrowsePatient />
    </main>
  );
};

export default SearchPatientPage;
