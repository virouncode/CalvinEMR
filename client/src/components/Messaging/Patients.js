import axios from "../../api/xano";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import PatientsList from "./PatientsList";

const Patients = ({ isPatientChecked, handleCheckPatient }) => {
  const { auth } = useAuth();
  const [patientsInfos, setPatientsInfos] = useState([]);

  useEffect(() => {
    const fetchPatientsInfos = async () => {
      const response = await axios.get("/patients", {
        headers: {
          Authorization: `Bearer ${auth?.authToken}`,
          "Content-Type": "application/json",
        },
      });
      setPatientsInfos(response.data);
    };
    fetchPatientsInfos();
  }, [auth?.authToken]);

  return (
    <div className="patients">
      <div className="patients-title">Patients</div>
      <div className="patients-list">
        <PatientsList
          patientsInfos={patientsInfos}
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
        />
      </div>
    </div>
  );
};

export default Patients;
