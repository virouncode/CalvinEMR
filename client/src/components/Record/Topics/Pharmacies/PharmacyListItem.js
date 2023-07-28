import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import formatName from "../../../../utils/formatName";

const PharmacyListItem = ({ item, handleAddItemClick }) => {
  return (
    <tr className="pharmacies-list-item">
      <td>{item.name}</td>
      <td>{item.address}</td>
      <td>{item.province_state}</td>
      <td>{item.postal_code}</td>
      <td>{item.city}</td>
      <td>{item.country}</td>
      <td>{item.phone}</td>
      <td>{item.fax}</td>
      <td>{item.email}</td>
      <td>
        <em>{formatName(item.created_by_name.full_name)}</em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        <button onClick={() => handleAddItemClick(item)}>Add</button>
      </td>
    </tr>
  );
};

export default PharmacyListItem;
