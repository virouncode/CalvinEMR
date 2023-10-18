import { CircularProgress } from "@mui/material";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const PastAppointments = ({ pastAppointments }) => {
  const { clinic } = useAuth();

  const optionsDate = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div className="patient-past-appointments">
      <div className="patient-past-appointments-title">Past Appointments</div>
      <div className="patient-past-appointments-content">
        {pastAppointments ? (
          pastAppointments.length ? (
            pastAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="patient-past-appointments-content-item"
              >
                {!appointment.all_day ? (
                  <div className="patient-past-appointments-content-item-date">
                    <p>
                      {new Date(appointment.start).toLocaleString(
                        "en-CA",
                        optionsDate
                      )}
                    </p>
                    <p>
                      {new Date(appointment.start).toLocaleTimeString(
                        "en-CA",
                        optionsTime
                      )}{" "}
                      -{" "}
                      {new Date(appointment.end).toLocaleTimeString(
                        "en-CA",
                        optionsTime
                      )}
                    </p>
                  </div>
                ) : (
                  <div>
                    {new Date(appointment.start).toLocaleString(
                      "en-CA",
                      optionsDate
                    )}{" "}
                    {`All Day`}
                  </div>
                )}
                <p>Reason : {appointment.reason}</p>
                <p>
                  {staffIdToTitleAndName(
                    clinic.staffInfos,
                    appointment.host_id,
                    true
                  )}
                </p>
              </div>
            ))
          ) : (
            <div>No past appointments</div>
          )
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};

export default PastAppointments;
