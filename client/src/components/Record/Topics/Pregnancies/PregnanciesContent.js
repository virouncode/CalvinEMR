//Librairies
import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { CircularProgress } from "@mui/material";

const PregnanciesContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-pregnancies-content-err">{errMsg}</p>
    ) : (
      <div className="patient-pregnancies-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_of_event - a.date_of_event)
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
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default PregnanciesContent;
