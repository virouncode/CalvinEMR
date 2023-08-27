import React from "react";
import RelationshipList from "../Lists/RelationshipList";
import PatientsSelect from "../Lists/PatientsSelect";

const RelationshipRow = ({ item, handleChange, handleDeleteRelationship }) => {
  return (
    <div className="signup-patient-form-row-relationship">
      <RelationshipList
        id={item.id}
        name="relationship"
        handleChange={handleChange}
        value={item.relationship}
      />{" "}
      of{" "}
      <PatientsSelect
        id={item.id}
        handleChange={handleChange}
        value={item.relation_id}
        name="relation_id"
      />
      <i
        data-key={item.id}
        className="fa-solid fa-trash"
        onClick={handleDeleteRelationship}
        style={{ cursor: "pointer" }}
      ></i>
    </div>
  );
};

export default RelationshipRow;
