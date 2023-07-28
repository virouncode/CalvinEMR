//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const SocHistoryContent = ({ patientId, datas, setDatas }) => {
  useRecord("/social_history", patientId, setDatas);

  return datas ? (
    <div className="patient-soc-history-content">
      {datas.length >= 1 ? (
        <>
          <p>
            <label>Occupations: </label>
            {datas[0].occupations}
          </p>
          <p>
            <label>Income: </label>
            {datas[0].income}
          </p>
          <p>
            <label>Religion: </label>
            {datas[0].religion}
          </p>
          <p>
            <label>Sexual orientation: </label>
            {datas[0].sexual_orientation}
          </p>
          <p>
            <label>Special diet: </label>
            {datas[0].special_diet}
          </p>
          <p>
            <label>Smoking: </label>
            {datas[0].smoking}
          </p>
          <p>
            <label>Alcohol: </label>
            {datas[0].alcohol}
          </p>
          <p>
            <label>Recreational drugs: </label>
            {datas[0].recreational_drugs}
          </p>
        </>
      ) : (
        "No social history"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default SocHistoryContent;
