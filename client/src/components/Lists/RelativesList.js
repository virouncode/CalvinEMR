import React from "react";
import "react-widgets/scss/styles.scss";
import { Combobox } from "react-widgets";
import { relatives } from "../../utils/relatives";

const RelativesList = ({ value, handleChange }) => {
  return (
    <Combobox
      placeholder="Choose a relative"
      value={value}
      onChange={handleChange}
      data={relatives}
    />
  );
};

export default RelativesList;
