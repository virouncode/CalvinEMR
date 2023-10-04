import React from "react";
import { toast } from "react-toastify";
import { deletePatientRecord } from "../../../../api/fetchRecords";
import axiosXano from "../../../../api/xano";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDate } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";

const DocumentItem = ({ item, fetchRecord, showDocument, setErrMsgPost }) => {
  const { auth, clinic, user } = useAuth();

  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord("/documents", item.id, auth.authToken);
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete document: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const handleAcknowledge = async () => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to acknowledge this document ?",
      })
    ) {
      try {
        const datasToPut = { ...item };
        datasToPut.acknowledged = true;
        datasToPut.date_acknowledged = Date.now();
        await axiosXano.put(`documents/${item.id}`, datasToPut, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Document acknowledged successfully", {
          containerId: "A",
        });
      } catch (err) {
        toast.error(`Unable to acknowledge document : ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  return (
    <tr className="documents-item">
      <td
        className="documents-item-link"
        onClick={() => showDocument(item.file.url, item.file.mime)}
        style={{
          fontWeight: item.acknowledged ? "normal" : "bold",
          color: item.acknowledged ? "black" : "blue",
        }}
      >
        {item.description}
      </td>
      <td>{item.file.name}</td>
      <td>{item.file.type}</td>
      <td>
        <em>
          {staffIdToTitleAndName(clinic.staffInfos, item.created_by_id, true)}
        </em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        {!item.acknowledged && item.assigned_id === user.id && (
          <button onClick={handleAcknowledge}>Acknowledge</button>
        )}
        <button>Fax</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  );
};

export default DocumentItem;
