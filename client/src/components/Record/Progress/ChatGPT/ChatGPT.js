import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { getAge } from "../../../../utils/getAge";
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
  const [lastResponse, setLastResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortController = useRef(null);

  return (
    <>
      {!chatVisible ? (
        <ChatGPTPrompt
          messages={messages}
          setMessages={setMessages}
          setChatVisible={setChatVisible}
          setLastResponse={setLastResponse}
          setIsLoading={setIsLoading}
          abortController={abortController}
        />
      ) : (
        <ChatGPTDiscussion
          messages={messages}
          setMessages={setMessages}
          lastResponse={lastResponse}
          setLastResponse={setLastResponse}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          abortController={abortController}
        />
      )}
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default ChatGPT;
