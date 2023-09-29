import React, { useState } from "react";
import PatientsList from "../Messaging/PatientsList";

const DocInboxPatients = ({
  isPatientChecked,
  handleCheckPatient,
  label = true,
}) => {
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <div className="docinbox-patients">
      {label && <div className="docinbox-patients-title">Patients</div>}
      <input
        type="text"
        value={search}
        placeholder="Search patient by name, phone, chart nbr, etc..."
        onChange={handleChange}
      />

      <div className="docinbox-patients-list">
        <PatientsList
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
          search={search}
        />
      </div>
    </div>
  );
};

export default DocInboxPatients;
