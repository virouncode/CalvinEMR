//Librairies
import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { CircularProgress } from "@mui/material";

const DocumentsContent = ({ showDocument, datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-documents-content-err">{errMsg}</p>
    ) : (
      <div className="patient-documents-content">
        {console.log(datas)}
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((document) => (
                <li
                  key={document.id}
                  onClick={() =>
                    showDocument(document.file.url, document.file.mime)
                  }
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  - {document.description} ({toLocalDate(document.date_created)}
                  )
                </li>
              ))}
          </ul>
        ) : (
          "No documents"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default DocumentsContent;
