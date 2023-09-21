import React, { useEffect, useState } from "react";
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
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-detail-toolbar-trash"
            onClick={handleDeleteMsg}
          ></i>
        )}
      </div>
      <div className="message-detail-content">
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