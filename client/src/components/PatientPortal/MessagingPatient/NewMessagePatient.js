import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axiosXanoPatient from "../../../api/xanoPatient";
import { ToastContainer, toast } from "react-toastify";
import MessagesAttachments from "../../Messaging/MessagesAttachments";
import { CircularProgress } from "@mui/material";
import { postPatientRecordPatient } from "../../../api/fetchRecords";
import { filterAndSortExternalMessages } from "../../../utils/filterAndSortExternalMessages";
import { staffIdToTitle } from "../../../utils/staffIdToTitle";
import formatName from "../../../utils/formatName";
import { staffIdToName } from "../../../utils/staffIdToName";
import ContactsForPatient from "./ContactsForPatient";

const NewMessagePatient = ({ setNewVisible, setMessages, section }) => {
  const { auth, user, clinic } = useAuth();
  const [attachments, setAttachments] = useState([]);
  const [recipientId, setRecipientId] = useState(0);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const isContactChecked = (id) => recipientId === id;

  const handleCheckContact = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    if (checked) {
      setRecipientId(id);
    } else {
      setRecipientId(0);
    }
  };

  const handleCancel = (e) => {
    setNewVisible(false);
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async (e) => {
    if (recipientId === 0) {
      toast.error("Please choose a recipient", { containerId: "B" });
      return;
    }
    try {
      const attach_ids = (
        await postPatientRecordPatient(
          "/attachments",
          user.id,
          auth.authToken,
          {
            attachments_array: attachments,
          }
        )
      ).data;

      //create the message
      const message = {
        from_id: user.id,
        from_user_type: "patient",
        to_id: recipientId,
        to_user_type: "staff",
        subject: subject,
        body: body,
        attachments_ids: attach_ids,
        read_by_patient_id: user.id,
        date_created: Date.parse(new Date()),
      };

      await axiosXanoPatient.post("/messages_external", message, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      const response = await axiosXanoPatient.get(
        `/messages_external_for_patient?patient_id=${user.id}`,
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
        "patient",
        user.id
      );
      setMessages(newMessages);
      setNewVisible(false);
      toast.success("Message sent successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to send message: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept =
      ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        alert(
          "The file is over 25Mb, please choose another one or send a link"
        );
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
          const response = await axiosXanoPatient.post(
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

  return (
    <div className="new-message new-message--patient">
      <div className="new-message-contacts new-message-contacts--patient">
        <ContactsForPatient
          staffInfos={clinic.staffInfos}
          isContactChecked={isContactChecked}
          handleCheckContact={handleCheckContact}
        />
      </div>
      <div className="new-message-form new-message-form--patient">
        <div className="new-message-form-recipients new-message-form-recipients--patient">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Staff member"
            value={
              recipientId
                ? staffIdToTitle(clinic.staffInfos, recipientId) +
                  formatName(staffIdToName(clinic.staffInfos, recipientId))
                : ""
            }
            readOnly
          />
        </div>
        <div className="new-message-form-subject new-message-form-subject--patient">
          <strong>Subject: </strong>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message-form-attach new-message-form-attach--patient">
          <strong>Attach files</strong>
          <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="new-message-form-body new-message-form-body--patient">
          <textarea value={body} onChange={handleChange}></textarea>
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
          />
        </div>
        <div className="new-message-form-btns new-message-form-btns--patient">
          <button onClick={handleSend} disabled={isLoadingFile}>
            Send
          </button>
          <button onClick={handleCancel}>Cancel</button>
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
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

export default NewMessagePatient;
