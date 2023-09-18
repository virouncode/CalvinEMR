import React from "react";
import { CircularProgress } from "@mui/material";
import { toLocalDate } from "../../../../utils/formatDates";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const MessagesContent = ({ datas, isLoading, errMsg }) => {
  const { user } = useAuth();

  const getSection = (message) => {
    if (message.deleted_by_staff_ids.includes(user.id)) {
      return "Deleted messages";
    } else if (message.from_id === user.id) {
      //et le cas forward ???
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
            message.from_id === user.id ||
            message.to_staff_ids.includes(user.id)
        ).length >= 1 ? (
          <ul className="patient-messages-content-list">
            {datas
              .filter(
                (message) =>
                  message.from_id === user.id ||
                  message.to_staff_ids.includes(user.id)
              )
              .sort((a, b) => b.date_created - a.date_created)
              .map((message) => (
                <li className="patient-messages-content-item" key={message.id}>
                  <div className="patient-messages-content-item-overview">
                    <NavLink
                      className="patient-messages-content-item-link"
                      to={`/messages/${message.id}/${getSection(
                        message
                      )}/Internal`}
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
                      )}/Internal`}
                      target="_blank"
                    >
                      {toLocalDate(message.date_created)}
                    </NavLink>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          "No messages about patient"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MessagesContent;
