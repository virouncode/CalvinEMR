//Librairies
import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import useAuth from "../../../../hooks/useAuth";
import { deletePatientRecord } from "../../../../api/fetchRecords";
import formatName from "../../../../utils/formatName";
import { toast } from "react-toastify";

const EformItem = ({ item, fetchRecord, showDocument }) => {
  //HOOKS
  const { auth } = useAuth();

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord("/eforms", item.id, auth.authToken);
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to delete item: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    <tr className="electronic-item">
      <td
        className="electronic-item-link"
        onClick={() => showDocument(item.file.url)}
      >
        {item.name}
      </td>
      <td>
        <em>{formatName(item.created_by_name.full_name)} </em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        <button>E-mail</button>
        <button>Fax</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  );
};

export default EformItem;
