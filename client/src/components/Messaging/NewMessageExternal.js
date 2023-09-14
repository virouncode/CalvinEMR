import React, { useState } from "react";
import Patients from "./Patients";
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { ToastContainer, toast } from "react-toastify";
import MessagesAttachments from "./MessagesAttachments";
import { CircularProgress } from "@mui/material";
import { postPatientRecord } from "../../api/fetchRecords";
import { filterAndSortExternalMessages } from "../../utils/filterAndSortExternalMessages";

const NewMessageExternal = ({ setNewVisible, setMessages, section }) => {
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

  const isPatientChecked = (id) => recipientId === id;

  const handleCheckPatient = (e) => {
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
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: attachments,
        })
      ).data;

      //create the message
      const message = {
        from_id: user.id,
        from_user_type: "staff",
        to_id: recipientId,
        to_user_type: "patient",
        subject: subject,
        body: body,
        attachments_ids: attach_ids,
        read_by_staff_id: user.id,
        read_by_ids: [{ user_type: "staff", id: user.id }],
        date_created: Date.parse(new Date()),
      };

      await axiosXano.post("/messages_external", message, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

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
      setNewVisible(false);
      toast.success("Message sent successfully", { containerId: "A" });

      //EMAIL + SMS pour prévenir le patient qu'il a un nouveau message dans son portail
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

  return (
    <div className="new-message">
      <div className="new-message-form">
        <div className="new-message-form-recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Patient"
            value={
              recipientId
                ? clinic.patientsInfos.find(({ id }) => recipientId === id)
                    .full_name
                : ""
            }
            readOnly
          />
        </div>
        <div className="new-message-form-subject">
          <strong>Subject: </strong>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message-form-attach">
          <strong>Attach files</strong>
          <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="new-message-form-body">
          <textarea value={body} onChange={handleChange}></textarea>
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
          />
        </div>
        <div className="new-message-form-btns">
          <button onClick={handleSend} disabled={isLoadingFile}>
            Send
          </button>
          <button onClick={handleCancel}>Cancel</button>
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
      </div>
      <div className="new-message-patients">
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
        />
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

export default NewMessageExternal;
