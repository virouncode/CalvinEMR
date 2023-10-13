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
    <>
      <Helmet>
        <title>
          Patient: {patientIdToName(clinic.patientsInfos, parseInt(params.id))}
        </title>
      </Helmet>
      <setion className="patient-record-section">
        <h2 className="patient-record-section-title">Patient Medical Record</h2>
        <PatientRecord />
      </setion>
    </>
  );
};

export default PatientRecordPage;
