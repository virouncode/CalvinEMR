import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { toast } from "react-toastify";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";
import Message from "./Message";
import { findLastSenderId } from "../../utils/findLastSenderId";

const ReplyForm = ({
  setReplyVisible,
  allPersons,
  message,
  previousMsgs,
  setMessages,
  section,
  patient,
}) => {
  const { auth, user, clinic } = useAuth();
  const [body, setBody] = useState("");

  const handleCancel = (e) => {
    setReplyVisible(false);
  };
  const handleSend = async (e) => {
    const replyMessage = {
      from_id: user.id,
      to_ids: allPersons
        ? [...new Set([...message.to_ids, message.from_id])].filter(
            (staffId) => staffId !== user.id
          )
        : [message.from_id],
      read_by_ids: [user.id],
      subject: previousMsgs.length
        ? `Re ${previousMsgs.length + 1}: ${message.subject.slice(
            message.subject.indexOf(":") + 1
          )}`
        : `Re: ${message.subject}`,
      body: body,
      previous_ids: [...previousMsgs.map(({ id }) => id), message.id],
      related_patient_id: message.related_patient_id || 0,
      replied: false,
      date_created: Date.parse(new Date()),
    };
    try {
      await axios.post("/messages", replyMessage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const response = await axios.get(`/messages?staff_id=${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const newMessages = filterAndSortMessages(
        section,
        response.data,
        user.id
      );
      setMessages(newMessages);
      setReplyVisible(false);
      toast.success("Message sent successfully", { containerId: "A" });
    } catch (err) {
      console.log(err);
      toast.error("Message couldn't be sent", { containerId: "A" });
    }
  };

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  return (
    <div className="reply-form">
      <div className="reply-form-title">
        <p>
          To:{" "}
          {allPersons
            ? [...new Set([...message.to_ids, message.from_id])]
                .filter((staffId) => staffId !== user.id)
                .map(
                  (staffId) =>
                    staffIdToTitle(clinic.staffInfos, staffId) +
                    staffIdToName(clinic.staffInfos, staffId)
                )
                .join(", ")
            : staffIdToTitle(clinic.staffInfos, message.from_id) +
              staffIdToName(clinic.staffInfos, message.from_id)}
        </p>
      </div>
      <div className="reply-form-subject">
        Subject:{" "}
        {previousMsgs.length
          ? `Re ${previousMsgs.length + 1}: ${message.subject.slice(
              message.subject.indexOf(":") + 1
            )}`
          : `Re: ${message.subject}`}
      </div>

      {patient?.full_name && (
        <div className="reply-form-patient">
          About patient: {patient.full_name}
        </div>
      )}
      <div className="reply-form-body">
        <textarea value={body} onChange={handleChange}></textarea>
        <div className="reply-form-history">
          <Message
            message={message}
            author={staffIdToName(clinic.staffInfos, message.from_id)}
            authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
            key={message.id}
            index={0}
          />
          {previousMsgs.map((message, index) => (
            <Message
              message={message}
              author={staffIdToName(clinic.staffInfos, message.from_id)}
              authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
              key={message.id}
              index={index + 1}
            />
          ))}
        </div>
      </div>
      <div className="reply-form-btns">
        <button onClick={handleSend}>Send</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ReplyForm;
