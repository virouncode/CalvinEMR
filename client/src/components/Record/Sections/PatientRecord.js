//Librairies
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//Components
import PatientMenuLeft from "./PatientMenuLeft";
import PatientMenuRight from "./PatientMenuRight";
import ProgressNotes from "../Progress/ProgressNotes";
import { CircularProgress } from "@mui/material";
//Utils
import useAuth from "../../../hooks/useAuth";

const PatientRecord = () => {
  console.log("render Record");
  //HOOKS
  const { clinic } = useAuth();
  const [patientInfos, setPatientInfos] = useState(null);
  const { id } = useParams();
  const [allContentsVisible, setAllContentsVisible] = useState(true);

  useEffect(() => {
    setPatientInfos(
      clinic.patientsInfos.find((patient) => patient.id === parseInt(id))
    );
  }, [id, clinic.patientsInfos]);

  const handleClick = (e) => {
    setAllContentsVisible((v) => !v);
  };

  return patientInfos ? (
    <>
      <div className="patient-header">
        <p></p>
        <h1>Patient Medical Record</h1>
        <p>
          <button
            type="button"
            className="patient-btn-fold"
            onClick={handleClick}
          >
            {allContentsVisible ? "Fold All" : "Unfold All"}
          </button>
        </p>
      </div>
      <div className="patient-record">
        <PatientMenuLeft
          patientInfos={patientInfos}
          setPatientInfos={setPatientInfos}
          patientId={parseInt(id)}
          allContentsVisible={allContentsVisible}
        />
        <ProgressNotes
          patientInfos={patientInfos}
          allContentsVisible={allContentsVisible}
          patientId={parseInt(id)}
        />
        <PatientMenuRight
          patientInfos={patientInfos}
          patientId={parseInt(id)}
          allContentsVisible={allContentsVisible}
        />
      </div>
    </>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default PatientRecord;
