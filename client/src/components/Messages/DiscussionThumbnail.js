import React, { useEffect, useState } from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import formatName from "../../utils/formatName";
import { NavLink } from "react-router-dom";
import { toLocalDateAndTime } from "../../utils/formatDates";

const DiscussionThumbnail = ({
  discussion,
  messages,
  setCurrentDiscussionId,
  staffInfos,
  setMessages,
}) => {
  const { auth } = useAuth();
  const [patient, setPatient] = useState({});
  console.log("render discussion thumbnail");

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get(
        `patients/${discussion.related_patient_id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPatient(response.data);
    };
    fetchPatient();
  }, [auth?.authToken, discussion.related_patient_id]);

  const handleDiscussionClick = async (e) => {
    setCurrentDiscussionId(discussion.id);
    //all messages read by userId
    for (let message of messages) {
      if (!message.read_by_ids.includes(auth.userId)) {
        //create message to update
        const newMessage = {
          ...message,
          read_by_ids: [...message.read_by_ids, auth.userId],
        };
        await axios.put(`/messages/${message.id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${auth?.authToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    }
    //update messages
    const response = await axios.get(`/messages?staff_id=${auth.userId}`, {
      headers: {
        Authorization: `Bearer ${auth?.authToken}`,
        "Content-Type": "application/json",
      },
    });
    setMessages(response.data);
  };

  const THUMBNAIL_STYLE = {
    fontWeight: messages.slice(-1)[0].read_by_ids.includes(auth.userId)
      ? "normal"
      : "bold",
  };

  return (
    staffInfos && (
      <div className="discussion-thumbnail" style={THUMBNAIL_STYLE}>
        <input className="discussion-thumbnail-checkbox" type="checkbox" />
        <div
          onClick={handleDiscussionClick}
          className="discussion-thumbnail-link"
        >
          <div className="discussion-thumbnail-persons">
            {staffInfos.find(({ id }) => id === messages[0].from_id).title ===
            "Doctor"
              ? "Dr. "
              : ""}
            {formatName(
              staffInfos.find(({ id }) => id === messages[0].from_id).full_name
            )}
            ,{" "}
            {discussion.staff_ids
              .filter(
                (staff_id) =>
                  staff_id !== auth.userId && staff_id !== messages[0].from_id
              )
              .map(
                (staff_id) =>
                  (staffInfos.find(({ id }) => id === staff_id).title ===
                  "Doctor"
                    ? "Dr. "
                    : "") +
                  formatName(
                    staffInfos.find(({ id }) => id === staff_id).full_name
                  )
              )
              .join(" ,")}
          </div>
          <div className="discussion-thumbnail-sample">
            <span>{discussion.subject}</span> - {messages.slice(-1)[0].body}
          </div>
        </div>
        <div className="discussion-thumbnail-patient">
          <NavLink
            to={`/patient-record/${patient.id}`}
            className="discussion-thumbnail-patient-link"
          >
            {patient.full_name}
          </NavLink>
        </div>
        <div className="discussion-thumbnail-date">
          {toLocalDateAndTime(messages.slice(-1)[0].date_created)}
        </div>
      </div>
    )
  );
};

export default DiscussionThumbnail;
