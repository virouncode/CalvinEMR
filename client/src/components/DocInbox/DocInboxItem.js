//Librairies
import React from "react";
import { toLocalDate } from "../../utils/formatDates";
import useAuth from "../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../utils/staffIdToTitleAndName";
import { patientIdToName } from "../../utils/patientIdToName";
import { confirmAlert } from "../Confirm/ConfirmGlobal";
import axiosXano from "../../api/xano";
import { toast } from "react-toastify";

const DocInboxItem = ({ item, showDocument, setDocuments }) => {
  const { clinic, auth, user } = useAuth();

  const handleAknowledge = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to aknowledge this document ?",
      })
    ) {
      try {
        const datasToPut = { ...item };
        datasToPut.aknowledged = true;
        datasToPut.date_aknowledged = Date.now();
        await axiosXano.put(`documents/${item.id}`, datasToPut, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        const response = await axiosXano.get(
          `/documents_for_staff?staff_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setDocuments(response.data.filter(({ aknowledged }) => !aknowledged));
        toast.success("Document aknowledge successfully", { containerId: "A" });
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
          fontWeight: "bold",
          color: "blue",
        }}
      >
        {item.description}
      </td>
      <td>{item.file.name}</td>
      <td>{item.file.type}</td>
      <td>{patientIdToName(clinic.patientsInfos, item.patient_id)}</td>
      <td>
        <em>
          {staffIdToTitleAndName(clinic.staffInfos, item.created_by_id, true)}
        </em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        <button onClick={handleAknowledge}>Aknowledge</button>
      </td>
    </tr>
  );
};

export default DocInboxItem;
