import React from "react";
import { sendMsgToOpenAI } from "../../../../api/openapi";

const ChatGPTPrompt = ({ messages, setMessages, setChatVisible }) => {
  const handleChange = (e) => {
    setMessages([{ role: "user", content: e.target.value }]);
  };
  const handleSubmit = async () => {
    setChatVisible(true);
    const response = await sendMsgToOpenAI(messages);
    setMessages([
      ...messages,
      { role: "assistant", content: response[0].message.content },
    ]);
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
