import React from "react";
import axiosXanoPatient from "../../../api/xanoPatient";
import useAuth from "../../../hooks/useAuth";
import { toLocalDateAndTime } from "../../../utils/formatDates";
import { toast } from "react-toastify";
import { confirmAlert } from "../../Confirm/ConfirmGlobal";
import { filterAndSortExternalMessages } from "../../../utils/filterAndSortExternalMessages";
import { patientIdToName } from "../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const MessagePatientThumbnail = ({
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
    if (user.unreadNbr !== 0) {
      const newUnreadNbr = user.unreadNbr - 1;
      setUser({
        ...user,
        unreadNbr: newUnreadNbr,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          unreadNbr: newUnreadNbr,
        })
      );
    }
    setCurrentMsgId(message.id);

    if (message.read_by_patient_id !== user.id) {
      //create and replace message with read by user id
      try {
        const newMessage = {
          ...message,
          read_by_patient_id: user.id,
        };
        await axiosXanoPatient.put(
          `/messages_external/${message.id}`,
          newMessage,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response = await axiosXanoPatient.get(
          `/messages_external_for_patient?patient_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        const newMessages = filterAndSortExternalMessages(
          section,
          response.data,
          "patient",
          user.id
        );
        setMessages(newMessages);
      } catch (err) {
        toast.error(`Error: unable to get messages: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const THUMBNAIL_STYLE = {
    fontWeight: message.read_by_patient_id !== user.id ? "bold" : "normal",
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
        await axiosXanoPatient.put(
          `/messages_external/${message.id}`,
          {
            ...message,
            deleted_by_patient_id: user.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        const response2 = await axiosXanoPatient.get(
          `/messages_external_for_patientf?patient_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const newMessages = filterAndSortExternalMessages(
          section,
          response2.data,
          "patient",
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
            ? message.from_user_type === "patient" //le from est un patient ou un staff
              ? patientIdToName(clinic.patientsInfos, message.from_id)
              : staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)
            : /*messages envoyés, le "To" est un staff*/
              staffIdToTitleAndName(clinic.staffInfos, message.to_id, true)}
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

export default MessagePatientThumbnail;
