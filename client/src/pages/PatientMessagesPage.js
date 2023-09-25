import React from "react";
import MessagesPatient from "../components/PatientPortal/MessagingPatient/MessagesPatient";
import { Helmet } from "react-helmet";

const PatientMessagesPage = () => {
  return (
    <>
      <Helmet>
        <title>Calvin EMR Messages</title>
      </Helmet>
      <MessagesPatient />
    </>
  );
};

export default PatientMessagesPage;
