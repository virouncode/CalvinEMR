//Libraries
import React, { useEffect, useState } from "react";
//Components
import MessagesToolBar from "./MessagesToolBar";
import MessagesLeftBar from "./MessagesLeftBar";
import MessagesBox from "./MessagesBox";
//Utils
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { staffIdToName } from "../../utils/staffIdToName";
import { patientIdToName } from "../../utils/patientIdToName";

const Messages = () => {
  //HOOKSs
  const { messageId, sectionName } = useParams();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(sectionName || "Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [messages, setMessages] = useState(null);
  const { auth, user, clinic } = useAuth();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (messageId) {
      setCurrentMsgId(parseInt(messageId));
      navigate("/messages");
    }
  }, [messageId, navigate, setCurrentMsgId]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMessages = async () => {
      try {
        const response = await axiosXano.get(`/messages?staff_id=${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        //En fonction de la section on filtre les messages
        let newMessages = filterAndSortMessages(
          sectionName || section,
          response.data,
          user.id
        );
        //FILTER HERE SEARCH
        newMessages = newMessages.filter(
          (message) =>
            staffIdToName(clinic.staffInfos, message.from_id)
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            message.to_ids
              .map((id) => staffIdToName(clinic.staffInfos, id))
              .join(", ")
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            message.subject.toLowerCase().includes(search.toLowerCase()) ||
            message.body.toLowerCase().includes(search.toLowerCase()) ||
            patientIdToName(clinic.patientsInfos, message.related_patient_id)
              .toLowerCase()
              .includes(search.toLowerCase())
        );

        setMessages(newMessages);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to get messages: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchMessages();
    return () => {
      abortController.abort();
      setMessages(null);
    };
  }, [
    auth.authToken,
    user.id,
    section,
    sectionName,
    search,
    clinic.staffInfos,
    clinic.patientsInfos,
  ]);

  const handlePrint = () => {};

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
        setPopUpVisible={setPopUpVisible}
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
          popUpVisible={popUpVisible}
          setPopUpVisible={setPopUpVisible}
        />
      </div>
    </div>
  );
};

export default Messages;
