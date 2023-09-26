import React from "react";
import { toLocalDateAndTime } from "../../utils/formatDates";
import useAuth from "../../hooks/useAuth";
import { patientIdToName } from "../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../utils/staffIdToTitleAndName";

const MessageExternal = ({ message, index }) => {
  const { clinic } = useAuth();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message-title">
        <div className="message-title-author">
          From:{" "}
          {message.from_user_type === "staff"
            ? staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)
            : patientIdToName(clinic.patientsInfos, message.from_id)}
        </div>
        <div className="message-title-date">
          <div>{toLocalDateAndTime(message.date_created)}</div>
        </div>
      </div>
      <div className="message-subtitle">
        to:{" "}
        {message.to_user_type === "staff"
          ? staffIdToTitleAndName(clinic.staffInfos, message.to_id, true)
          : patientIdToName(clinic.patientsInfos, message.to_id)}
      </div>
      <div className="message-body">{message.body}</div>
    </div>
  );
};

export default MessageExternal;
