//Librairies
import React from "react";
import { categoryToTitle } from "../../utils/categoryToTitle";

const FilterStaffItem = ({
  staff,
  category,
  isChecked,
  handleCheck,
  color,
}) => {
  return (
    <li>
      <input
        type="checkbox"
        className="filter-checkbox"
        name={categoryToTitle(category).toLowerCase()}
        id={staff.id}
        checked={isChecked(staff.id)}
        onChange={handleCheck}
        style={{ accentColor: color }}
      />
      <label htmlFor={staff.id}>
        {categoryToTitle(category).toLowerCase() === "doctor" ? "Dr. " : null}
        {staff.full_name}
      </label>
    </li>
  );
};

export default FilterStaffItem;
