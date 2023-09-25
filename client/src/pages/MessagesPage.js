import React, { useState } from "react";
import Messages from "../components/Messaging/Messages";
import MessagesExternal from "../components/Messaging/MessagesExternal";
import { useParams } from "react-router-dom";
import MessagingToggle from "../components/Messaging/MessagingToggle";
import { Helmet } from "react-helmet";

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
