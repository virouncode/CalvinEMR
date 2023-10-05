import React, { useState } from "react";
import { getAge } from "../../../../utils/getAge";
import TypingDots from "../../../Presentation/TypingDots";
import ChatGPTDiscussion from "./ChatGPTDiscussion";
import ChatGPTPrompt from "./ChatGPTPrompt";

const ChatGPT = ({ attachments, initialBody, patientInfos }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: `Hello ChatGPT I'm a doctor.

My patient is a ${getAge(patientInfos.date_of_birth)} year-old ${
        patientInfos.gender_at_birth
      } with the following symptoms:
    
  ${initialBody}.
    
What is the diagnosis and what treatment would you suggest ?`,
      role: "user",
    },
  ]);

  return !chatVisible ? (
    <ChatGPTPrompt
      messages={messages}
      setMessages={setMessages}
      setChatVisible={setChatVisible}
    />
  ) : messages.length >= 2 ? (
    <ChatGPTDiscussion messages={messages} setMessages={setMessages} />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TypingDots />
    </div>
  );
};

export default ChatGPT;
