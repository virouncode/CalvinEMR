import React, { useEffect, useRef, useState } from "react";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";
import { confirmAlert } from "../Confirm/ConfirmGlobal";
import formatName from "../../utils/formatName";
import { patientIdToName } from "../../utils/patientIdToName";
import MessagesAttachments from "./MessagesAttachments";
import { filterAndSortExternalMessages } from "../../utils/filterAndSortExternalMessages";
import MessageExternal from "./MessageExternal";
import ReplyFormExternal from "./ReplyFormExternal";
import NewWindow from "react-new-window";
import MessagesExternalPrintPU from "./MessagesExternalPrintPU";
import ForwardMessageExternal from "./ForwardMessageExternal";
import html2canvas from "html2canvas";
import { toLocalDateAndTimeWithSeconds } from "../../utils/formatDates";
import { postPatientRecord } from "../../api/fetchRecords";
import { NavLink } from "react-router-dom";

const MessageExternalDetail = ({
  setCurrentMsgId,
  message,
  setMessages,
  setSection,
  section,
  popUpVisible,
  setPopUpVisible,
}) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const { auth, user, clinic } = useAuth();
  const [previousMsgs, setPreviousMsgs] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messageContentRef = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPreviousMsgs = async () => {
      try {
        const response = await axiosXano.post(
          "/messages_external_selected",
          { messages_ids: message.previous_messages_ids },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setPreviousMsgs(
          response.data.sort((a, b) => b.date_created - a.date_created)
        );
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error: unable to fetch previous messages: ${err.message}`,
            { containerId: "A" }
          );
      }
    };
    fetchPreviousMsgs();
    return () => abortController.abort();
  }, [auth.authToken, message.previous_messages_ids]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAttachments = async () => {
      try {
        const response = (
          await axiosXano.post(
            "/attachments_for_message",
            { attachments_ids: message.attachments_ids },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          )
        ).data;
        if (abortController.signal.aborted) return;
        setAttachments(response);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch attachments: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchAttachments();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, message.attachments_ids]);

  const handleClickBack = (e) => {
    setCurrentMsgId(0);
  };

  const handleClickForward = (e) => {
    setForwardVisible(true);
  };

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this message ?",
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
        setMessages(
          filterAndSortExternalMessages(
            section,
            response.data,
            "staff",
            user.id
          )
        );
        setCurrentMsgId(0);
        toast.success("Message deleted successfully", { containerId: "A" });
      } catch (err) {
        toast.error(`Error: unable to delete message: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const handleClickReply = (e) => {
    setReplyVisible(true);
    setAllPersons(false);
  };

  const handleAddToProgressNotes = async () => {
    //create the attachment with message content
    const element = messageContentRef.current;
    const newContent = element.cloneNode(true);
    newContent.style.width = "210mm";
    window.document.body.append(newContent);
    const canvas = await html2canvas(newContent, {
      letterRendering: 1,
      useCORS: true,
    });
    window.document.body.removeChild(newContent);
    const dataURL = canvas.toDataURL("image/png");
    let fileToUpload = await axiosXano.post(
      "/upload/attachment",
      {
        content: dataURL,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
      }
    );
    //post attachment and get id
    const datasAttachment = [
      {
        file: fileToUpload.data,
        alias: `Message from: ${
          staffIdToTitle(clinic.staffInfos, message.from_id) +
          formatName(staffIdToName(clinic.staffInfos, message.from_id))
        } (${toLocalDateAndTimeWithSeconds(new Date(message.date_created))})`,
        date_created: Date.now(),
        created_by_id: user.id,
      },
    ];

    try {
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: datasAttachment,
        })
      ).data;
      await postPatientRecord("/progress_notes", user.id, auth.authToken, {
        patient_id:
          message.from_user_type === "patient"
            ? message.from_id
            : message.to_id,
        object: `Message from: ${
          message.from_user_type === "patient"
            ? patientIdToName(clinic.patientsInfos)
            : staffIdToTitle(clinic.staffInfos, message.from_id) +
              formatName(staffIdToName(clinic.staffInfos, message.from_id))
        } (${toLocalDateAndTimeWithSeconds(new Date(message.date_created))})`,
        body: "See attachment",
        version_nbr: 1,
        attachments_ids: attach_ids,
      });
      toast.success("Message successfuly added to patient progress notes", {
        containerId: "A",
      });
    } catch (err) {
      toast.error(
        `Unable to add message to patient progress notes: ${err.message}`,
        {
          containerId: "A",
        }
      );
    }
  };

  return (
    <>
      {popUpVisible && (
        <NewWindow
          title={`Message(s) / Subject: ${message.subject}`}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 793.7,
            height: 1122.5,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          <MessagesExternalPrintPU
            message={message}
            previousMsgs={previousMsgs}
            author={
              message.from_user_type === "staff"
                ? formatName(staffIdToName(clinic.staffInfos, message.from_id))
                : patientIdToName(clinic.patientsInfos, message.from_id)
            }
            authorTitle={
              message.from_user_type === "staff"
                ? staffIdToTitle(clinic.staffInfos, message.from_id)
                : ""
            }
            attachments={attachments}
          />
        </NewWindow>
      )}
      <div className="message-detail-toolbar">
        <i
          className="fa-solid fa-arrow-left message-detail-toolbar-arrow"
          style={{ cursor: "pointer" }}
          onClick={handleClickBack}
        ></i>
        <div className="message-detail-toolbar-subject">{message.subject}</div>
        <div className="message-detail-toolbar-patient">
          <NavLink
            to={`/patient-record/${
              message.from_user_type === "patient"
                ? message.from_id
                : message.to_id
            }`}
            className="message-detail-toolbar-patient-link"
          >
            {message.from_user_type === "patient"
              ? patientIdToName(clinic.patientsInfos, message.from_id)
              : patientIdToName(clinic.patientsInfos, message.to_id)}
          </NavLink>
          <button onClick={handleAddToProgressNotes}>
            Add message to patient progress notes
          </button>
        </div>
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-detail-toolbar-trash"
            onClick={handleDeleteMsg}
          ></i>
        )}
      </div>
      <div className="message-detail-content" ref={messageContentRef}>
        <MessageExternal
          message={message}
          author={
            message.from_user_type === "staff"
              ? formatName(staffIdToName(clinic.staffInfos, message.from_id))
              : patientIdToName(clinic.patientsInfos, message.from_id)
          }
          authorTitle={
            message.from_user_type === "staff"
              ? staffIdToTitle(clinic.staffInfos, message.from_id)
              : ""
          }
          key={message.id}
          index={0}
        />
        {previousMsgs &&
          previousMsgs.map((message, index) => (
            <MessageExternal
              message={message}
              author={
                message.from_user_type === "staff"
                  ? formatName(
                      staffIdToName(clinic.staffInfos, message.from_id)
                    )
                  : patientIdToName(clinic.patientsInfos, message.from_id)
              }
              authorTitle={
                message.from_user_type === "staff"
                  ? staffIdToTitle(clinic.staffInfos, message.from_id)
                  : ""
              }
              key={message.id}
              index={index + 1}
            />
          ))}
        <MessagesAttachments
          attachments={attachments}
          deletable={false}
          cardWidth="15%"
          addable={true}
          patientId={
            message.from_user_type === "patient"
              ? message.from_id
              : message.to_id
          }
        />
      </div>
      {replyVisible && (
        <ReplyFormExternal
          setReplyVisible={setReplyVisible}
          allPersons={allPersons}
          message={message}
          previousMsgs={previousMsgs}
          setMessages={setMessages}
          section={section}
          setCurrentMsgId={setCurrentMsgId}
        />
      )}
      {section !== "Deleted messages" && !replyVisible && (
        <div className="message-detail-btns">
          {section !== "Sent messages" && (
            <button onClick={handleClickReply}>Reply</button>
          )}
          <button onClick={handleClickForward}>Forward</button>
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
          <ForwardMessageExternal
            setForwardVisible={setForwardVisible}
            setMessages={setMessages}
            section={section}
            message={message}
            previousMsgs={previousMsgs}
          />
        </NewWindow>
      )}
    </>
  );
};

export default MessageExternalDetail;
