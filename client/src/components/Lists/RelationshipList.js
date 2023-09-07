import React from "react";

const RelationshipList = ({
  value,
  name,
  style,
  handleChange,
  onFocus,
  onBlur,
  id,
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
      data-key={id}
      id="relationships"
    >
      <option value="" disabled>
        Choose a relation...
      </option>
      <option value="Aunt - maternal">Aunt - maternal</option>
      <option value="Aunt - paternal">Aunt - paternal</option>
      <option value="Boyfriend">Boyfriend</option>
      <option value="Brother">Brother</option>
      <option value="Cousin - maternal">Cousin - maternal</option>
      <option value="Cousin - paternal">Cousin - paternal</option>
      <option value="Daughter">Daughter</option>
      <option value="Father">Father</option>
      <option value="Girlfriend">Girlfriend</option>
      <option value="Granddaughter - maternal">Granddaughter - maternal</option>
      <option value="Grandson - maternal">Grandson - maternal</option>
      <option value="Granddaughter - paternal">Granddaughter - paternal</option>
      <option value="Grandson - paternal">Grandson - paternal</option>
      <option value="Grandfather - maternal">Grandfather - maternal</option>
      <option value="Grandfather - paternal">Grandfather - paternal</option>
      <option value="Grandmother - maternal">Grandmother - maternal</option>
      <option value="Grandmother - paternal">Grandmother - paternal</option>
      <option value="Half-brother">Half-brother</option>
      <option value="Half-sister">Half-sister</option>
      <option value="Husband">Husband</option>
      <option value="Mother">Mother</option>
      <option value="Nephew - maternal">Nephew - maternal</option>
      <option value="Nephew - paternal">Nephew - paternal</option>
      <option value="Niece - maternal">Niece - maternal</option>
      <option value="Niece - paternal">Niece - paternal</option>
      <option value="Sister">Sister</option>
      <option value="Son">Son</option>
      <option value="Uncle - maternal">Uncle - maternal</option>
      <option value="Uncle - paternal">Uncle - paternal</option>
      <option value="Wife">Wife</option>
    </select>
  );
};

export default RelationshipList;
