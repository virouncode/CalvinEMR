import React, { useEffect, useRef, useState } from "react";
import PharmacyListItem from "./PharmacyListItem";
import PharmacyForm from "./PharmacyForm";
import axiosXano from "../../../../api/xano";
import useAuth from "../../../../hooks/useAuth";
var _ = require("lodash");

const PharmaciesList = ({
  handleAddItemClick,
  datas,
  patientId,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth } = useAuth();
  const direction = useRef(true);
  const [pharmaciesList, setPharmaciesList] = useState(null);
  const [addNew, setAddNew] = useState(false);
  useEffect(() => {
    const abortController = new AbortController();
    const fetchAllPharmacies = async () => {
      try {
        const response = await axiosXano.get("/all_pharmacies", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        setPharmaciesList(response.data);
      } catch (err) {}
    };
    fetchAllPharmacies();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken]);

  //HANDLERS
  const handleSort = (columnName) => {
    let sortedPharmacies = [...pharmaciesList];
    direction.current = !direction.current;
    direction.current
      ? sortedPharmacies.sort((a, b) =>
          a[columnName]?.toString().localeCompare(b[columnName]?.toString())
        )
      : sortedPharmacies.sort((a, b) =>
          b[columnName]?.toString().localeCompare(a[columnName]?.toString())
        );
    setPharmaciesList(sortedPharmacies);
  };

  const handleAddNewClick = () => {
    setAddNew((v) => !v);
  };

  return (
    <>
      <div className="pharmacies-list-title">
        Other Pharmacies List
        <button onClick={handleAddNewClick}>Add New Pharmacy</button>
      </div>
      <table className="pharmacies-list-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("address")}>Adress</th>
            <th onClick={() => handleSort("province_state")}>Province/State</th>
            <th onClick={() => handleSort("postal_code")}>Postal Code</th>
            <th onClick={() => handleSort("email")}>City</th>
            <th onClick={() => handleSort("country")}>Country</th>
            <th onClick={() => handleSort("phone")}>Phone</th>
            <th onClick={() => handleSort("fax")}>Fax</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th onClick={() => handleSort("created_by_name")}>Created By</th>
            <th onClick={() => handleSort("date_created")}>Created On</th>
            <th style={{ textDecoration: "none", cursor: "default" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {addNew && (
            <PharmacyForm
              setPharmaciesList={setPharmaciesList}
              setAddNew={setAddNew}
              patientId={patientId}
              setErrMsgPost={setErrMsgPost}
            />
          )}
          {pharmaciesList &&
            pharmaciesList
              .filter(({ id }) => _.findIndex(datas, { id: id }) === -1)
              .map((pharmacy) => (
                <PharmacyListItem
                  key={pharmacy.id}
                  item={pharmacy}
                  handleAddItemClick={handleAddItemClick}
                />
              ))}
        </tbody>
      </table>
    </>
  );
};

export default PharmaciesList;
