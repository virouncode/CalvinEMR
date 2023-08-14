//Librairies
//Librairies
import { CircularProgress } from "@mui/material";
import React from "react";

const DoctorsContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-doctors-content-err">{errMsg}</p>
    ) : (
      <div className="patient-doctors-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((doctor) => (
                <li key={doctor.id}>
                  - <strong>{doctor.name}</strong>, {doctor.speciality},{" "}
                  {doctor.city}, {doctor.phone}
                </li>
              ))}
          </ul>
        ) : (
          "No family doctors/specialists"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default DoctorsContent;
