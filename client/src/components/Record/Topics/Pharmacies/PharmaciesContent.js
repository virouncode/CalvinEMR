import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const PharmaciesContent = ({ patientId, setDatas, datas }) => {
  useRecord("/pharmacies", patientId, setDatas);

  return datas ? (
    <div className="patient-pharmacies-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort((a, b) => b.date_created - a.date_created)
            .map((pharmacy) => (
              <li key={pharmacy.id}>
                - <strong>{pharmacy.name.toUpperCase()}, </strong>
                {pharmacy.address}, {pharmacy.city}
              </li>
            ))}
        </ul>
      ) : (
        "No pharmacies"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default PharmaciesContent;
