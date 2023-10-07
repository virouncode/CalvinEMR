import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { getAge } from "../../../../utils/getAge";
import StaffAIAgreement from "../../../Presentation/StaffAIAgreement";
import CalvinAIDiscussion from "./CalvinAIDiscussion";
import CalvinAIPrompt from "./CalvinAIPrompt";

const CalvinAI = ({ attachments, initialBody, patientInfos }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [start, setStart] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: `Hello I'm a doctor.

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
        <CalvinAIPrompt
          messages={messages}
          setMessages={setMessages}
          setChatVisible={setChatVisible}
          setLastResponse={setLastResponse}
          setIsLoading={setIsLoading}
          abortController={abortController}
        />
      ) : start ? (
        <CalvinAIDiscussion
          messages={messages}
          setMessages={setMessages}
          lastResponse={lastResponse}
          setLastResponse={setLastResponse}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          abortController={abortController}
        />
      ) : (
        <StaffAIAgreement setStart={setStart} setChatVisible={setChatVisible} />
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

export default CalvinAI;
