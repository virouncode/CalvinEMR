//Librairies
import React from "react";
import { CircularProgress } from "@mui/material";

const AppointmentsContent = ({ datas, errMsg, isLoading }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="patient-appointments-content-err">{errMsg}</p>
    ) : (
      <div className="patient-appointments-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.start - a.start)
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
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default AppointmentsContent;
