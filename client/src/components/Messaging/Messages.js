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
import { useNavigate, useParams } from "react-router-dom";

const Messages = () => {
  //HOOKSs
  const { messageId, sectionName } = useParams();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(sectionName || "Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [messages, setMessages] = useState(null);
  const { auth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (messageId) {
      setCurrentMsgId(parseInt(messageId));
      navigate("/messages");
    }
  }, [messageId, navigate, setCurrentMsgId]);

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
        sectionName || section,
        response.data,
        user.id
      );
      setMessages(newMessages);
    };
    fetchMessages();
    return () => setMessages(null);
  }, [auth.authToken, user.id, section, sectionName]);

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
