import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { ToastContainer, toast } from "react-toastify";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";
import Message from "./Message";
import formatName from "../../utils/formatName";
import { CircularProgress } from "@mui/material";
import MessagesAttachments from "./MessagesAttachments";
import { postPatientRecord } from "../../api/fetchRecords";

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
  const [attachments, setAttachments] = useState([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleCancel = (e) => {
    setReplyVisible(false);
  };
  const handleSend = async (e) => {
    try {
      let attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: attachments,
        })
      ).data;

      attach_ids = [...message.attachments_ids, ...attach_ids];

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
        attachments_ids: attach_ids,
        date_created: Date.parse(new Date()),
      };

      await axiosXano.post("/messages", replyMessage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const response = await axiosXano.get(`/messages?staff_id=${user.id}`, {
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
      toast.error(`Error: unable to send message: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .wav";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 20000000) {
        alert("The file is too large, please choose another one");
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result; // this is the content!
        try {
          const response = await axiosXano.post(
            "/upload/attachment",
            {
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          );
          setAttachments([
            ...attachments,
            {
              file: response.data,
              alias: file.name,
              date_created: Date.parse(new Date()),
              created_by_id: user.id,
            },
          ]); //meta, mime, name, path, size, type
          setIsLoadingFile(false);
        } catch (err) {
          toast.error(`Error: unable to load file: ${err.message}`, {
            containerId: "A",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  return (
    <div className="reply-form">
      <div className="reply-form-title">
        <p>
          <strong>To: </strong>
          {allPersons
            ? [...new Set([...message.to_ids, message.from_id])]
                .filter((staffId) => staffId !== user.id)
                .map(
                  (staffId) =>
                    staffIdToTitle(clinic.staffInfos, staffId) +
                    formatName(staffIdToName(clinic.staffInfos, staffId))
                )
                .join(", ")
            : staffIdToTitle(clinic.staffInfos, message.from_id) +
              formatName(staffIdToName(clinic.staffInfos, message.from_id))}
        </p>
      </div>
      <div className="reply-form-subject">
        <strong>Subject:</strong>
        {previousMsgs.length
          ? `\u00A0Re ${previousMsgs.length + 1}: ${message.subject.slice(
              message.subject.indexOf(":") + 1
            )}`
          : `\u00A0Re: ${message.subject}`}
      </div>

      {patient?.full_name && (
        <div className="reply-form-patient">
          <strong>About patient:</strong> {"\u00A0" + patient.full_name}
        </div>
      )}
      <div className="reply-form-attach">
        <strong>Attach files</strong>
        <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
        {attachments.map((attachment) => (
          <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
            {attachment.alias},
          </span>
        ))}
      </div>
      <div className="reply-form-body">
        <textarea value={body} onChange={handleChange}></textarea>
        <div className="reply-form-history">
          <Message
            message={message}
            author={formatName(
              staffIdToName(clinic.staffInfos, message.from_id)
            )}
            authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
            key={message.id}
            index={0}
          />
          {previousMsgs.map((message, index) => (
            <Message
              message={message}
              author={formatName(
                staffIdToName(clinic.staffInfos, message.from_id)
              )}
              authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
              key={message.id}
              index={index + 1}
            />
          ))}
        </div>
        <MessagesAttachments
          attachments={attachments}
          handleRemoveAttachment={handleRemoveAttachment}
          deletable={true}
          cardWidth="17%"
        />
      </div>
      <div className="reply-form-btns">
        <button onClick={handleSend} disabled={isLoadingFile}>
          Send
        </button>
        <button onClick={handleCancel}>Cancel</button>
        {isLoadingFile && (
          <CircularProgress size="1rem" style={{ margin: "5px" }} />
        )}
      </div>
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </div>
  );
};

export default ReplyForm;
