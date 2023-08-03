import React from "react";
import { toLocalDateAndTime } from "../../utils/formatDates";
import formatName from "../../utils/formatName";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";

const Message = ({ message, author, authorTitle, discussion, staffInfos }) => {
  return (
    <div className="message">
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
              staffIdToTitle(staffInfos, staff_id) +
              staffIdToName(staffInfos, staff_id)
          )
          .join(", ")}
      </div>
      <div className="message-body">{message.body}</div>
    </div>
  );
};

export default Message;
