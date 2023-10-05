import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { sendMsgToOpenAI } from "../../../../api/openapi";
import ChatGPTDiscussionContent from "./ChatGPTDiscussionContent";

const ChatGPTDiscussion = ({
  messages,
  setMessages,
  lastResponse,
  setLastResponse,
  isLoading,
  setIsLoading,
  abortController,
}) => {
  const msgEndRef = useRef(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    msgEndRef.current.scrollIntoView();
  }, [lastResponse]);

  const handleChangeInput = (e) => {
    setInputText(e.target.value);
  };
  const handleAskGPT = async () => {
    const text = inputText;
    setInputText("");
    const updatedMessages = [...messages];
    updatedMessages.push({ role: "user", content: text });
    setMessages(updatedMessages);
    updatedMessages.push({ role: "assistant", content: "" });
    try {
      setIsLoading(true);
      abortController.current = new AbortController();
      const stream = await sendMsgToOpenAI(
        [...messages, { role: "user", content: text }],
        abortController.current
      );
      for await (const part of stream) {
        updatedMessages[updatedMessages.length - 1].content +=
          part.choices[0]?.delta?.content || "";
        setMessages(updatedMessages);
        setLastResponse((r) => r + (part.choices[0]?.delta?.content || ""));
      }
      setIsLoading(false);
    } catch (err) {
      toast.error(`ChatGPT is down: ${err.message}`, { containerId: "B" });
    }
  };
  return (
    <div className="chatgpt-discussion">
      <h2 className="chatgpt-discussion-title">Discussion</h2>
      <ChatGPTDiscussionContent
        messages={messages}
        msgEndRef={msgEndRef}
        lastResponse={lastResponse}
      />
      <button
        className="chatgpt-discussion-stop-btn"
        onClick={() => abortController.current.abort()}
      >
        Stop generating
      </button>
      <textarea
        className="chatgpt-discussion-textarea"
        onChange={handleChangeInput}
        value={inputText}
        autoFocus
      />
      <button
        onClick={handleAskGPT}
        className="chatgpt-discussion-send-btn"
        disabled={isLoading}
      />
    </div>
  );
};

export default ChatGPTDiscussion;
