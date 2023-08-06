//Libraries
import React, { useEffect, useState } from "react";
//Components
import MessagesToolBar from "./MessagesToolBar";
import MessagesLeftBar from "./MessagesLeftBar";
import MessagesBox from "./MessagesBox";
//Utils
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";

const Messages = () => {
  //HOOKSs
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [messages, setMessages] = useState(null);
  const { user, auth } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`/messages?staff_id=${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      //En fonction de la section on filtre les messages
      const newMessages = filterAndSortMessages(
        section,
        response.data,
        user.id
      );
      setMessages(newMessages);
    };
    fetchMessages();
    return () => setMessages(null);
    //eslint-disable-next-line
  }, [auth.authToken, user.id, section]);

  return (
    <div className="messages-container">
      <MessagesToolBar
        search={search}
        setSearch={setSearch}
        newVisible={newVisible}
        setNewVisible={setNewVisible}
        section={section}
        setSection={setSection}
        msgsSelectedIds={msgsSelectedIds}
        setMsgsSelectedIds={setMsgsSelectedIds}
        currentMsgId={currentMsgId}
        messages={messages}
        setMessages={setMessages}
      />
      <div className="messages-section">
        <MessagesLeftBar
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
        />
        <MessagesBox
          section={section}
          search={search}
          newVisible={newVisible}
          setNewVisible={setNewVisible}
          setSection={setSection}
          msgsSelectedIds={msgsSelectedIds}
          setMsgsSelectedIds={setMsgsSelectedIds}
          currentMsgId={currentMsgId}
          setCurrentMsgId={setCurrentMsgId}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};

export default Messages;
