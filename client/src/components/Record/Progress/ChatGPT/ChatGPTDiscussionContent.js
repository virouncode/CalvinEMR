import React from "react";
import ChatGPTMessage from "./ChatGPTMessage";
import { LinearProgress } from "@mui/material";

const ChatGPTDiscussionContent = ({ messages, msgEndRef, isLoading }) => {
  return (
    <div className="chatgpt-discussion-content">
      {messages.map((message, i) => (
        <ChatGPTMessage role={message.role} key={i} message={message} />
      ))}
      {isLoading && <LinearProgress />}
      <div ref={msgEndRef}></div>
    </div>
  );
};

export default ChatGPTDiscussionContent;
