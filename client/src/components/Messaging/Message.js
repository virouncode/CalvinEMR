import React from "react";
import { toLocalDateAndTime } from "../../utils/formatDates";
import useAuth from "../../hooks/useAuth";
import { patientIdToName } from "../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../utils/staffIdToTitleAndName";

const Message = ({ message, index }) => {
  const { clinic } = useAuth();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message-title">
        <div className="message-title-author">
          From:{" "}
          {staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)}
        </div>
        <div className="message-title-date">
          <div>{toLocalDateAndTime(message.date_created)}</div>
        </div>
      </div>
      <div className="message-subtitle">
        to:{" "}
        {message.type === "Internal"
          ? message.to_staff_ids
              .map((staff_id) =>
                staffIdToTitleAndName(clinic.staffInfos, staff_id, true)
              )
              .join(", ")
          : message.to_staff_id
          ? staffIdToTitleAndName(clinic.staffInfos, message.to_staff_id, true)
          : patientIdToName(clinic.patientsInfos, message.to_patient_id)}
      </div>
      <div className="message-body">{message.body}</div>
    </div>
  );
};

export default Message;
