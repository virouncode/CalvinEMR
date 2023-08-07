import React, { useState } from "react";
import PatientsList from "./PatientsList";

const Patients = ({ isPatientChecked, handleCheckPatient }) => {
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    console.log(typeof value, value);
    setSearch(value);
  };
  return (
    <div className="patients">
      <div className="patients-title">Patients</div>
      <div className="patients-search-input">
        <input
          type="text"
          value={search}
          placeholder="Search patient"
          onChange={handleChange}
        />
      </div>
      <div className="patients-list">
        <PatientsList
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
          search={search}
        />
      </div>
    </div>
  );
};

export default Patients;
