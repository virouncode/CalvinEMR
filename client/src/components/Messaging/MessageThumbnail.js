import React from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { toLocalDateAndTime } from "../../utils/formatDates";
import { toast } from "react-toastify";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdListToTitleAndName } from "../../utils/staffIdListToTitleAndName";

const MessageThumbnail = ({
  message,
  setMessages,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
}) => {
  const { auth, user, setUser, clinic } = useAuth();
  const patient = clinic.patientsInfos.find(
    ({ id }) => id === message.related_patient_id
  );

  const handleMsgClick = async (e) => {
    //Remove one from the unread messages nbr counter
    if (user.unreadMessagesNbr !== 0) {
      const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
      setUser({ ...user, unreadMessagesNbr: newUnreadMessagesNbr });
    }
    setCurrentMsgId(message.id);

    if (!message.read_by_ids.includes(user.id)) {
      //create and replace message with read by user id
      const newMessage = {
        ...message,
        read_by_ids: [...message.read_by_ids, user.id],
      };
      await axios.put(`/messages/${message.id}`, newMessage, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  };

  const THUMBNAIL_STYLE = {
    fontWeight:
      !message.read_by_ids.includes(user.id) && message.to_ids.includes(user.id)
        ? "bold"
        : "normal",
  };

  const handleCheckMsg = (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) {
      if (!msgsSelectedIds.includes(id)) {
        setMsgsSelectedIds([...msgsSelectedIds, id]);
      }
    } else {
      let msgsSelectedIdsUpdated = [...msgsSelectedIds];
      msgsSelectedIdsUpdated = msgsSelectedIdsUpdated.filter(
        (messageId) => messageId !== id
      );
      setMsgsSelectedIds(msgsSelectedIdsUpdated);
    }
  };

  const isMsgSelected = (id) => {
    return msgsSelectedIds.includes(parseInt(id));
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
      toast.success("Message deleted successfully", { containerId: "A" });
    } catch (err) {
      console.log(err);
      toast.error("Couldn't delete the message", { containerId: "A" });
    }
  };

  return (
    <div className="message-thumbnail" style={THUMBNAIL_STYLE}>
      <input
        className="message-thumbnail-checkbox"
        type="checkbox"
        id={message.id}
        checked={isMsgSelected(message.id)}
        onChange={handleCheckMsg}
      />
      <div onClick={handleMsgClick} className="message-thumbnail-link">
        <div className="message-thumbnail-author">
          {section !== "Sent messages"
            ? staffIdToTitle(clinic.staffInfos, message.from_id) +
              staffIdToName(clinic.staffInfos, message.from_id)
            : staffIdListToTitleAndName(clinic.staffInfos, message.to_ids)}
        </div>
        <div className="message-thumbnail-sample">
          <span>{message.subject}</span> - {message.body}
        </div>
      </div>
      <div className="message-thumbnail-patient">
        {patient && (
          <NavLink
            to={`/patient-record/${patient.id}`}
            className="message-thumbnail-patient-link"
          >
            {patient.full_name}
          </NavLink>
        )}
      </div>
      <div className="message-thumbnail-date">
        {toLocalDateAndTime(message.date_created)}
      </div>
      {section !== "Deleted messages" && (
        <i
          className="fa-solid fa-trash  message-thumbnail-trash"
          style={{ cursor: "pointer" }}
          onClick={handleDeleteMsg}
        ></i>
      )}
    </div>
  );
};

export default MessageThumbnail;
