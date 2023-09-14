import React from "react";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toLocalDateAndTime } from "../../utils/formatDates";
import { toast } from "react-toastify";
import { confirmAlert } from "../Confirm/ConfirmGlobal";
import { filterAndSortExternalMessages } from "../../utils/filterAndSortExternalMessages";
import { patientIdToName } from "../../utils/patientIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";

const MessageExternalThumbnail = ({
  message,
  setMessages,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
}) => {
  const { auth, user, setUser, clinic } = useAuth();

  const handleMsgClick = async (e) => {
    //Remove one from the unread messages nbr counter
    if (user.unreadMessagesExternalNbr !== 0) {
      const newUnreadMessagesExternalNbr = user.unreadMessagesExternalNbr - 1;
      setUser({
        ...user,
        unreadMessagesExternalNbr: newUnreadMessagesExternalNbr,
        unreadNbr: user.unreadMessagesNbr + newUnreadMessagesExternalNbr,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          unreadMessagesExternalNbr: newUnreadMessagesExternalNbr,
          unreadNbr: user.unreadMessagesNbr + newUnreadMessagesExternalNbr,
        })
      );
    }
    setCurrentMsgId(message.id);

    if (!message.read_by_staff_id) {
      //create and replace message with read by user id
      try {
        const newMessage = {
          ...message,
          read_by_staff_id: user.id,
        };
        await axiosXano.put(`/messages_external/${message.id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        });
        const response = await axiosXano.get(
          `/messages_external_for_staff?staff_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setMessages(
          filterAndSortExternalMessages(
            section,
            response.data,
            "staff",
            user.id
          )
        );
      } catch (err) {
        toast.error(`Error: unable to get messages: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const THUMBNAIL_STYLE = {
    fontWeight: message.read_by_staff_id !== user.id ? "bold" : "normal",
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
    if (
      await confirmAlert({
        content: "Do you really want to remove this message ?",
      })
    ) {
      try {
        await axiosXano.put(
          `/messages_external/${message.id}`,
          {
            ...message,
            deleted_by_staff_id: user.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        const response = await axiosXano.get(
          `/messages_external_for_staff?staff_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const newMessages = filterAndSortExternalMessages(
          section,
          response.data,
          "staff",
          user.id
        );
        setMessages(newMessages);
        toast.success("Message deleted successfully", { containerId: "A" });
        setMsgsSelectedIds([]);
      } catch (err) {
        toast.error(`Error: unable to delete message: ${err.message}`, {
          containerId: "A",
        });
      }
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
      <div onClick={handleMsgClick} className="message-thumbnail-link-external">
        <div className="message-thumbnail-author-external">
          {section !== "Sent messages" //messages reçus ou effacés
            ? message.from_user_type === "patient" //le "From" est un patient ou un staff
              ? patientIdToName(clinic.patientsInfos, message.from_id)
              : staffIdToTitle(clinic.staffInfos, message.from_id) +
                staffIdToName(clinic.staffInfos, message.from_id)
            : /*messages envoyés, le "To" est forcément un patient*/
              patientIdToName(clinic.patientsInfos, message.to_id)}
        </div>
        <div className="message-thumbnail-sample-external">
          <span>{message.subject}</span> - {message.body}{" "}
          {message.attachments_ids.length !== 0 && (
            <i
              className="fa-solid fa-paperclip"
              style={{ marginLeft: "5px" }}
            ></i>
          )}
        </div>
      </div>
      <div className="message-thumbnail-date-external">
        {toLocalDateAndTime(message.date_created)}
      </div>
      <div className="message-thumbnail-logos">
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-thumbnail-trash"
            style={{ cursor: "pointer" }}
            onClick={handleDeleteMsg}
          ></i>
        )}
      </div>
    </div>
  );
};

export default MessageExternalThumbnail;
