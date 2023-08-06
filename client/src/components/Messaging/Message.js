import React from "react";
import { toLocalDateAndTime } from "../../utils/formatDates";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import useAuth from "../../hooks/useAuth";

const Message = ({ message, author, authorTitle, index }) => {
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
        {message.to_ids
          .map(
            (staff_id) =>
              staffIdToTitle(clinic.staffInfos, staff_id) +
              staffIdToName(clinic.staffInfos, staff_id)
          )
          .join(", ")}
      </div>
      <div className="message-body">{message.body}</div>
    </div>
  );
};

export default Message;
