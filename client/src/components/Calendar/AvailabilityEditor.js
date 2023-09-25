import React, { useEffect, useState } from "react";
import AvailabilityItem from "./AvailabilityItem";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import DurationPicker from "../Pickers/DurationPicker";
import { availabilitySchema } from "../../validation/availabilityValidation";

const AvailabilityEditor = ({ setEditVisible }) => {
  const { auth, user } = useAuth();
  const [scheduleMorning, setScheduleMorning] = useState(null);
  const [scheduleAfternoon, setScheduleAfternoon] = useState(null);
  const [unavailability, setUnavailability] = useState(null);
  const [availabilityId, setAvailabilityId] = useState(0);
  const [defaultDurationHours, setDefaultDurationHours] = useState(1);
  const [defaultDurationMin, setDefaultDurationMin] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAvailability = async () => {
      try {
        const response = await axiosXano.get(
          `/availability_for_staff?staff_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setScheduleMorning(response.data.schedule_morning);
        setScheduleAfternoon(response.data.schedule_afternoon);
        setUnavailability(response.data.unavailability);
        setAvailabilityId(response.data.id);
        setDefaultDurationHours(response.data.default_duration_hours);
        setDefaultDurationMin(response.data.default_duration_min);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch your availability: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchAvailability();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    const datasToPost = {
      staff_id: user.id,
      schedule_morning: scheduleMorning,
      schedule_afternoon: scheduleAfternoon,
      unavailability: unavailability,
      default_duration_hours: defaultDurationHours,
      default_duration_min: defaultDurationMin,
      date_created: Date.now(),
    };
    try {
      await availabilitySchema.validate(datasToPost);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    try {
      await axiosXano.put(`/availability/${availabilityId}`, datasToPost, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setEditVisible(false);
      toast.success("Availability saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to save availability : ${err.message}`, {
        containerId: "A",
      });
    }
  };
  const handleStartMorningChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleMorningUpdated = { ...scheduleMorning };
    scheduleMorningUpdated[day][0][name] = value;
    setScheduleMorning(scheduleMorningUpdated);
  };
  const handleEndMorningChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleMorningUpdated = { ...scheduleMorning };
    scheduleMorningUpdated[day][1][name] = value;
    setScheduleMorning(scheduleMorningUpdated);
  };

  const handleStartAfternoonChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleAfternoonUpdated = { ...scheduleAfternoon };
    scheduleAfternoonUpdated[day][0][name] = value;
    setScheduleAfternoon(scheduleAfternoonUpdated);
  };
  const handleEndAfternoonChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleAfternoonUpdated = { ...scheduleAfternoon };
    scheduleAfternoonUpdated[day][1][name] = value;
    setScheduleAfternoon(scheduleAfternoonUpdated);
  };
  const handleCheck = (e, day) => {
    const checked = e.target.checked;
    let unavailabilityUpdated = { ...unavailability };
    if (checked) {
      unavailabilityUpdated[day] = true;
    } else {
      unavailabilityUpdated[day] = false;
    }
    setUnavailability(unavailabilityUpdated);
  };
  const handleDurationHoursChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    if (value === "") value = 0;
    setDefaultDurationHours(parseInt(value));
  };
  const handleDurationMinChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    if (value === "") value = 0;
    setDefaultDurationMin(parseInt(value));
  };

  return (
    scheduleAfternoon &&
    scheduleMorning &&
    unavailability && (
      <div>
        {errMsg && <p className="availability-err">{errMsg}</p>}
        <div className="availability-heads">
          <p>Morning</p>
          <p>Afternoon</p>
        </div>
        <form className="availability-form" onSubmit={handleSubmit}>
          {days.map((day) => (
            <AvailabilityItem
              day={day}
              handleStartMorningChange={handleStartMorningChange}
              handleEndMorningChange={handleEndMorningChange}
              handleStartAfternoonChange={handleStartAfternoonChange}
              handleEndAfternoonChange={handleEndAfternoonChange}
              handleCheck={handleCheck}
              scheduleMorning={scheduleMorning[day]}
              scheduleAfternoon={scheduleAfternoon[day]}
              unavailable={unavailability[day]}
              key={day}
            />
          ))}
          <div className="availability-form-duration">
            <p>Default Appointment Duration</p>
            <DurationPicker
              durationHours={defaultDurationHours.toString()}
              durationMin={defaultDurationMin.toString()}
              handleDurationHoursChange={handleDurationHoursChange}
              handleDurationMinChange={handleDurationMinChange}
              disabled={false}
              title={false}
            />
          </div>
          <div className="availability-form-btn">
            <input type="submit" value="Save" />
          </div>
        </form>
      </div>
    )
  );
};

export default AvailabilityEditor;
