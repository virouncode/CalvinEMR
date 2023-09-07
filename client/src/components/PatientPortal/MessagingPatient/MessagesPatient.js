//Libraries
import React, { useEffect, useState } from "react";
//Components
//Utils
import useAuth from "../../../hooks/useAuth";
import axiosXanoPatient from "../../../api/xanoPatient";
import { toast } from "react-toastify";
import { staffIdToName } from "../../../utils/staffIdToName";
import { filterAndSortExternalMessages } from "../../../utils/filterAndSortExternalMessages";
import { patientIdToName } from "../../../utils/patientIdToName";
import MessagesPatientToolBar from "./MessagesPatientToolbar";
import MessagesPatientLeftBar from "./MessagesPatientLeftBar";
import MessagesPatientBox from "./MessagesPatientBox";

const MessagesPatient = () => {
  //HOOKSs
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [messages, setMessages] = useState(null);
  const { auth, user, clinic } = useAuth();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectAllVisible, setSelectAllVisible] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMessages = async () => {
      try {
        const response = await axiosXanoPatient.get(
          `/messages_external_for_patient?patient_id=${user.id}`,
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
          section,
          response.data,
          "patient"
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
    user.id,
  ]);

  return (
    <div className="messages-container">
      <MessagesPatientToolBar
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
        selectAllVisible={selectAllVisible}
        setSelectAllVisible={setSelectAllVisible}
      />
      <div className="messages-section">
        <MessagesPatientLeftBar
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
        />
        <MessagesPatientBox
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

export default MessagesPatient;
