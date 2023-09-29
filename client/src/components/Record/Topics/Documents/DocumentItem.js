//Librairies
import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

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

  const handleAknowledge = async () => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to aknowledge this document ?",
      })
    ) {
      try {
        const datasToPut = { ...item };
        datasToPut.aknowledged = true;
        datasToPut.date_aknowledged = Date.now();
        await putPatientRecord(
          "documents",
          item.id,
          user.id,
          auth.authToken,
          datasToPut
        );
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Document aknowledged successfully", {
          containerId: "A",
        });
      } catch (err) {
        toast.error(`Unable to aknowledge document : ${err.message}`, {
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
          fontWeight: item.aknowledged ? "normal" : "bold",
          color: item.aknowledged ? "black" : "blue",
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
        {!item.aknowledged && item.assigned_id === user.id && (
          <button onClick={handleAknowledge}>Aknowledge</button>
        )}
        <button>Fax</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  );
};

export default DocumentItem;
