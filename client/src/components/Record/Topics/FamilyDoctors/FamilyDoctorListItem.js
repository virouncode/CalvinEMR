import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toLocalDate } from "../../../../utils/formatDates";

const FamilyDoctorListItem = ({ item, handleAddItemClick }) => {
  const { clinic } = useAuth();
  return (
    <tr className="doctors-list-item">
      <td>{item.name}</td>
      <td>{item.speciality}</td>
      <td>{item.licence_nbr}</td>
      <td>{item.address}</td>
      <td>{item.province_state}</td>
      <td>{item.postal_code}</td>
      <td>{item.city}</td>
      <td>{item.country}</td>
      <td>{item.phone}</td>
      <td>{item.fax}</td>
      <td>{item.email}</td>
      <td>
        <em>
          {staffIdToTitleAndName(clinic.staffInfos, item.created_by_id, true)}
        </em>
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

export default FamilyDoctorListItem;
