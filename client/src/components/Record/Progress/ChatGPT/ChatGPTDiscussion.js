import React, { useEffect, useRef, useState } from "react";
import ChatGPTDiscussionContent from "./ChatGPTDiscussionContent";
import sendIcon from "../../../../assets/img/sendIcon.png";
import { sendMsgToOpenAI } from "../../../../api/openapi";

const ChatGPTDiscussion = ({ firstMessage, firstResponse }) => {
  const msgEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { content: firstMessage, role: "user" },
    { content: firstResponse, role: "assistant" },
  ]);

  const [promptText, setPromptText] = useState("");

  useEffect(() => {
    msgEndRef.current.scrollIntoView();
  }, [messages]);

  const handleChangePrompt = (e) => {
    setPromptText(e.target.value);
  };
  const handleAskGPT = async () => {
    const text = promptText;
    setPromptText("");
    setMessages([...messages, { content: text, role: "user" }]);
    const response = await sendMsgToOpenAI([
      ...messages,
      { content: text, role: "user" },
    ]);
    setMessages([
      ...messages,
      { content: text, role: "user" },
      { content: response[0].message.content, role: "assistant" },
    ]);
  };
  return (
    <div className="chatgpt-discussion">
      <h2 className="chatgpt-discussion-title">Discussion</h2>
      <ChatGPTDiscussionContent messages={messages} msgEndRef={msgEndRef} />
      <textarea
        className="chatgpt-discussion-textarea"
        onChange={handleChangePrompt}
        value={promptText}
        autoFocus
      />
      <img
        className="chatgpt-discussion-sendicon"
        src={sendIcon}
        alt="send-icon"
        onClick={handleAskGPT}
      />
    </div>
  );
};

export default ChatGPTDiscussion;
