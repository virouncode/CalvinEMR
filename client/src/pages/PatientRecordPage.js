import React from "react";
import PatientRecord from "../components/Record/Sections/PatientRecord";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { patientIdToName } from "../utils/patientIdToName";
import useAuth from "../hooks/useAuth";

const PatientRecordPage = () => {
  const params = useParams();
  const { clinic } = useAuth();
  return (
    <main className="patient-display">
      <Helmet>
        <title>
          Calvin EMR Patient:{" "}
          {patientIdToName(clinic.patientsInfos, parseInt(params.id))}
        </title>
      </Helmet>
      <PatientRecord />
    </main>
  );
};

export default PatientRecordPage;
