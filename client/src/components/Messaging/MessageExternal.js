import React from "react";
import { toLocalDateAndTime } from "../../utils/formatDates";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import useAuth from "../../hooks/useAuth";
import formatName from "../../utils/formatName";
import { patientIdToName } from "../../utils/patientIdToName";

const MessageExternal = ({ message, author, authorTitle, index }) => {
  const { clinic } = useAuth();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message-title">
        <div className="message-title-author">
          {authorTitle}
          {author}
        </div>
        <div className="message-title-date">
          <div>{toLocalDateAndTime(message.date_created)}</div>
        </div>
      </div>
      <div className="message-subtitle">
        to:{" "}
        {message.to_id.user_type === "staff"
          ? staffIdToTitle(clinic.staffInfos, message.to_id.id) +
            formatName(staffIdToName(clinic.staffInfos, message.to_id.id))
          : patientIdToName(clinic.patientsInfos, message.to_id.id)}
      </div>
      <div className="message-body">{message.body}</div>
    </div>
  );
};

export default MessageExternal;
