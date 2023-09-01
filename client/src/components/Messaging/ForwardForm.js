import React, { useState } from "react";
import Contacts from "./Contacts";
import { categoryToTitle } from "../../utils/categoryToTitle";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { ToastContainer, toast } from "react-toastify";
import Message from "./Message";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";
import { postPatientRecord } from "../../api/fetchRecords";
import MessagesAttachments from "./MessagesAttachments";
import { CircularProgress } from "@mui/material";

const ForwardForm = ({
  setForwardVisible,
  setMessages,
  section,
  message,
  previousMsgs,
  patient,
}) => {
  const { auth, user, clinic } = useAuth();
  const [attachments, setAttachments] = useState([]);
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);

  const handleCheckContact = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;
    const categoryContactsIds = clinic.staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      let recipientsIdsUpdated = [...recipientsIds, id];
      setRecipientsIds(recipientsIdsUpdated);
      if (
        categoryContactsIds.every((id) => recipientsIdsUpdated.includes(id))
      ) {
        setCategories([...categories, category]);
      }
    } else {
      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (recipientId) => recipientId !== id
      );
      setRecipientsIds(recipientsIdsUpdated);
      if (categories.includes(category)) {
        let categoriesUpdated = [...categories];
        categoriesUpdated = categoriesUpdated.filter(
          (categoryName) => categoryName !== category
        );
        setCategories(categoriesUpdated);
      }
    }
  };

  const handleCheckCategory = (e) => {
    const category = e.target.id;
    const checked = e.target.checked;
    const categoryContactsIds = clinic.staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      setCategories([...categories, category]);
      //All contacts of category

      let recipientsIdsUpdated = [...recipientsIds];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      setRecipientsIds(recipientsIdsUpdated);
    } else {
      let categoriesUpdated = [...categories];
      categoriesUpdated = categoriesUpdated.filter((name) => name !== category);
      setCategories(categoriesUpdated);

      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (id) => !categoryContactsIds.includes(id)
      );
      setRecipientsIds(recipientsIdsUpdated);
    }
  };

  const handleCancel = (e) => {
    setForwardVisible(false);
  };

  const handleSend = async (e) => {
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "B" });
      return;
    }
    try {
      let attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: attachments,
        })
      ).data;

      attach_ids = [...message.attachments_ids, ...attach_ids];

      //create the message
      const forwardMessage = {
        from_id: user.id,
        to_ids: recipientsIds,
        read_by_ids: [user.id],
        subject: previousMsgs.length
          ? `Fwd ${previousMsgs.length + 1}: ${message.subject.slice(
              message.subject.indexOf(":") + 1
            )}`
          : `Fwd: ${message.subject}`,
        body: body,
        previous_ids: [...message.previous_ids, message.id],
        related_patient_id: message.related_patient_id || 0,
        attachments_ids: attach_ids,
        date_created: Date.parse(new Date()),
      };

      //post the message
      await axiosXano.post("/messages", forwardMessage, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      const response = await axiosXano.get(`/messages?staff_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      const newMessages = filterAndSortMessages(
        section,
        response.data,
        user.id
      );
      setMessages(newMessages);
      setForwardVisible(false);
      toast.success("Transfered successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to forward message: ${err.message}`, {
        containerId: "B",
      });
    }
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
    <div className="forward">
      <div className="forward-contacts">
        <Contacts
          staffInfos={clinic.staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="forward-form">
        <div className="forward-form-recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Recipients"
            value={clinic.staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map(
                (staff) =>
                  (staff.title === "Doctor" ? "Dr. " : "") +
                  formatName(staff.full_name)
              )
              .join(", ")}
            readOnly
          />
        </div>
        <div className="forward-form-subject">
          <strong>Subject:</strong>
          {previousMsgs.length
            ? `\u00A0Fwd ${previousMsgs.length + 1}: ${message.subject.slice(
                message.subject.indexOf(":") + 1
              )}`
            : `\u00A0Fwd: ${message.subject}`}
        </div>
        {patient?.full_name && (
          <div className="forward-form-patient">
            <strong>About patient: {"\u00A0"}</strong> {patient.full_name}
          </div>
        )}
        <div className="forward-attach">
          <strong>Attach files</strong>
          <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="forward-form-body">
          <textarea value={body} onChange={handleChange}></textarea>
          <div className="forward-form-history">
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
            cardWidth="30%"
          />
        </div>
        <div className="forward-form-btns">
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

export default ForwardForm;
