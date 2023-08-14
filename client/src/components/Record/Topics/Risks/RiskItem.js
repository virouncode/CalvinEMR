//Librairies
import React, { useState } from "react";

//Utils
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import formatName from "../../../../utils/formatName";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";

const RiskItem = ({ item, fetchRecord, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    const value = e.target.value;
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
        "/risk_factors",
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
      toast.error(err.message, {
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
      try {
        await deletePatientRecord("/risk_factors", item.id, auth.authToken);
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(err.message, { containerId: "B" });
      }
    }
  };

  return (
    itemInfos && (
      <tr className="risk-item">
        <td>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.description}
              onChange={handleChange}
              name="description"
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
        <td>
          <div className="risk-item-btn-container">
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

export default RiskItem;
