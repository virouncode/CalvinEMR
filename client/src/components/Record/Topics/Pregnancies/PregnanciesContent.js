//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { toLocalDate } from "../../../../utils/formatDates";
import { CircularProgress } from "@mui/material";

const PregnanciesContent = ({ patientId, datas, setDatas }) => {
  useRecord("/pregnancies", patientId, setDatas);
  return datas ? (
    <div className="patient-pregnancies-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort(
              (a, b) => new Date(b.date_of_event) - new Date(a.date_of_event)
            )
            .map((pregnancy) => (
              <li key={pregnancy.id}>
                - {pregnancy.description} (
                {toLocalDate(pregnancy.date_of_event)})
              </li>
            ))}
        </ul>
      ) : (
        "No pregnancies"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default PregnanciesContent;
