//Libraries
import React, { useEffect, useState } from "react";
//Components
import MessagesLeftBar from "./MessagesLeftBar";
//Utils
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { staffIdToName } from "../../utils/staffIdToName";
import { filterAndSortExternalMessages } from "../../utils/filterAndSortExternalMessages";
import MessagesExternalToolBar from "./MessagesExternalToolbar";
import MessagesExternalBox from "./MessagesExternalBox";
import { patientIdToName } from "../../utils/patientIdToName";

const MessagesExternal = () => {
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
    console.log("fetchMessages");
    const fetchMessages = async () => {
      try {
        const response = await axiosXano.get(
          `/messages_external_for_staff?staff_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );

        if (abortController.signal.aborted) return;

        //En fonction de la section on filtre les messages
        let newMessages = filterAndSortExternalMessages(
          sectionName || section,
          response.data,
          "staff"
        );
        //FILTER HERE SEARCH
        newMessages = newMessages.filter((message) =>
          message.from_id.user_type === "staff"
            ? staffIdToName(clinic.staffInfos, message.from_id.id)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              patientIdToName(clinic.patientsInfos, message.to_id.id)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              message.subject.toLowerCase().includes(search.toLowerCase()) ||
              message.body.toLowerCase().includes(search.toLowerCase())
            : patientIdToName(clinic.patientsInfos, message.from_id.id)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              staffIdToName(clinic.staffInfos, message.to_id.id)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              message.subject.toLowerCase().includes(search.toLowerCase()) ||
              message.body.toLowerCase().includes(search.toLowerCase())
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
    clinic.patientsInfos,
    clinic.staffInfos,
    search,
    section,
    sectionName,
    user.id,
  ]);

  return (
    <div className="messages-container">
      <MessagesExternalToolBar
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
          msgType="external"
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
        />
        <MessagesExternalBox
          section={section}
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

export default MessagesExternal;
