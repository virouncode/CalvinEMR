import React, { useEffect, useRef, useState } from "react";
import { sendMsgToOpenAI } from "../../../../api/openapi";
import sendIcon from "../../../../assets/img/sendIcon.png";
import ChatGPTDiscussionContent from "./ChatGPTDiscussionContent";

const ChatGPTDiscussion = ({ firstMessage, firstResponse }) => {
  const msgEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { content: firstMessage, role: "user" },
    { content: firstResponse, role: "assistant" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptText, setPromptText] = useState("");

  useEffect(() => {
    msgEndRef.current.scrollIntoView();
  }, [messages]);

  const handleChangePrompt = (e) => {
    setPromptText(e.target.value);
  };
  const handleAskGPT = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };
  return (
    <div className="chatgpt-discussion">
      <h2 className="chatgpt-discussion-title">Discussion</h2>
      <ChatGPTDiscussionContent
        messages={messages}
        msgEndRef={msgEndRef}
        isLoading={isLoading}
      />
      <textarea
        className="chatgpt-discussion-textarea"
        onChange={handleChangePrompt}
        value={promptText}
        autoFocus
      />
      <button className="chatgpt-discussion-btn">
        <img
          src={sendIcon}
          alt="send-icon"
          onClick={handleAskGPT}
          className="chatgpt-discussion-sendicon"
        />
      </button>
    </div>
  );
};

export default ChatGPTDiscussion;
