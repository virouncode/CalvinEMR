import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axiosXanoPatient from "../../../api/xanoPatient";
import { toast } from "react-toastify";
import { staffIdToTitle } from "../../../utils/staffIdToTitle";
import formatName from "../../../utils/formatName";
import { staffIdToName } from "../../../utils/staffIdToName";
import { CircularProgress } from "@mui/material";
import { confirmAlert } from "../../Confirm/ConfirmGlobal";

const NextAppointments = () => {
  const { user, auth, clinic } = useAuth();
  const [appointments, setAppointments] = useState(null);
  const [appointmentSlectedId, setAppointmentSelectedId] = useState(null);

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
            .filter(({ start }) => start >= Date.parse(new Date()))
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

  const isAppointmentSelected = (id) => appointmentSlectedId === id;
  const handleCheck = (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) setAppointmentSelectedId(id);
    else setAppointmentSelectedId(null);
  };
  const handleDeleteAppointment = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel this appointment ?",
      })
    ) {
      try {
        await axiosXanoPatient.delete(`/appointments/${appointmentSlectedId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        toast.success("Appointment canceled successfully", {
          containerId: "A",
        });
        try {
          const response = await axiosXanoPatient.get(
            `/patient_appointments?patient_id=${user.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          );
          setAppointments(
            response.data
              .filter(({ start }) => start >= Date.parse(new Date()))
              .sort((a, b) => b.date_created - a.date_created)
          );
          setAppointmentSelectedId(null);
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(
              `Error : unable fetch your account infos: ${err.message}`,
              {
                containerId: "A",
              }
            );
        }
      } catch (err) {
        toast.err(`Unable to cancel appointment: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  return (
    <div className="patient-next-appointments">
      <div className="patient-next-appointments-title">Next Appointments</div>
      <div className="patient-next-appointments-content">
        {appointments ? (
          appointments.length ? (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="patient-next-appointments-content-item"
              >
                <input
                  type="checkbox"
                  checked={isAppointmentSelected(appointment.id)}
                  onChange={handleCheck}
                  id={appointment.id}
                />
                {!appointment.all_day ? (
                  <div className="patient-next-appointments-content-item-date">
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
            <div>No next appointments</div>
          )
        ) : (
          <CircularProgress />
        )}
      </div>
      {appointmentSlectedId && (
        <div className="patient-next-appointments-btn">
          <button onClick={handleDeleteAppointment}>Cancel Appointment</button>
        </div>
      )}
    </div>
  );
};

export default NextAppointments;
