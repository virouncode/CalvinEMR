//Librairies
import React, { useEffect, useRef, useState } from "react";
//Components
import ProgressNotesAttachments from "./ProgressNotesAttachments";
import { confirmAlert } from "../../Confirm/ConfirmGlobal";
//Utils
import { toLocalDateAndTimeWithSeconds } from "../../../utils/formatDates";
import {
  getPatientRecord,
  postPatientRecord,
  putPatientRecord,
} from "../../../api/fetchRecords";
import useAuth from "../../../hooks/useAuth";
import axiosXano from "../../../api/xano";
import formatName from "../../../utils/formatName";
import TriangleButtonProgress from "./../Buttons/TriangleButtonProgress";
import { toast } from "react-toastify";
var _ = require("lodash");

const ProgressNotesCard = ({
  progressNote,
  progressNotes,
  setProgressNotes,
  fetchRecord,
  patientId,
  checkedNotes,
  setCheckedNotes,
  setSelectAll,
  allBodiesVisible,
}) => {
  //hooks
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [formDatas, setFormDatas] = useState(null);
  const [versions, setVersions] = useState(null);
  const [files, setFiles] = useState([]);
  const [bodyVisible, setBodyVisible] = useState(true);
  const bodyRef = useRef(null);
  const { auth, user } = useAuth();

  useEffect(() => {
    if (progressNote) {
      setFormDatas(progressNote);
      setTempFormDatas(progressNote);
    }
  }, [progressNote]);

  useEffect(() => {
    setBodyVisible(allBodiesVisible);
  }, [allBodiesVisible]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchVersions = async () => {
      try {
        const versionsResults = (
          await getPatientRecord(
            "/progress_notes_log",
            patientId,
            auth.authToken,
            abortController
          )
        ).filter(
          ({ progress_note_id }) => progress_note_id === progressNote.id
        );
        if (abortController.signal.aborted) return;
        versionsResults.forEach(
          (version) => (version.id = version.progress_note_id) //change id field value to progress_note_id value to match progress_notes fields
        );
        versionsResults.sort((a, b) => a.version_nbr - b.version_nbr);

        setVersions(versionsResults);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(err.message, { containerId: "A" });
      }
    };
    fetchVersions();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, patientId, progressNote.id]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchFiles = async () => {
      try {
        const attachments = (
          await axiosXano.post(
            "/attachments_for_progress_note",
            { attachments_ids: progressNote.attachments_ids },
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
        setFiles(attachments.map(({ file }) => file));
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(err.message, { containerId: "A" });
      }
    };
    fetchFiles();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, progressNote.attachments_ids]);

  //HANDLERS
  const handleTriangleProgressClick = (e) => {
    setBodyVisible((v) => !v);
    bodyRef.current.classList.toggle(
      "progress-notes-card-body-container--active"
    );
  };

  const handleEditClick = (e) => {
    setEditVisible(true);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleCancelClick = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? Your changes won't be saved",
      })
    ) {
      setEditVisible(false);
    }
  };
  const handleSaveClick = async (e) => {
    if (
      (_.isEqual(tempFormDatas, formDatas) &&
        (await confirmAlert({
          content: "You didn't change anything to the note, save anyway ?",
        }))) ||
      !_.isEqual(tempFormDatas, formDatas)
    ) {
      //First post the former progress note version to the progress note log tbl
      const logDatas = { ...formDatas };
      logDatas.progress_note_id = formDatas.id;
      if (formDatas.version_nbr !== 1) {
        logDatas.updated_by_id = formDatas.updated_by_id;
        logDatas.date_updated = formDatas.date_updated;
      }

      try {
        await postPatientRecord(
          "/progress_notes_log",
          user.id,
          auth.authToken,
          logDatas
        );
        //then put the new progress note version in the progress note tbl
        tempFormDatas.version_nbr = progressNote.version_nbr + 1; //increment version
        await putPatientRecord(
          "/progress_notes",
          progressNote.id,
          user.id,
          auth.authToken,
          tempFormDatas
        );
        setEditVisible(false);
        const abortController = new AbortController();
        fetchRecord(abortController);
        const versionsResults = (
          await getPatientRecord(
            "/progress_notes_log",
            patientId,
            auth.authToken
          )
        ).filter(
          ({ progress_note_id }) => progress_note_id === progressNote.id
        );

        versionsResults.forEach(
          (version) => (version.id = version.progress_note_id)
        );
        versionsResults.sort((a, b) => a.version_nbr - b.version_nbr);
        setVersions(versionsResults);
        toast.success("Progress note saved successfully", { containerId: "A" });
      } catch (err) {
        toast.error(err.message, { containerId: "A" });
      }
    }
  };

  const handleCheck = (e) => {
    const value = e.target.checked;
    let checkedNotesUpdated = [...checkedNotes];
    if (value) {
      if (checkedNotesUpdated.indexOf(progressNote.id) === -1) {
        checkedNotesUpdated.push(progressNote.id);
      }
    } else {
      if (checkedNotesUpdated.indexOf(progressNote.id) !== -1) {
        checkedNotesUpdated = checkedNotesUpdated.filter(
          (id) => id !== progressNote.id
        );
      }
    }
    setCheckedNotes(checkedNotesUpdated);
    if (checkedNotesUpdated.length === 0) {
      setSelectAll(false);
    } else if (checkedNotesUpdated.length === progressNotes.length) {
      setSelectAll(true);
    }
  };

  const handleVersionChange = async (e) => {
    const value = parseInt(e.target.value); //the choosen version
    let updatedProgressNotes = [...progressNotes];
    const index = _.findIndex(updatedProgressNotes, {
      id: progressNote.id,
    });
    if (value < versions.length + 1) {
      //former version
      updatedProgressNotes[index] = versions[value - 1];
    } else {
      //last version
      const response = await axiosXano.get(
        `/progress_notes/${progressNote.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      updatedProgressNotes[index] = response.data;
    }
    setProgressNotes(updatedProgressNotes);
  };

  const isChecked = (progressNoteId) => {
    return checkedNotes.includes(progressNoteId);
  };

  const getAuthorTitle = () => {
    if (
      progressNote.updated_by_title?.title &&
      progressNote.updated_by_title?.title === "Doctor"
    ) {
      return "Dr. ";
    } else if (progressNote.created_by_title?.title === "Doctor") {
      return "Dr. ";
    } else {
      return "";
    }
  };

  return (
    tempFormDatas &&
    versions && (
      <div className="progress-notes-card">
        {bodyVisible ? (
          <div className="progress-notes-card-header">
            <div className="progress-notes-card-header-row">
              <div className="progress-notes-card-header-author">
                <input
                  className="progress-notes-card-header-check"
                  type="checkbox"
                  checked={isChecked(progressNote.id)}
                  onChange={handleCheck}
                />
                <p>
                  <strong>From: </strong>
                  {getAuthorTitle()}{" "}
                  {formatName(tempFormDatas.updated_by_name?.full_name) ||
                    formatName(tempFormDatas.created_by_name.full_name)}
                  {tempFormDatas.updated_by_name?.full_name
                    ? ` (${toLocalDateAndTimeWithSeconds(
                        tempFormDatas.date_updated
                      )})`
                    : ` (${toLocalDateAndTimeWithSeconds(
                        tempFormDatas.date_created
                      )})`}
                </p>
              </div>
              <div className="progress-notes-card-header-version">
                <label>
                  <strong style={{ marginRight: "5px" }}>Version: </strong>
                </label>
                {!editVisible ? (
                  <select
                    name="version_nbr"
                    value={tempFormDatas.version_nbr.toString()}
                    onChange={handleVersionChange}
                  >
                    {versions.map(({ version_nbr }) => (
                      <option value={version_nbr.toString()} key={version_nbr}>
                        {"V" + version_nbr.toString()}
                      </option>
                    ))}
                    <option value={(versions.length + 1).toString()}>
                      {"V" + (versions.length + 1).toString()}
                    </option>
                  </select>
                ) : (
                  "V" + (versions.length + 2).toString()
                )}
                <div className="progress-notes-card-header-btns">
                  {!editVisible ? (
                    <button onClick={handleEditClick}>Edit</button>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        style={{ margin: "0 2px" }}
                        onClick={handleSaveClick}
                      >
                        Save
                      </button>
                      <button
                        style={{ margin: "0 2px" }}
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="progress-notes-card-header-row">
              <div className="progress-notes-card-header-object">
                <label>
                  <strong>Subject: </strong>
                </label>
                {!editVisible ? (
                  tempFormDatas.object
                ) : (
                  <input
                    type="text"
                    value={tempFormDatas.object}
                    onChange={handleChange}
                    name="object"
                    autoComplete="off"
                  />
                )}
              </div>
              <div>
                <TriangleButtonProgress
                  handleTriangleClick={handleTriangleProgressClick}
                  color="dark"
                  className={
                    "triangle-progress-notes  triangle-progress-notes--active"
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="progress-notes-card-header progress-notes-card-header--folded">
            <div className="progress-notes-card-header--folded-title">
              <label>
                <strong>From: </strong>
              </label>
              {getAuthorTitle()}{" "}
              {formatName(tempFormDatas.updated_by_name?.full_name) ||
                formatName(tempFormDatas.created_by_name.full_name)}
              {tempFormDatas.updated_by_name?.full_name
                ? ` (${toLocalDateAndTimeWithSeconds(
                    tempFormDatas.date_updated
                  )})`
                : ` (${toLocalDateAndTimeWithSeconds(
                    tempFormDatas.date_created
                  )})`}
              {" / "}
              <label>
                <strong>Subject: </strong>
              </label>
              {tempFormDatas.object}
            </div>
            <div>
              <TriangleButtonProgress
                handleTriangleClick={handleTriangleProgressClick}
                color="dark"
                className={"triangle-progress-notes"}
              />
            </div>
          </div>
        )}
        <div
          ref={bodyRef}
          className={
            bodyVisible
              ? "progress-notes-card-body-container progress-notes-card-body-container--active"
              : "progress-notes-card-body-container"
          }
        >
          <div className="progress-notes-card-body">
            {!editVisible ? (
              <p>{tempFormDatas.body}</p>
            ) : (
              <textarea
                className="progress-notes-card-body-edit"
                name="body"
                cols="90"
                rows="20"
                value={tempFormDatas.body}
                onChange={handleChange}
              />
            )}
          </div>
          <ProgressNotesAttachments files={files} deletable={false} />
          {!editVisible && (
            <div className="progress-notes-card-body-footer">
              {tempFormDatas.updated_by_name?.full_name ? (
                <p style={{ padding: "0 10px" }}>
                  Updated by {tempFormDatas.updated_by_name.full_name} on{" "}
                  {toLocalDateAndTimeWithSeconds(tempFormDatas.date_updated)}
                </p>
              ) : null}
              <p style={{ padding: "0 10px" }}>
                Created by {tempFormDatas.created_by_name.full_name} on{" "}
                {toLocalDateAndTimeWithSeconds(tempFormDatas.date_created)}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default ProgressNotesCard;
