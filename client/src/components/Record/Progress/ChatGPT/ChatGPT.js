import { LinearProgress } from "@mui/material";
import React, { useState } from "react";
import { getAge } from "../../../../utils/getAge";
import ChatGPTDiscussion from "./ChatGPTDiscussion";
import ChatGPTPrompt from "./ChatGPTPrompt";

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
  ) : firstBotRes ? (
    <ChatGPTDiscussion firstMessage={promptText} firstResponse={firstBotRes} />
  ) : (
    <LinearProgress />
  );
};

export default ChatGPT;
