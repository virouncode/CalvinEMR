import React, { useRef } from "react";
import RelationshipRow from "./RelationshipRow.js";

const RelationshipsForm = ({ relationships, setRelationships }) => {
  const idCounter = useRef(0);
  const handleChange = (e) => {
    const name = e.target.name;
    let value;
    name === "relation_id"
      ? (value = parseInt(e.target.value))
      : (value = e.target.value);

    let updatedRelationships = [...relationships];
    //ne pas prendre l'index mais filtrer sur l'id
    updatedRelationships = updatedRelationships.map((item) => {
      if (item.id === parseInt(e.target.getAttribute("data-key"))) {
        return { ...item, [name]: value };
      } else return item;
    });
    setRelationships(updatedRelationships);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setRelationships([
      ...relationships,
      { relation_id: "", relationship: "", id: idCounter.current },
    ]);
    idCounter.current = idCounter.current + 1;
  };
  const handleDeleteRelationship = (e) => {
    let updatedRelationships = [...relationships];
    updatedRelationships = updatedRelationships.filter(
      ({ id }) => id !== parseInt(e.target.getAttribute("data-key"))
    );
    setRelationships(updatedRelationships);
  };
  return (
    <>
      <div className="signup-patient-form-row">
        <label>Relationships: </label>
        <button onClick={handleAdd}>Add a relationship</button>
      </div>
      {relationships.length !== 0 &&
        relationships.map((item) => (
          <RelationshipRow
            item={item}
            handleChange={handleChange}
            handleDeleteRelationship={handleDeleteRelationship}
            key={item.id}
          />
        ))}
    </>
  );
};

export default RelationshipsForm;
