import React from "react";
import ChatGPTMessage from "./ChatGPTMessage";

const ChatGPTDiscussionContent = ({ messages, msgEndRef }) => {
  return (
    <div className="chatgpt-discussion-content">
      {messages.map((message, i) => (
        <ChatGPTMessage role={message.role} key={i} message={message} />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default ChatGPTDiscussionContent;
