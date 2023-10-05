import React from "react";

const ChatGPTMessage = ({ role, message }) => {
  return (
    <div
      className="chatgpt-discussion-content-card"
      style={{ background: role === "user" ? "#FEFEFE" : "rgb(224 224 224)" }}
    >
      {role === "user" ? (
        <div className="chatgpt-discussion-content-card-img-user" />
      ) : (
        <div className="chatgpt-discussion-content-card-img-bot" />
      )}
      <p className="chatgpt-discussion-content-card-message">
        {message.content}
      </p>
    </div>
  );
};

export default ChatGPTMessage;
