import React from "react";
import RelationshipList from "../Lists/RelationshipList";
import PatientsSelect from "../Lists/PatientsSelect";

const RelationshipRow = ({
  item,
  handleChange,
  handleDeleteRelationship,
  handleRelationshipChange,
}) => {
  return (
    <div className="signup-patient-form-row-relationship">
      <RelationshipList
        itemId={item.id}
        handleChange={handleRelationshipChange}
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
        id={item.id}
        className="fa-solid fa-trash"
        onClick={handleDeleteRelationship}
        style={{ cursor: "pointer" }}
      ></i>
    </div>
  );
};

export default RelationshipRow;
