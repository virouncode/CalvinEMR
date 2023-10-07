import React, { useState } from "react";
import { Helmet } from "react-helmet";
import MessagesPatient from "../components/PatientPortal/MessagingPatient/MessagesPatient";
import FakeWindow from "../components/Presentation/FakeWindow";
import PatientAIAgreement from "../components/Presentation/PatientAIAgreement";
import useAuth from "../hooks/useAuth";

const PatientMessagesPage = () => {
  const { user } = useAuth();
  const [popUpVisible, setPopUpVisible] = useState(
    !user.demographics.ai_consent_read
  );
  return (
    <>
      <Helmet>
        <title>Calvin EMR Messages</title>
      </Helmet>
      <MessagesPatient />
      {popUpVisible && (
        <FakeWindow
          title="AI AGREEMENT"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="red"
          setPopUpVisible={setPopUpVisible}
        >
          <PatientAIAgreement
            patientInfos={user.demographics}
            setPopUpVisible={setPopUpVisible}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default PatientMessagesPage;
