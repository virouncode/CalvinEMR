import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import RelationshipList from "../../../Lists/RelationshipList";
import PatientsSelect from "../../../Lists/PatientsSelect";
import { patientIdToName } from "../../../../utils/patientIdToName";
import formatName from "../../../../utils/formatName";
import { toLocalDate } from "../../../../utils/formatDates";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";
import axiosXano from "../../../../api/xano";
import { toInverseRelation } from "../../../../utils/toInverseRelation";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";

const RelationshipItem = ({
  item,
  fetchRecord,
  editCounter,
  setErrMsgPost,
}) => {
  const { auth, user, clinic } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value;
    name === "relation_id"
      ? (value = parseInt(e.target.value))
      : (value = e.target.value);
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleEditClick = () => {
    editCounter.current += 1;
    setErrMsgPost(false);
    setEditVisible((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Delete the inverse relation ship of item
      const inverseRelationToDeleteId = (
        await axiosXano.post(
          "/relationship_between",
          { patient_id: item.relation_id, relation_id: item.patient_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data[0].id;

      await axiosXano.delete(`/relationships/${inverseRelationToDeleteId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });

      //Put the relationship
      await putPatientRecord(
        "/relationships",
        item.id,
        user.id,
        auth.authToken,
        itemInfos
      );
      //Post the inverse relation ship
      let inverseRelationToPost = {};
      inverseRelationToPost.patient_id = itemInfos.relation_id;
      const gender = clinic.patientsInfos.filter(
        ({ id }) => id === item.relation_id
      )[0].gender_identification;
      inverseRelationToPost.relationship = toInverseRelation(
        itemInfos.relationship,
        gender
      );
      inverseRelationToPost.relation_id = itemInfos.patient_id;
      inverseRelationToPost.created_by_id = user.id;
      inverseRelationToPost.date_created = Date.parse(new Date());
      await axiosXano.post("/relationships", inverseRelationToPost, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const abortController = new AbortController();
      fetchRecord(abortController);
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to update relationship: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        const inverseRelationToDeleteId = (
          await axiosXano.post(
            "/relationship_between",
            { patient_id: item.relation_id, relation_id: item.patient_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          )
        ).data[0].id;

        deletePatientRecord(
          "/relationships",
          inverseRelationToDeleteId,
          auth.authToken
        );
        deletePatientRecord("/relationships", item.id, auth.authToken);
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete relationship: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    itemInfos && (
      <tr className="relationships-item">
        <td>
          {editVisible ? (
            <RelationshipList
              value={itemInfos.relationship}
              name="relationship"
              handleChange={handleChange}
            />
          ) : (
            itemInfos.relationship
          )}{" "}
          of
        </td>
        <td>
          {editVisible ? (
            <PatientsSelect
              handleChange={handleChange}
              value={itemInfos.relation_id}
              name="relation_id"
              patientId={itemInfos.patient_id}
            />
          ) : (
            patientIdToName(clinic.patientsInfos, itemInfos.relation_id)
          )}
        </td>
        <td>
          <em>{formatName(itemInfos.created_by_name.full_name)} </em>
        </td>
        <td>
          <em>{toLocalDate(itemInfos.date_created)}</em>
        </td>
        <td>
          <div className="relationships-item-btn-container">
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

export default RelationshipItem;
