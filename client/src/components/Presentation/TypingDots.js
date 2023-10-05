import React from "react";

const TypingDots = ({ text = "Please wait for ChatGPT..." }) => {
  return (
    <div className="typing">
      <div className="typing-progress">
        <div className="typing-progress-dot"></div>
        <div className="typing-progress-dot"></div>
        <div className="typing-progress-dot"></div>
      </div>
      <p className="typing-text">{text}</p>
    </div>
  );
};

export default TypingDots;
