import React, { useRef, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import PatientSearchForm from "./PatientSearchForm";
import PatientSearchResult from "./PatientSearchResult";

const BrowsePatient = () => {
  const direction = useRef(false);
  const { clinic } = useAuth();
  const [sortedPatientsInfos, setSortedPatientsInfos] = useState(
    clinic.patientsInfos
  );
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  const handleSort = (columnName) => {
    const sortedPatientsInfos = [...clinic.patientsInfos];
    direction.current = !direction.current;
    if (
      columnName === "assigned_md_name" ||
      columnName === "assigned_resident_name" ||
      columnName === "assigned_nurse_name" ||
      columnName === "assigned_midwife_name" ||
      columnName === "assigned_us_tech_name" ||
      columnName === "assigned_physio_name" ||
      columnName === "assigned_psycho_name" ||
      columnName === "assigned_nutri_name"
    ) {
      direction.current
        ? sortedPatientsInfos.sort((a, b) =>
            a[columnName]?.full_name
              .toString()
              .localeCompare(b[columnName]?.full_name.toString())
          )
        : sortedPatientsInfos.sort((a, b) =>
            b[columnName]?.full_name
              .toString()
              .localeCompare(a[columnName]?.full_name.toString())
          );
    } else {
      direction.current
        ? sortedPatientsInfos.sort((a, b) =>
            a[columnName]?.toString().localeCompare(b[columnName]?.toString())
          )
        : sortedPatientsInfos.sort((a, b) =>
            b[columnName]?.toString().localeCompare(a[columnName]?.toString())
          );
    }
    setSortedPatientsInfos(sortedPatientsInfos);
  };
  return (
    <>
      <PatientSearchForm setSearch={setSearch} search={search} />
      <PatientSearchResult
        search={search}
        sortedPatientsInfos={sortedPatientsInfos}
        handleSort={handleSort}
      />
    </>
  );
};

export default BrowsePatient;
