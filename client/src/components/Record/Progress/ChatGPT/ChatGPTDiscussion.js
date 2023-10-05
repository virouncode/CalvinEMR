import React, { useEffect, useRef, useState } from "react";
import { sendMsgToOpenAI } from "../../../../api/openapi";
import ChatGPTDiscussionContent from "./ChatGPTDiscussionContent";

const ChatGPTDiscussion = ({ messages, setMessages }) => {
  const msgEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    msgEndRef.current.scrollIntoView();
  }, [messages]);

  const handleChangeInput = (e) => {
    setInputText(e.target.value);
  };
  const handleAskGPT = async () => {
    setIsLoading(true);
    const text = inputText;
    setInputText("");
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
        onChange={handleChangeInput}
        value={inputText}
        autoFocus
      />
      <button
        onClick={handleAskGPT}
        className="chatgpt-discussion-btn"
        disabled={isLoading}
      />
    </div>
  );
};

export default ChatGPTDiscussion;
