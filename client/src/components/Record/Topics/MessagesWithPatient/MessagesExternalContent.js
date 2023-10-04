import { CircularProgress } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDate } from "../../../../utils/formatDates";

const MessagesExternalContent = ({ datas, isLoading, errMsg }) => {
  const { user } = useAuth();

  const getSection = (message) => {
    if (message.deleted_by_staff_id === user.id) {
      return "Deleted messages";
    } else if (
      message.from_user_type === "staff" &&
      message.from_id === user.id
    ) {
      return "Sent messages";
    } else {
      return "Inbox";
    }
  };
  return !isLoading ? (
    errMsg ? (
      <p className="patient-messages-content-err">{errMsg}</p>
    ) : (
      <div className="patient-messages-content">
        {datas &&
        datas.filter(
          (message) =>
            (message.from_id === user.id &&
              message.from_user_type === "staff") ||
            (message.to_id === user.id && message.to_user_type === "staff")
        ).length >= 1 ? (
          <ul className="patient-messages-content-list">
            {datas
              .filter(
                (message) =>
                  (message.from_id === user.id &&
                    message.from_user_type === "staff") ||
                  (message.to_id === user.id &&
                    message.to_user_type === "staff")
              )
              .sort((a, b) => b.date_created - a.date_created)
              .map((message) => (
                <li className="patient-messages-content-item" key={message.id}>
                  <div className="patient-messages-content-item-overview">
                    <NavLink
                      className="patient-messages-content-item-link"
                      to={`/messages/${message.id}/${getSection(
                        message
                      )}/External`}
                      target="_blank"
                    >
                      {message.subject} - {message.body}
                    </NavLink>
                  </div>
                  <div className="patient-messages-content-item-date">
                    <NavLink
                      className="patient-messages-content-item-link"
                      to={`/messages/${message.id}/${getSection(
                        message
                      )}/External`}
                      target="_blank"
                    >
                      {toLocalDate(message.date_created)}
                    </NavLink>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          "No messages with patient"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MessagesExternalContent;
