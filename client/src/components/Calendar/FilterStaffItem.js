//Librairies
import React from "react";

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
        name={category.toLowerCase()}
        id={staff.id}
        checked={isChecked(staff.id)}
        onChange={handleCheck}
        style={{ accentColor: color }}
      />
      <label>{staff.full_name}</label>
    </li>
  );
};

export default FilterStaffItem;
