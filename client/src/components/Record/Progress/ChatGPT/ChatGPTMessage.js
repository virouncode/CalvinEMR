import React from "react";
import botLogo from "../../../../assets/img/chatGPTLogo.png";
import doctorLogo from "../../../../assets/img/doctorLogo.png";

const ChatGPTMessage = ({ role, message }) => {
  return (
    <div
      className="chatgpt-discussion-content-card"
      style={{ background: role === "user" ? "#FEFEFE" : "#B2B2B2" }}
    >
      {role === "user" ? (
        <img
          className="chatgpt-discussion-content-card-img"
          src={doctorLogo}
          alt="doctor-avatar"
        />
      ) : (
        <img
          className="chatgpt-discussion-content-card-img"
          src={botLogo}
          alt="chatGPT-avatar"
        />
      )}
      <p className="chatgpt-discussion-content-card-message">
        {message.content}
      </p>
    </div>
  );
};

export default ChatGPTMessage;
