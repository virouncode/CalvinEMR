import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import MessagesExternal from "../components/Messaging/External/MessagesExternal";
import Messages from "../components/Messaging/Internal/Messages";
import MessagingToggle from "../components/Messaging/MessagingToggle";

const MessagesPage = () => {
  const { msgType } = useParams();
  const [msgsType, setMsgsType] = useState(msgType || "Internal");
  const isTypeChecked = (type) => {
    return type === msgsType ? true : false;
  };
  const handleMsgsTypeChanged = (e) => {
    const name = e.target.name;
    setMsgsType(name);
  };
  return (
    <main className="messages">
      <Helmet>
        <title>Calvin EMR Messages</title>
      </Helmet>
      <MessagingToggle
        isTypeChecked={isTypeChecked}
        handleMsgsTypeChanged={handleMsgsTypeChanged}
      />
      {msgsType === "Internal" ? <Messages /> : <MessagesExternal />}
    </main>
  );
};

export default MessagesPage;
