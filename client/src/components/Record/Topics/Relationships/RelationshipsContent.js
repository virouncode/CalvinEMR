import { CircularProgress } from "@mui/material";
import React from "react";
import { patientIdToName } from "../../../../utils/patientIdToName";
import useAuth from "../../../../hooks/useAuth";
import { NavLink } from "react-router-dom";

const RelationshipsContent = ({ datas, isLoading, errMsg }) => {
  const { clinic } = useAuth();
  return !isLoading ? (
    errMsg ? (
      <p className="patient-relationships-content-err">{errMsg}</p>
    ) : (
      <div className="patient-relationships-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas.map((item) => (
              <li key={item.id}>
                - {item.relationship} of{" "}
                <NavLink
                  to={`/patient-record/${item.relation_id}`}
                  className="patient-relationships-content-link"
                >
                  {patientIdToName(clinic.patientsInfos, item.relation_id)}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          "No relationships"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default RelationshipsContent;
