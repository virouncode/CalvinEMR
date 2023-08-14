//Librairies
import React from "react";
import { CircularProgress } from "@mui/material";

const ConcernsContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-concerns-content-err">{errMsg}</p>
    ) : (
      <div className="patient-concerns-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((concern) => (
                <li key={concern.id}>- {concern.description}</li>
              ))}
          </ul>
        ) : (
          "No ongoing concerns"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default ConcernsContent;
