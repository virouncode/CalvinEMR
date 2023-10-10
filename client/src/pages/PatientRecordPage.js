import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import PatientRecord from "../components/Record/Sections/PatientRecord";
import useAuth from "../hooks/useAuth";
import { patientIdToName } from "../utils/patientIdToName";

const PatientRecordPage = () => {
  const params = useParams();
  const { clinic } = useAuth();
  return (
    <main className="patient-display">
      <Helmet>
        <title>
          Patient: {patientIdToName(clinic.patientsInfos, parseInt(params.id))}
        </title>
      </Helmet>
      <PatientRecord />
    </main>
  );
};

export default PatientRecordPage;
