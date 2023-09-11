import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import RelationshipList from "../../../Lists/RelationshipList";
import PatientsSelect from "../../../Lists/PatientsSelect";
import formatName from "../../../../utils/formatName";
import { toISOStringNoMs, toLocalDate } from "../../../../utils/formatDates";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { toInverseRelation } from "../../../../utils/toInverseRelation";
import { toast } from "react-toastify";
import { relationshipSchema } from "../../../../validation/relationshipValidation";

const RelationshipForm = ({
  editCounter,
  setAddVisible,
  patientId,
  fetchRecord,
  setErrMsgPost,
}) => {
  const { auth, user, clinic } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    relationship: "",
    relation_id: "",
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value;
    if (name === "relation_id") {
      value = parseInt(e.target.value);
    } else {
      value = e.target.value;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await relationshipSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      //Post the relationship
      await postPatientRecord(
        "/relationships",
        user.id,
        auth.authToken,
        formDatas
      );

      //Post the inverse relationship
      let inverseRelationToPost = {};
      inverseRelationToPost.patient_id = formDatas.relation_id;
      const gender = clinic.patientsInfos.filter(
        ({ id }) => id === formDatas.relation_id
      )[0].gender_identification;
      inverseRelationToPost.relationship = toInverseRelation(
        formDatas.relationship,
        gender
      );
      inverseRelationToPost.relation_id = formDatas.patient_id;

      await postPatientRecord(
        "/relationships",
        user.id,
        auth.authToken,
        inverseRelationToPost
      );

      const abortController = new AbortController();
      fetchRecord(abortController);
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save relationship: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr className="relationships-form">
      <td>
        <RelationshipList
          value={formDatas.relationship}
          name="relationship"
          handleChange={handleChange}
        />{" "}
        of
      </td>
      <td>
        <PatientsSelect
          handleChange={handleChange}
          value={formDatas.relation_id}
          name="relation_id"
          patientId={patientId}
        />
      </td>
      <td>
        <em>{formatName(user.name)}</em>
      </td>
      <td>
        <em>{toLocalDate(toISOStringNoMs(new Date()))}</em>
      </td>
      <td style={{ textAlign: "center" }}>
        <input type="submit" value="Save" onClick={handleSubmit} />
      </td>
    </tr>
  );
};

export default RelationshipForm;
