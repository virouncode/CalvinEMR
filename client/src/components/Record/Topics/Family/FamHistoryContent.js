//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const FamHistoryContent = ({ patientId, datas, setDatas }) => {
  useRecord("/family_history", patientId, setDatas);

  return datas ? (
    <div className="patient-fam-history-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort((a, b) => b.date_of_event - a.date_of_event)
            .map((event) => (
              <li key={event.id}>
                - {event.description} ({event.family_member_affected})
              </li>
            ))}
        </ul>
      ) : (
        "No family history"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default FamHistoryContent;
