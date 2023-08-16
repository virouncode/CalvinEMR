//Librairies
import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import formatName from "../../../../utils/formatName";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import { deletePatientRecord } from "../../../../api/fetchRecords";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";

const DocumentItem = ({ item, fetchRecord, showDocument }) => {
  const { auth } = useAuth();

  const handleDeleteClick = async (e) => {
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

  return (
    <tr className="documents-item">
      <td
        className="documents-item-link"
        onClick={() => showDocument(item.file.url)}
      >
        {item.description}
      </td>
      <td>{item.file.name}</td>
      <td>{item.file.type}</td>
      <td>
        <em>{formatName(item.created_by_name.full_name)}</em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        <button onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  );
};

export default DocumentItem;
