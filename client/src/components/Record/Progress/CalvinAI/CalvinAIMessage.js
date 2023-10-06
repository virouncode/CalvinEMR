import React from "react";

const CalvinAIMessage = ({ role, message }) => {
  return (
    <div
      className="calvinai-discussion-content-card"
      style={{ background: role === "user" ? "#FEFEFE" : "rgb(224 224 224)" }}
    >
      {role === "user" ? (
        <div className="calvinai-discussion-content-card-img-user" />
      ) : (
        <div className="calvinai-discussion-content-card-img-bot" />
      )}
      <p className="calvinai-discussion-content-card-message">
        {message.content}
      </p>
    </div>
  );
};

export default CalvinAIMessage;
