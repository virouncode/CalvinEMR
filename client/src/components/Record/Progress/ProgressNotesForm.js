//Librairies
import React, { useState } from "react";
//Components
import { confirmAlert } from "../../Confirm/ConfirmGlobal";
//Utils
import ProgressNotesAttachments from "./ProgressNotesAttachments";
import formatName from "../../../utils/formatName";
import { getPatientRecord, postPatientRecord } from "../../../api/fetchRecords";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/xano";
var _ = require("lodash");

const ProgressNotesForm = ({ setAddVisible, setProgressNotes, patientId }) => {
  //hooks
  const { auth } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    object: "progress note",
    body: "",
    version_nbr: 1,
    attachments_ids: [],
  });
  const [files, setFiles] = useState([]);

  //HANDLERS
  const handleCancelClick = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? You changes won't be saved",
      })
    ) {
      setAddVisible(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Make an array of objects
    let attachments = [];
    for (const file of files) {
      attachments.push({
        patient_id: patientId,
        file: file,
        date_created: Date.parse(new Date()),
        created_by_id: auth?.userId,
      });
    }

    const attach_ids = (
      await postPatientRecord("/attachments", auth?.userId, auth?.authToken, {
        attachments_array: attachments,
      })
    ).data;

    await postPatientRecord("/progress_notes", auth?.userId, auth?.authToken, {
      ...formDatas,
      attachments_ids: attach_ids,
    });

    setAddVisible(false);
    setProgressNotes(
      await getPatientRecord(
        "/patient_progress_notes",
        patientId,
        auth?.authToken
      )
    );
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleAttach = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .wav";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 20000000) {
        alert("The file is too large, please choose another one");
        return;
      }
      // setting up the reader
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result; // this is the content!
        const response = await axios.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${auth?.authToken}`,
            },
          }
        );
        setFiles([...files, response.data]); //meta, mime, name, path, size, type
      };
    };
    input.click();
  };

  const handleRemoveAttachment = (fileName) => {
    const updatedFiles = [...files];
    const indexToRemove = _.findIndex(updatedFiles, { name: fileName });
    updatedFiles.splice(indexToRemove, 1);
    setFiles(updatedFiles);
  };

  return (
    <form className="progress-notes-form" onSubmit={handleSubmit}>
      <div className="progress-notes-form-header">
        <div className="progress-notes-form-row--author">
          <p>
            <strong>From: </strong>
            {auth?.title === "Doctor" ? "Dr. " : ""}{" "}
            {formatName(auth?.userName)}
          </p>
          <div className="progress-notes-form-row-template">
            <label>
              <strong>Use template: </strong>
            </label>
            <select>
              <option value="">Choose a template</option>
              <option value="1">Template 1</option>
              <option value="2">Template 2</option>
              <option value="3">Template 3</option>
              <option value="4">Template 4</option>
            </select>
          </div>
        </div>
        <div className="progress-notes-form-row">
          <div>
            {" "}
            <label>
              <strong>Subject: </strong>
            </label>
            <input
              type="text"
              name="object"
              onChange={handleChange}
              value={formDatas.object}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="file-browser">
              <strong>Attach files: </strong>
            </label>
            <i
              className="fa-solid fa-upload"
              style={{ cursor: "pointer" }}
              onClick={handleAttach}
            ></i>
          </div>
        </div>
      </div>
      <div className="progress-notes-form-area">
        <textarea name="body" onChange={handleChange} value={formDatas.body} />
        <ProgressNotesAttachments
          files={files}
          handleRemoveAttachment={handleRemoveAttachment}
          deletable={true}
        />
      </div>
      <div className="progress-notes-form-submit">
        <input
          className="progress-notes-form-submit-btn"
          type="submit"
          value="Save & Sign"
        />
        <button
          type="button"
          className="progress-notes-form-submit-btn"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProgressNotesForm;
