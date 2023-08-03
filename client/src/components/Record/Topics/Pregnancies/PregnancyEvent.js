//Librairies
import React, { useState } from "react";

//Components
import PregnanciesList from "../../../Lists/PregnanciesList";

//Utils
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import useAuth from "../../../../hooks/useAuth";
import {
  deletePatientRecord,
  getPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import formatName from "../../../../utils/formatName";
import { toast } from "react-toastify";

const PregnancyEvent = ({ event, setDatas, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth, user } = useAuth();
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
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...eventInfos };
    if (formDatas.date_of_event === null || formDatas.description === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await putPatientRecord(
        "/pregnancies",
        event.id,
        user.id,
        auth.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/pregnancies", event.patient_id, auth.authToken)
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", {
        containerId: "B",
      });
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
      await deletePatientRecord("/pregnancies", event.id, auth.authToken);
      setDatas(
        await getPatientRecord("/pregnancies", event.patient_id, auth.authToken)
      );
    }
  };

  return (
    eventInfos && (
      <tr className="pregnancies-event">
        <td>
          {editVisible ? (
            <PregnanciesList
              value={eventInfos.description}
              name="description"
              handleChange={handleChange}
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
              value={
                eventInfos.date_of_event !== null
                  ? toLocalDate(eventInfos.date_of_event)
                  : ""
              }
              onChange={handleChange}
              className="pregnancies-event-input2"
            />
          ) : eventInfos.date_of_event !== null ? (
            toLocalDate(eventInfos.date_of_event)
          ) : (
            ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="premises"
              type="text"
              value={eventInfos.premises}
              onChange={handleChange}
              className="pregnancies-event-input1"
              autoComplete="off"
            />
          ) : (
            eventInfos.premises
          )}
        </td>
        <td>
          {editVisible ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "150px",
              }}
            >
              <input
                name="term_nbr_of_weeks"
                type="number"
                value={eventInfos.term_nbr_of_weeks}
                onChange={handleChange}
                className="pregnancies-event-input3"
                autoComplete="off"
              />
              w
              <input
                name="term_nbr_of_days"
                type="number"
                value={eventInfos.term_nbr_of_days}
                onChange={handleChange}
                className="pregnancies-event-input3"
                autoComplete="off"
              />
              d
            </div>
          ) : (
            <div>
              {eventInfos.term_nbr_of_weeks}w{eventInfos.term_nbr_of_days}d
            </div>
          )}
        </td>
        <td>
          <em>{formatName(eventInfos.created_by_name.full_name)}</em>{" "}
        </td>
        <td>
          <em>{toLocalDate(eventInfos.date_created)}</em>
        </td>
        <td>
          <div className="pregnancies-event-btn-container">
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

export default PregnancyEvent;
