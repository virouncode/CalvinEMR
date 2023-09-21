import React from "react";
import { staffIdToTitle } from "../../../utils/staffIdToTitle";
import formatName from "../../../utils/formatName";
import { staffIdToName } from "../../../utils/staffIdToName";

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

const AppointmentSlotItem = ({
  appointment,
  staffInfos,
  setAppointmentSelected,
  appointmentSelected,
}) => {
  const handleCheck = (e) => {
    if (e.target.checked) setAppointmentSelected(appointment);
  };
  const isAppointmentSelected = (id) => appointmentSelected.id === id;
  return (
    <div key={appointment.id} className="new-appointments-content-item">
      <input
        type="checkbox"
        checked={isAppointmentSelected(appointment.id)}
        onChange={handleCheck}
      />
      <div className="new-appointments-content-item-date">
        <p>
          {new Date(appointment.start).toLocaleString("en-CA", optionsDate)}
        </p>
        <p>
          {new Date(appointment.start).toLocaleTimeString("en-CA", optionsTime)}{" "}
          - {new Date(appointment.end).toLocaleTimeString("en-CA", optionsTime)}
        </p>
      </div>
      <p>Reason : {appointment.reason}</p>
      <p>
        {staffIdToTitle(staffInfos, appointment.host_id) +
          formatName(staffIdToName(staffInfos, appointment.host_id))}
      </p>
    </div>
  );
};

export default AppointmentSlotItem;
