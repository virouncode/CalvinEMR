import React, { useState } from "react";
import { getAge } from "../../../../utils/getAge";
import ChatGPTPrompt from "./ChatGPTPrompt";
import ChatGPTDiscussion from "./ChatGPTDiscussion";

const ChatGPT = ({ attachments, initialBody, patientInfos }) => {
  const [promptText, setPromptText] = useState(
    `Hello ChatGPT I'm a doctor.

My patient is a ${getAge(patientInfos.date_of_birth)} year-old ${
      patientInfos.gender_at_birth
    } with the following symptoms:
  
${initialBody}.
  
What is the diagnosis and what treatment would you suggest ?`
  );
  const [firstBotRes, setFirstBotRes] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

  return !chatVisible ? (
    <ChatGPTPrompt
      promptText={promptText}
      setPromptText={setPromptText}
      setChatVisible={setChatVisible}
      setFirstBotRes={setFirstBotRes}
    />
  ) : (
    <ChatGPTDiscussion firstMessage={promptText} firstResponse={firstBotRes} />
  );
};

export default ChatGPT;
