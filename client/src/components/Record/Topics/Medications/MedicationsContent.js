//Librairies
import React from "react";
import { CircularProgress } from "@mui/material";

const MedicationsContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-medications-content-err">{errMsg}</p>
    ) : (
      <div className="patient-medications-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .filter((medication) => medication.active)
              .sort((a, b) => b.date_created - a.date_created)
              .map((medication) => (
                <li key={medication.id}>
                  - <strong>{medication.name}</strong>,{" "}
                  {medication.dose ? `${medication.dose}, ` : ""}
                  {medication.number_of_doses
                    ? `${medication.number_of_doses}, `
                    : ""}{" "}
                  during {medication.duration}, active
                </li>
              ))}
            {datas
              .filter((medication) => !medication.active)
              .sort((a, b) => b.date_created - a.date_created)
              .map((medication) => (
                <li key={medication.id}>
                  - <strong>{medication.name}</strong>,{" "}
                  {medication.dose ? `${medication.dose}, ` : ""}
                  {medication.number_of_doses
                    ? `${medication.number_of_doses}, `
                    : ""}
                  during {medication.duration},not active
                </li>
              ))}
          </ul>
        ) : (
          "No medications"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MedicationsContent;
