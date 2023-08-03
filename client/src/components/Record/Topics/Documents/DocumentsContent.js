//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { toLocalDate } from "../../../../utils/formatDates";
import { CircularProgress } from "@mui/material";

const DocumentsContent = ({ patientId, datas, setDatas, showDocument }) => {
  useRecord("/documents", patientId, setDatas);
  return datas ? (
    <div className="patient-documents-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort((a, b) => b.date_created - a.date_created)
            .map((document) => (
              <li
                key={document.id}
                onClick={() => showDocument(document.file.url)}
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                - {document.description} ({toLocalDate(document.date_created)})
              </li>
            ))}
        </ul>
      ) : (
        "No documents"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default DocumentsContent;
