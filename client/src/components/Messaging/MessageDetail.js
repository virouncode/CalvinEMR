import React, { useEffect, useState } from "react";
import Message from "./Message";
import ReplyForm from "./ReplyForm";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import NewWindow from "react-new-window";
import ForwardForm from "./ForwardForm";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";
import { patientIdToName } from "../../utils/patientIdToName";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";
import { NavLink } from "react-router-dom";

const MessageDetail = ({
  setCurrentMsgId,
  message,
  setMessages,
  setSection,
  section,
}) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const { auth, user, clinic } = useAuth();
  const [previousMsgs, setPreviousMsgs] = useState(null);
  const patient = clinic.patientsInfos.find(
    ({ id }) => id === message.related_patient_id
  );
  useEffect(() => {
    const fetchPreviousMsgs = async () => {
      const response = await axios.post(
        "/messages_selected",
        { messages_ids: message.previous_ids },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPreviousMsgs(
        response.data.sort((a, b) => b.date_created - a.date_created)
      );
    };
    fetchPreviousMsgs();
  }, [auth.authToken, user.id, message.previous_ids]);

  const handleClickBack = (e) => {
    setCurrentMsgId(0);
  };

  const handleDeleteMsg = async (e) => {
    try {
      await axios.put(
        `/messages/${message.id}`,
        {
          ...message,
          deleted_by_ids: [...message.deleted_by_ids, user.id],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const response2 = await axios.get(`/messages?staff_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      const newMessages = filterAndSortMessages(
        section,
        response2.data,
        user.id
      );
      setMessages(newMessages);
      setCurrentMsgId(0);
      toast.success("Message deleted successfully", { containerId: "A" });
    } catch (err) {
      console.log(err);
      toast.error("Couldn't delete the message", { containerId: "A" });
    }
  };

  const handleClickReply = (e) => {
    setReplyVisible(true);
    setAllPersons(false);
  };
  const handleClickReplyAll = (e) => {
    setReplyVisible(true);
    setAllPersons(true);
  };

  const handleClickTransfer = (e) => {
    setForwardVisible(true);
  };

  return (
    <>
      <div className="message-detail-toolbar">
        <i
          className="fa-solid fa-arrow-left message-detail-toolbar-arrow"
          style={{ cursor: "pointer" }}
          onClick={handleClickBack}
        ></i>
        <div className="message-detail-toolbar-subject">{message.subject}</div>
        <div className="message-detail-toolbar-patient">
          {patient && (
            <NavLink
              to={`/patient-record/${patient.id}`}
              className="message-detail-toolbar-patient-link"
            >
              {patient.full_name}
            </NavLink>
          )}
        </div>
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-detail-toolbar-trash"
            onClick={handleDeleteMsg}
          ></i>
        )}
      </div>
      <div className="message-detail-content">
        <Message
          message={message}
          author={staffIdToName(clinic.staffInfos, message.from_id)}
          authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
          key={message.id}
          index={0}
        />
        {previousMsgs &&
          previousMsgs.map((message, index) => (
            <Message
              message={message}
              author={staffIdToName(clinic.staffInfos, message.from_id)}
              authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
              key={message.id}
              index={index + 1}
            />
          ))}
      </div>
      {replyVisible && (
        <ReplyForm
          setReplyVisible={setReplyVisible}
          allPersons={allPersons}
          message={message}
          previousMsgs={previousMsgs}
          setMessages={setMessages}
          section={section}
          patient={patient}
        />
      )}
      {section !== "Deleted messages" && (
        <div className="message-detail-btns">
          {section !== "Sent messages" && (
            <button onClick={handleClickReply} disabled={replyVisible}>
              Reply
            </button>
          )}
          {message.to_ids.length >= 2 && section !== "Sent messages" && (
            <button onClick={handleClickReplyAll} disabled={replyVisible}>
              Reply all
            </button>
          )}
          <button onClick={handleClickTransfer} disabled={forwardVisible}>
            Forward
          </button>
        </div>
      )}
      {forwardVisible && (
        <NewWindow
          title="Forward Discussion"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 1000,
            height: 500,
            left: 0,
            top: 0,
          }}
          onUnload={() => setForwardVisible(false)}
        >
          <ForwardForm
            setForwardVisible={setForwardVisible}
            setMessages={setMessages}
            section={section}
            message={message}
            previousMsgs={previousMsgs}
            patient={patient}
          />
        </NewWindow>
      )}
    </>
  );
};

export default MessageDetail;
