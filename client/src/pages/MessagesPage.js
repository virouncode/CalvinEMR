import React, { useEffect, useState } from "react";
import Messages from "../components/Messaging/Messages";
import MessagesExternal from "../components/Messaging/MessagesExternal";
import { useParams } from "react-router-dom";

const MessagesPage = () => {
  const { msgType } = useParams();
  const [msgsType, setMsgsType] = useState(msgType || "Internal");
  // useEffect(() => {
  //   if (msgType) {
  //     setMsgsType(msgType);
  //   }
  // }, [msgType]);
  const isTypeChecked = (type) => {
    return type === msgsType ? true : false;
  };
  const handleMsgsTypeChanged = (e) => {
    const name = e.target.name;
    setMsgsType(name);
  };
  return (
    <main className="messages">
      <div className="messages-toggle">
        <div className="messages-toggle-radio">
          <input
            type="radio"
            value="Internal"
            name="Internal"
            checked={isTypeChecked("Internal")}
            onChange={handleMsgsTypeChanged}
          />
          <label>Internal</label>
        </div>
        <div className="messages-toggle-radio">
          <input
            type="radio"
            value="External"
            name="External"
            checked={isTypeChecked("External")}
            onChange={handleMsgsTypeChanged}
          />
          <label>External</label>
        </div>
      </div>
      {msgsType === "Internal" ? <Messages /> : <MessagesExternal />}
    </main>
  );
};

export default MessagesPage;
