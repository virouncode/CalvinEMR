import React from "react";
import { toast } from "react-toastify";
import { sendMsgToOpenAI } from "../../../../api/openapi";

const CalvinAIPrompt = ({
  messages,
  setMessages,
  setChatVisible,
  setLastResponse,
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
      abortController.current = new AbortController();
      const stream = await sendMsgToOpenAI(messages, abortController.current);
      for await (const part of stream) {
        updatedMessages[updatedMessages.length - 1].content +=
          part.choices[0]?.delta?.content || "";
        setMessages(updatedMessages);
        setLastResponse((r) => r + (part.choices[0]?.delta?.content || ""));
      }
    } catch (err) {
      toast.error(`CalvinAI is down: ${err.message}`, { containerId: "B" });
    }
  };
  return (
    <div className="calvinai-prompt">
      <h2 className="calvinai-prompt-title">
        Prepare prompt to CalvinAI <i className="fa-solid fa-robot"></i>
      </h2>
      <textarea
        className="calvinai-prompt-textarea"
        onChange={handleChange}
        value={messages[0].content}
      />
      <div className="calvinai-prompt-btns">
        <button>Add attachments datas</button>
        <button>Add documents datas</button>
        <button onClick={handleSubmit}>Submit to CalvinAI</button>
      </div>
    </div>
  );
};

export default CalvinAIPrompt;
