import React from "react";

import { useLocation } from "react-router-dom";
import PatientRecord from "../components/Record/Sections/PatientRecord";

const PatientRecordPage = () => {
  const location = useLocation();
  return <PatientRecord />;
};

export default PatientRecordPage;
