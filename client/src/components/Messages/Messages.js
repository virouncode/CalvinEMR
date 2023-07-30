import React, { useState } from "react";
import MessagesToolBar from "./MessagesToolBar";
import MessagesLeftBar from "./MessagesLeftBar";
import MessagesBox from "./MessagesBox";

const Messages = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Inbox");

  return (
    <div className="messages-container">
      <MessagesToolBar search={search} setSearch={setSearch} />
      <div className="messages-section">
        <MessagesLeftBar category={category} setCategory={setCategory} />
        <MessagesBox category={category} search={search} />
      </div>
    </div>
  );
};

export default Messages;
