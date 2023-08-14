//Librairies
import React from "react";
import { CircularProgress } from "@mui/material";

const MedHistoryContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-med-history-content-err">{errMsg}</p>
    ) : (
      <div className="patient-med-history-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_of_event - a.date_of_event)
              .map((event) => (
                <li key={event.id}>- {event.description}</li>
              ))}
          </ul>
        ) : (
          "No medical history"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MedHistoryContent;
