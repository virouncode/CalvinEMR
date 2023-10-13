import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import ProgressNotes from "../Progress/ProgressNotes";
import PatientMenuLeft from "./PatientMenuLeft";
import PatientMenuRight from "./PatientMenuRight";

const PatientRecord = () => {
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
      <button type="button" className="patient-btn-fold" onClick={handleClick}>
        {allContentsVisible ? "Fold All" : "Unfold All"}
      </button>
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
