//Librairies
import React, { useState } from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import useAuth from "../../../../hooks/useAuth";
import formatName from "../../../../utils/formatName";
import {
  deletePatientRecord,
  getPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const MedHistoryEvent = ({ event, setDatas, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [eventInfos, setEventInfos] = useState(event);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    if (name === "date_of_event") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    if (name === "ongoing") {
      value = value === "true";
    }
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...eventInfos };
    if (formDatas.description === "" || formDatas.date_of_event === null) {
      setErrMsgPost(true);
      return;
    }
    try {
      await putPatientRecord(
        "/medical_history",
        event.id,
        auth?.userId,
        auth?.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord(
          "/medical_history",
          event.patient_id,
          auth?.authToken
        )
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", { containerId: "B" });
    }
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost(false);
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      await deletePatientRecord("/medical_history", event.id, auth?.authToken);
      setDatas(
        await getPatientRecord(
          "/medical_history",
          event.patient_id,
          auth?.authToken
        )
      );
    }
  };

  return (
    eventInfos && (
      <tr
        className={
          event.ongoing
            ? "medhistory-event"
            : "medhistory-event medhistory-event--notgoing"
        }
      >
        <td>
          {editVisible ? (
            <select
              name="ongoing"
              value={eventInfos.ongoing.toString()}
              onChange={handleChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : eventInfos.ongoing ? (
            "Yes"
          ) : (
            "No"
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="description"
              type="text"
              value={eventInfos.description}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.description
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="date_of_event"
              type="date"
              max={toLocalDate(new Date().toISOString())}
              value={
                eventInfos.date_of_event !== null
                  ? toLocalDate(eventInfos.date_of_event)
                  : ""
              }
              onChange={handleChange}
            />
          ) : eventInfos.date_of_event !== null ? (
            toLocalDate(eventInfos.date_of_event)
          ) : (
            ""
          )}
        </td>
        <td>
          <em>{formatName(eventInfos.created_by_name.full_name)}</em>
        </td>
        <td>
          <em>{toLocalDate(eventInfos.date_created)}</em>
        </td>
        <td>
          <div className="medhistory-event-btn-container">
            {!editVisible ? (
              <button onClick={handleEditClick}>Edit</button>
            ) : (
              <input type="submit" value="Save" onClick={handleSubmit} />
            )}
            <button onClick={handleDeleteClick}>Delete</button>
          </div>
        </td>
      </tr>
    )
  );
};

export default MedHistoryEvent;