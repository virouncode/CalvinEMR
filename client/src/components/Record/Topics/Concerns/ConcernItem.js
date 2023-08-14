//Librairies
import React, { useState } from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import useAuth from "../../../../hooks/useAuth";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import formatName from "../../../../utils/formatName";
import { toast } from "react-toastify";

const ConcernItem = ({ item, fetchRecord, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  //HANDLERS
  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost(false);
    setEditVisible((v) => !v);
  };

  //HANDLERS
  const handleDeleteClick = async (e) => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord("/ongoing_concerns", item.id, auth.authToken);
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(err.message, { containerId: "B" });
      }
    }
  };

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...itemInfos };
    if (formDatas.description === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await putPatientRecord(
        "/ongoing_concerns",
        item.id,
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
      toast.error(err.message, { containerId: "B" });
    }
  };

  return (
    itemInfos && (
      <tr className="concerns-item">
        <td>
          {editVisible ? (
            <input
              name="description"
              onChange={handleChange}
              type="text"
              value={itemInfos.description}
              autoComplete="off"
            />
          ) : (
            itemInfos.description
          )}
        </td>
        <td>
          <em>{formatName(itemInfos.created_by_name.full_name)}</em>
        </td>
        <td>
          <em>{toLocalDate(itemInfos.date_created)}</em>
        </td>
        <td style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
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

export default ConcernItem;
