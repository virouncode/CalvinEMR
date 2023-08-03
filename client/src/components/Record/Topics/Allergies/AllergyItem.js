//Librairies
import React, { useState } from "react";
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

const AllergyItem = ({ item, setDatas, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  //STYLE

  //HANDLERS
  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...itemInfos };
    if (formDatas.allergy === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await putPatientRecord(
        "/allergies",
        item.id,
        user.id,
        auth.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/allergies", item.patient_id, auth.authToken)
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
      await deletePatientRecord("/allergies", item.id, auth.authToken);
      setDatas(
        await getPatientRecord("/allergies", item.patient_id, auth.authToken)
      );
    }
  };

  return (
    itemInfos && (
      <tr className="allergies-item">
        <td>
          {editVisible ? (
            <input
              name="allergy"
              type="text"
              value={itemInfos.allergy}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.allergy
          )}
        </td>
        <td>
          <em>{formatName(itemInfos.created_by_name.full_name)} </em>
        </td>
        <td>
          <em>{toLocalDate(itemInfos.date_created)}</em>
        </td>
        <td style={{ textAlign: "center" }}>
          <div className="allergies-item-btn-container">
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

export default AllergyItem;
