import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axiosXanoPatient from "../../../api/xanoPatient";
import { toast } from "react-toastify";
import { staffIdToTitle } from "../../../utils/staffIdToTitle";
import formatName from "../../../utils/formatName";
import { staffIdToName } from "../../../utils/staffIdToName";
import { CircularProgress } from "@mui/material";

const PastAppointments = () => {
  const { user, auth, clinic } = useAuth();
  const [appointments, setAppointments] = useState(null);

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

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAppointments = async () => {
      try {
        const response = await axiosXanoPatient.get(
          `/patient_appointments?patient_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setAppointments(
          response.data
            .filter(({ start }) => start < Date.now())
            .sort((a, b) => b.date_created - a.date_created)
        );
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch your account infos: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchAppointments();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  return (
    <div className="patient-past-appointments">
      <div className="patient-past-appointments-title">Past Appointments</div>
      <div className="patient-past-appointments-content">
        {appointments ? (
          appointments.length ? (
            appointments.map((appointment) => (
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
                  {staffIdToTitle(clinic.staffInfos, appointment.host_id) +
                    formatName(
                      staffIdToName(clinic.staffInfos, appointment.host_id)
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
