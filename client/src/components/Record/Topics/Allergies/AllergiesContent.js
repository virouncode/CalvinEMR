//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const AllergiesContent = ({ patientId, datas, setDatas }) => {
  useRecord("/allergies", patientId, setDatas);
  return datas ? (
    <div className="patient-allergies-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((allergy) => (
              <li key={allergy.id}>- {allergy.allergy}</li>
            ))}
        </ul>
      ) : (
        "No allergies"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default AllergiesContent;
