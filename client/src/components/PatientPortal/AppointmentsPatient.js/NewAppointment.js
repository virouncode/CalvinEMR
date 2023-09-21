import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { getWeekRange } from "../../../utils/formatDates";
import AssignedPracticiansList from "./AssignedPracticiansList";
import axiosXanoPatient from "../../../api/xanoPatient";
import { toast } from "react-toastify";
import AppointmentsSlots from "./AppointmentsSlots";
import WeekPicker from "./WeekPicker";
import { sendEmail } from "../../../api/sendEmail";
import { staffIdToName } from "../../../utils/staffIdToName";
import { staffIdToTitle } from "../../../utils/staffIdToTitle";

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

const NewAppointment = () => {
  const { user, auth, clinic } = useAuth();
  const [appointmentsInRange, setAppointmentsInRange] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [rangeStart, setRangeStart] = useState(
    Date.parse(getWeekRange(new Date().getDay())[0])
  );
  const [rangeEnd, setRangeEnd] = useState(
    Date.parse(getWeekRange(new Date().getDay())[1])
  );
  const [practicianSelectedId, setPracticianSelectedId] = useState("");
  const assignedStaff = [
    { category: "Doctor", id: user.demographics.assigned_md_id },
    { category: "Nurse", id: user.demographics.assigned_nurse_id },
    { category: "Midwife", id: user.demographics.assigned_midwife_id },
  ].filter(({ id }) => id);

  const [appointmentSelected, setAppointmentSelected] = useState({});
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!practicianSelectedId) return;
    const abortController = new AbortController();
    const fetchAppointmentsInRange = async () => {
      try {
        const response = await axiosXanoPatient.post(
          "/staff_appointments",
          {
            hosts_ids: [practicianSelectedId],
            range_start: rangeStart + 86400000, //+1 day
            range_end: rangeEnd + 86400000,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        if (abortController.signal.aborted) return;
        setAppointmentsInRange(
          response.data.filter(({ start }) => start > rangeStart + 86400000)
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
    fetchAppointmentsInRange();
    return () => abortController.abort();
  }, [auth.authToken, practicianSelectedId, rangeEnd, rangeStart]);

  useEffect(() => {
    if (!practicianSelectedId) return;
    const abortController = new AbortController();
    const fetchAvailability = async () => {
      try {
        const response = await axiosXanoPatient.get(
          `/availability_for_staff?staff_id=${practicianSelectedId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setAvailability(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch practician availability: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchAvailability();
    return () => abortController.abort();
  }, [auth.authToken, practicianSelectedId]);

  const handlePracticianChange = (e) => {
    const value = parseInt(e.target.value);
    setPracticianSelectedId(value);
  };

  const handleClickNext = () => {
    setRangeStart((rs) => rs + 6.048e8);
    setRangeEnd((re) => re + 6.048e8);
    setAppointmentSelected({});
  };
  const handleClickPrevious = () => {
    setRangeStart((rs) => rs - 6.048e8);
    setRangeEnd((re) => re - 6.048e8);
    setAppointmentSelected({});
  };

  const handleSubmit = async () => {
    console.log(appointmentSelected);
    const message = `I would like to have an appointment with ${
      staffIdToTitle(clinic.staffInfos, practicianSelectedId) +
      staffIdToName(clinic.staffInfos, practicianSelectedId)
    }:

      ${new Date(appointmentSelected.start).toLocaleString(
        "en-CA",
        optionsDate
      )} ${new Date(appointmentSelected.start).toLocaleTimeString(
      "en-CA",
      optionsTime
    )} - ${new Date(appointmentSelected.end).toLocaleTimeString(
      "en-CA",
      optionsTime
    )} 

    Please call me or send me a message to confirm the appointment.`;
    try {
      await sendEmail(
        "virounk@gmail.com", //to be changed to secretary .email
        staffIdToTitle(clinic.staffInfos, practicianSelectedId) +
          staffIdToName(clinic.staffInfos, practicianSelectedId),
        "Appointment Request",
        "",
        "",
        message,
        `Best wishes, \nPowered by Calvin EMR`
      );
      toast.success(
        `Invitation sent successfully to ${
          staffIdToTitle(clinic.staffInfos, practicianSelectedId) +
          staffIdToName(clinic.staffInfos, practicianSelectedId)
        }`,
        { containerId: "A" }
      );
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 6000);
    } catch (err) {
      toast.error(`Couldn't send the appointment request : ${err.text}`, {
        containerId: "A",
      });
    }
  };

  return (
    <div className="new-appointments">
      <div className="new-appointments-title">Request a new appointment</div>
      {!assignedStaff.length ? (
        <p>
          You don't seem to have any assigned practician, please contact the
          clinic
        </p>
      ) : (
        <AssignedPracticiansList
          assignedStaff={assignedStaff}
          handlePracticianChange={handlePracticianChange}
          practicianSelectedId={practicianSelectedId}
          staffInfos={clinic.staffInfos}
        />
      )}
      {practicianSelectedId && (
        <p className="new-appointments-disclaimer">
          Those time slots are automatically generated, if you want another time
          slots please call the clinic
        </p>
      )}
      {practicianSelectedId && availability && appointmentsInRange && (
        <AppointmentsSlots
          availability={availability}
          appointmentsInRange={appointmentsInRange}
          practicianSelectedId={practicianSelectedId}
          staffInfos={clinic.staffInfos}
          rangeStart={rangeStart}
          setAppointmentSelected={setAppointmentSelected}
          appointmentSelected={appointmentSelected}
        />
      )}
      {practicianSelectedId && (
        <>
          <WeekPicker
            handleClickNext={handleClickNext}
            handleClickPrevious={handleClickPrevious}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
          />

          <div className="new-appointments-submit">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </>
      )}
      {requestSent && (
        <p className="new-appointments-confirm">
          Your request has been sent,{" "}
          <strong>
            Please wait for a secretary to confirm the appointment with{" "}
            {staffIdToTitle(clinic.staffInfos, practicianSelectedId) +
              staffIdToName(clinic.staffInfos, practicianSelectedId)}
          </strong>
        </p>
      )}
    </div>
  );
};

export default NewAppointment;
