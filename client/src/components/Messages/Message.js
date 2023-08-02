import React from "react";
import { toLocalDateAndTime } from "../../utils/formatDates";
import formatName from "../../utils/formatName";

const Message = ({ message, author, authorTitle, discussion, staffInfos }) => {
  return (
    <div className="message">
      <div className="message-title">
        <div className="message-title-author">
          {authorTitle}
          {formatName(author)}
        </div>
        <div className="message-title-date">
          <div>{toLocalDateAndTime(message.date_created)}</div>
        </div>
      </div>
      <div className="message-subtitle">
        to:{" "}
        {discussion.participants_ids
          .filter((staff_id) => staff_id !== message.from_id)
          .map(
            (staff_id) =>
              (staffInfos.find(({ id }) => id === staff_id).title === "Doctor"
                ? "Dr. "
                : "") +
              formatName(staffInfos.find(({ id }) => id === staff_id).full_name)
          )
          .join(", ")}
      </div>
      <div className="message-body">{message.body}</div>
    </div>
  );
};

export default Message;
