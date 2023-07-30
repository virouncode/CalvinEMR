//Librairies
import React, { useState, useEffect, useRef } from "react";
//Components
import PatientSearchForm from "./PatientSearchForm";
import PatientSearchResult from "./PatientSearchResult";
//Utils
import { useAxiosFunction } from "../../../hooks/useAxiosFunction";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/xano";

const BrowsePatient = () => {
  const direction = useRef(false);
  const [patientsInfos, setPatientsInfos, error, loading, axiosFetch] =
    useAxiosFunction();
  const { auth } = useAuth();
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  useEffect(() => {
    axiosFetch({
      axiosInstance: axios,
      method: "GET",
      url: `/patients`,
      authToken: auth?.authToken,
    });
    //eslint-disable-next-line
  }, [auth?.authToken]);

  const handleSort = (columnName) => {
    const sortedPatientsInfos = [...patientsInfos];
    direction.current = !direction.current;
    if (
      columnName === "assigned_md_name" ||
      columnName === "assigned_resident_name" ||
      columnName === "assigned_student_name" ||
      columnName === "assigned_nurse_name" ||
      columnName === "assigned_midwife_name"
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

    setPatientsInfos(sortedPatientsInfos);
  };
  return (
    <>
      <PatientSearchForm setSearch={setSearch} search={search} />
      <PatientSearchResult
        search={search}
        patientsInfos={patientsInfos}
        handleSort={handleSort}
      />
    </>
  );
};

export default BrowsePatient;
