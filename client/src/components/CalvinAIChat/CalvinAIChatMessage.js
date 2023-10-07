import React from "react";

const CalvinAIChatMessage = ({ role, message }) => {
  return (
    <div
      className="calvinai-chat-content-card"
      style={{ background: role === "user" ? "#FEFEFE" : "rgb(224 224 224)" }}
    >
      {role === "user" ? (
        <div className="calvinai-chat-content-card-img-user" />
      ) : (
        <div className="calvinai-chat-content-card-img-bot" />
      )}
      <p className="calvinai-chat-content-card-message">{message.content}</p>
    </div>
  );
};

export default CalvinAIChatMessage;
