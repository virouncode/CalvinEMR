//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const ConcernsContent = ({ patientId, datas, setDatas }) => {
  useRecord("/ongoing_concerns", patientId, setDatas);
  return datas ? (
    <div className="patient-concerns-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((concern) => (
              <li key={concern.id}>- {concern.description}</li>
            ))}
        </ul>
      ) : (
        "No ongoing concerns"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default ConcernsContent;
