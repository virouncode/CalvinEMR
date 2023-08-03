//Librairies
import React, { useState } from "react";

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

const ReminderItem = ({ item, setDatas, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    if (name === "active") {
      value = value === "true";
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...itemInfos };
    if (formDatas.reminder === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await putPatientRecord(
        "/reminders",
        item.id,
        user.id,
        auth.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/reminders", item.patient_id, auth.authToken)
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
      await deletePatientRecord("/reminders", item.id, auth.authToken);
      setDatas(
        await getPatientRecord("/reminders", item.patient_id, auth.authToken)
      );
    }
  };

  return (
    itemInfos && (
      <tr
        className={
          item.active
            ? "reminders-item"
            : "reminders-item reminders-item--notactive"
        }
      >
        <td>
          {editVisible ? (
            <select
              name="active"
              value={itemInfos.active.toString()}
              onChange={handleChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : itemInfos.active ? (
            "Yes"
          ) : (
            "No"
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.reminder}
              name="reminder"
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.reminder
          )}
        </td>
        <td>
          <em>{formatName(itemInfos.created_by_name.full_name)}</em>
        </td>
        <td>
          <em>{toLocalDate(itemInfos.date_created)}</em>
        </td>
        <td>
          <div className="reminders-item-btn-container">
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

export default ReminderItem;
