//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const MedicationsContent = ({ patientId, datas, setDatas }) => {
  useRecord("/medications", patientId, setDatas);

  return datas ? (
    <div className="patient-medications-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .filter((medication) => medication.active)
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((medication) => (
              <li key={medication.id}>
                - <strong>{medication.name}</strong>, {medication.dose}, active
              </li>
            ))}
          {datas
            .filter((medication) => !medication.active)
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((medication) => (
              <li key={medication.id}>
                - <strong>{medication.name}</strong>, {medication.dose}, not
                active
              </li>
            ))}
        </ul>
      ) : (
        "No medications"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MedicationsContent;
