//Librairies
import React from "react";
//Components
import FilterStaffItem from "./FilterStaffItem";
import useAuth from "../../hooks/useAuth";

const FilterCheckboxesSection = ({
  isCategoryChecked,
  handleCheckCategory,
  category,
  staffInfos,
  isChecked,
  handleCheck,
  remainingStaff,
}) => {
  const { auth } = useAuth();
  return (
    <ul>
      <li>
        <input
          type="checkbox"
          className="filter-checkbox"
          name={category}
          id={category}
          checked={isCategoryChecked(category)}
          onChange={(e) => handleCheckCategory(category, e)}
          style={{ accentColor: "#bfbfbf" }}
          autoComplete="off"
        />
        <label className="filter-category-label">{category}</label>
      </li>
      {staffInfos
        .filter(({ title }) => title === category)
        .map((staff) => (
          <FilterStaffItem
            key={staff.id}
            staff={staff}
            category={category}
            isChecked={isChecked}
            handleCheck={handleCheck}
            color={
              staff.id !== auth?.userId
                ? remainingStaff.find(({ id }) => id === staff.id)?.color
                : "#41A7F5"
            }
          />
        ))}
    </ul>
  );
};

export default FilterCheckboxesSection;
