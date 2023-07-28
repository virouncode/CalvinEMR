//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";
//Components

const RiskContent = ({ patientId, datas, setDatas }) => {
  useRecord("/risk_factors", patientId, setDatas);

  return datas ? (
    <div className="patient-risk-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((risk) => (
              <li key={risk.id}>- {risk.description}</li>
            ))}
        </ul>
      ) : (
        "No risk factors"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default RiskContent;
