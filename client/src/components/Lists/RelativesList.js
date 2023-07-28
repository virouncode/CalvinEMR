import React from "react";

const RelativesList = ({
  value,
  name,
  style,
  handleChange,
  onFocus,
  onBlur,
}) => {
  return (
    <select
      className="form-select"
      name={name}
      onChange={handleChange}
      value={value}
      style={style}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <option value="" hidden>
        Choose a relative...
      </option>
      <option value="Aunt - maternal">Aunt - maternal</option>
      <option value="Aunt - paternal">Aunt - paternal</option>
      <option value="Brother">Brother</option>
      <option value="Cousin - maternal">Cousin - maternal</option>
      <option value="Cousin - paternal">Cousin - paternal</option>
      <option value="Daughter">Daughter</option>
      <option value="Father">Father</option>
      <option value="Grand daughter">Grand daughter</option>
      <option value="Grand son">Grand son</option>
      <option value="Grandfather - maternal">Grandfather - maternal</option>
      <option value="Grandfather - paternal">Grandfather - paternal</option>
      <option value="Grandmother - maternal">Grandmother - maternal</option>
      <option value="Grandmother - paternal">Grandmother - paternal</option>
      <option value="Half-brother">Half-brother</option>
      <option value="Half-sister">Half-sister</option>
      <option value="Mother">Mother</option>
      <option value="Sister">Sister</option>
      <option value="Son">Son</option>
      <option value="Uncle - maternal">Uncle - maternal</option>
      <option value="Uncle - paternal">Uncle - paternal</option>
    </select>
  );
};

export default RelativesList;
