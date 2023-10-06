import React from "react";
import CalvinAIMessage from "./CalvinAIMessage";

const CalvinAIDiscussionContent = ({ messages, msgEndRef }) => {
  return (
    <div className="calvinai-discussion-content">
      {messages.map((message, i) => (
        <CalvinAIMessage role={message.role} key={i} message={message} />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default CalvinAIDiscussionContent;
