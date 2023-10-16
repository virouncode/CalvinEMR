import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import useAuth from "../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { pregnancySchema } from "../../../../validation/pregnancyValidation";
import { confirmAlert } from "../../../Confirm/ConfirmGlobal";
import PregnanciesList from "../../../Lists/PregnanciesList";

const PregnancyEvent = ({ event, fetchRecord, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth, user, clinic } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [eventInfos, setEventInfos] = useState(event);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "date_of_event") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    if (name === "term_nbr_of_weeks" || name === "term_nbr_of_days") {
      value = parseInt(value);
    }
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Fromatting
    setEventInfos({
      ...eventInfos,
      premises: firstLetterUpper(eventInfos.premises),
    });
    const formDatas = {
      ...eventInfos,
      premises: firstLetterUpper(eventInfos.premises),
    };
    //Validation
    const formDatasForValidation = { ...eventInfos };
    delete formDatasForValidation.patient_id;
    if (formDatasForValidation.term_nbr_of_weeks === "") {
      formDatasForValidation.term_nbr_of_weeks = 0;
    }
    if (formDatasForValidation.term_nbr_of_days === "") {
      formDatasForValidation.term_nbr_of_days = 0;
    }
    try {
      await pregnancySchema.validate(formDatasForValidation);
    } catch (err) {
      setErrMsgPost(err.message);
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
      // const abortController = new AbortController();
      // fetchRecord(abortController);
      // socket.emit("message", {
      //   route: "PREGNANCIES",
      //   content: { id: event.id, data: formDatas },
      //   action: "update",
      // });
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to update pregnancy event: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord("/pregnancies", event.id, auth.authToken);
        // socket.emit("message", {
        //   route: "PREGNANCIES",
        //   content: { id: event.id },
        //   action: "delete",
        // });
        // const abortController = new AbortController();
        // fetchRecord(abortController);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to delete pregnancy event: ${err.message}`, {
          containerId: "B",
        });
      }
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
          <em>
            {staffIdToTitleAndName(
              clinic.staffInfos,
              eventInfos.created_by_id,
              true
            )}
          </em>{" "}
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
