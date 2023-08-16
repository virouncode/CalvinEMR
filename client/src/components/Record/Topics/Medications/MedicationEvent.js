//Librairies
import React, { useState } from "react";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import { toLocalDate } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import formatName from "../../../../utils/formatName";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const MedicationEvent = ({
  event,
  fetchRecord,
  editCounter,
  setErrMsgPost,
  presVisible,
  setPresVisible,
  medsRx,
  setMedsRx,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [eventInfos, setEventInfos] = useState(event);

  //HANDLERS
  const handleDeleteClick = async (e) => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord("/medications", event.id, auth.authToken);
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete medication: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    if (name === "active") {
      value = value === "true";
    }
    if (name === "start") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...eventInfos };
    if (formDatas.name === "") {
      setErrMsgPost(true);
      return;
    }

    try {
      await putPatientRecord(
        "/medications",
        event.id,
        user.id,
        auth.authToken,
        formDatas
      );
      const abortController = new AbortController();
      fetchRecord(abortController);
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to update medication: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleEditClick = (e) => {
    setErrMsgPost(false);
    editCounter.current += 1;
    setEditVisible((v) => !v);
  };

  const handleAddToRxClick = (e) => {
    if (!presVisible) {
      setMedsRx([...medsRx, event]);
      setPresVisible(true);
    } else {
      setMedsRx([...medsRx, event]);
    }
  };
  const handleRemoveFromRxClick = (e) => {
    let newMedsRx = [...medsRx];
    newMedsRx = newMedsRx.filter(({ id }) => id !== event.id);
    setMedsRx(newMedsRx);
  };

  return (
    eventInfos && (
      <tr
        className={
          event.active
            ? "medications-event"
            : "medications-event medications-event--notactive"
        }
      >
        <td>
          {editVisible ? (
            <select
              name="active"
              value={eventInfos.active.toString()}
              onChange={handleChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : eventInfos.active ? (
            "Yes"
          ) : (
            "No"
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={eventInfos.name}
              name="name"
              onChange={handleChange}
              className="medications-event-input1"
              autoComplete="off"
            />
          ) : (
            eventInfos.name
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={eventInfos.active_ingredients ?? ""}
              name="active_ingredients"
              onChange={handleChange}
              className="medications-event-input1"
              autoComplete="off"
            />
          ) : (
            eventInfos.active_ingredients
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={eventInfos.route_of_administration}
              name="route_of_administration"
              onChange={handleChange}
              className="medications-event-input2"
              autoComplete="off"
            />
          ) : (
            eventInfos.route_of_administration
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={eventInfos.dose}
              name="dose"
              onChange={handleChange}
              className="medications-event-input2"
              autoComplete="off"
            />
          ) : (
            eventInfos.dose
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={eventInfos.frequency}
              name="frequency"
              onChange={handleChange}
              className="medications-event-input3"
              autoComplete="off"
            />
          ) : (
            eventInfos.frequency
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={eventInfos.number_of_doses}
              name="dose"
              onChange={handleChange}
              className="medications-event-input2"
              autoComplete="off"
            />
          ) : (
            eventInfos.number_of_doses
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={eventInfos.duration}
              name="duration"
              onChange={handleChange}
              className="medications-event-input2"
              autoComplete="off"
            />
          ) : (
            eventInfos.duration
          )}
        </td>
        <td>
          <em>{formatName(eventInfos.created_by_name.full_name)}</em>
        </td>
        <td>
          <em>{toLocalDate(eventInfos.date_created)}</em>
        </td>
        {user.title === "Doctor" && (
          <td>
            <div className="medications-event-btn-container">
              {!editVisible ? (
                <button onClick={handleEditClick}>Edit</button>
              ) : (
                <input type="submit" value="Save" onClick={handleSubmit} />
              )}
              <button onClick={handleDeleteClick}>Delete</button>
              {presVisible ? (
                medsRx.find(({ id }) => id === event.id) ? (
                  <button
                    onClick={handleRemoveFromRxClick}
                    style={{ minWidth: "90px" }}
                  >
                    Rmv From Rx
                  </button>
                ) : (
                  <button
                    onClick={handleAddToRxClick}
                    style={{ minWidth: "90px" }}
                    // disabled={medsRx.find(({ id }) => id === event.id)}
                  >
                    Add To RX
                  </button>
                )
              ) : (
                <button
                  onClick={handleAddToRxClick}
                  style={{ minWidth: "90px" }}
                  // disabled={medsRx.find(({ id }) => id === event.id)}
                >
                  Add To RX
                </button>
              )}
            </div>
          </td>
        )}
      </tr>
    )
  );
};

export default MedicationEvent;
