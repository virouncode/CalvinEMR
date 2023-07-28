//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const AppointmentsContent = ({ patientId, datas, setDatas }) => {
  useRecord("/patient_appointments", patientId, setDatas);
  return datas ? (
    <div className="patient-appointments-content">
      {datas.length >= 1 ? (
        <ul>
          {datas
            .sort((a, b) => new Date(b.start) - new Date(a.start))
            .map((appointment) => (
              <li key={appointment.id}>
                -{" "}
                {!appointment.all_day
                  ? new Date(appointment.start).toLocaleString("en-CA", {
                      //local time
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : new Date(appointment.start).toLocaleString("en-CA", {
                      //local time
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    }) + " All Day"}{" "}
                ({appointment.reason})
              </li>
            ))}
        </ul>
      ) : (
        "No appointments"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default AppointmentsContent;
