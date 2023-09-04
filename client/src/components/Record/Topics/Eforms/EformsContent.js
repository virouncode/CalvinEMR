import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { CircularProgress } from "@mui/material";

const EformsContent = ({ showDocument, datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-electronic-content-err">{errMsg}</p>
    ) : (
      <div className="patient-electronic-content">
        {console.log(datas)}
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((eform) => (
                <li
                  key={eform.id}
                  onClick={() => showDocument(eform.file.url)}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  - {eform.name} ({toLocalDate(eform.date_created)})
                </li>
              ))}
          </ul>
        ) : (
          "No E-forms"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default EformsContent;
