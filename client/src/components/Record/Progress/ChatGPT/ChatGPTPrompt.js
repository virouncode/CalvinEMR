import React from "react";
import { toast } from "react-toastify";
import { sendMsgToOpenAI } from "../../../../api/openapi";

const ChatGPTPrompt = ({
  messages,
  setMessages,
  setChatVisible,
  setLastResponse,
  setIsLoading,
  abortController,
}) => {
  const handleChange = (e) => {
    setMessages([{ role: "user", content: e.target.value }]);
  };
  const handleSubmit = async () => {
    const updatedMessages = [...messages];
    setChatVisible(true);
    updatedMessages.push({ role: "assistant", content: "" });
    try {
      setIsLoading(true);
      abortController.current = new AbortController();
      const stream = await sendMsgToOpenAI(messages, abortController.current);
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
    <div className="chatgpt-prompt">
      <h2 className="chatgpt-prompt-title">Prepare prompt to ChatGPT</h2>
      <textarea
        className="chatgpt-prompt-textarea"
        onChange={handleChange}
        value={messages[0].content}
      />
      <div className="chatgpt-prompt-btns">
        <button>Add attachments datas</button>
        <button>Add documents datas</button>
        <button onClick={handleSubmit}>Submit to ChatGPT</button>
      </div>
    </div>
  );
};

export default ChatGPTPrompt;
