import React from "react";
import TypingDots from "../../../Presentation/TypingDots";
import ChatGPTMessage from "./ChatGPTMessage";

const ChatGPTDiscussionContent = ({ messages, msgEndRef, isLoading }) => {
  return (
    <div className="chatgpt-discussion-content">
      {messages.map((message, i) => (
        <ChatGPTMessage role={message.role} key={i} message={message} />
      ))}
      {isLoading && <TypingDots />}
      <div ref={msgEndRef}></div>
    </div>
  );
};

export default ChatGPTDiscussionContent;
