import React from "react";
import "react-widgets/scss/styles.scss";
import { Combobox } from "react-widgets";
import { relations } from "../../utils/relations";

const RelationshipList = ({ value, handleChange, itemId = 0 }) => {
  return (
    <Combobox
      placeholder="Choose a relationship"
      value={value}
      onChange={(value) => handleChange(value, itemId)}
      data={relations}
    />
  );
};

export default RelationshipList;
