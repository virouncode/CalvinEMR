//Librairies
import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import useAuth from "../../../../hooks/useAuth";
import { deletePatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const EformItem = ({ item, fetchRecord, showDocument }) => {
  //HOOKS
  const { auth, clinic } = useAuth();

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
        onClick={() => showDocument(item.file.url, item.file.mime)}
      >
        {item.name}
      </td>
      <td>
        <em>
          {staffIdToTitleAndName(clinic.staffInfos, item.created_by_id, true)}
        </em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        <button>Fax</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  );
};

export default EformItem;
