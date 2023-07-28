import React, { useState } from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import CountriesList from "../../../Lists/CountriesList";
import useAuth from "../../../../hooks/useAuth";
import formatName from "../../../../utils/formatName";
import {
  getPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const PharmacyItem = ({
  patientId,
  item,
  setDatas,
  editCounter,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...itemInfos };
    if (
      formDatas.name === "" ||
      formDatas.address === "" ||
      formDatas.city === ""
    ) {
      setErrMsgPost(true);
      return;
    }
    if (
      await confirmAlertPopUp({
        content: `You're about to update ${itemInfos.name} infos. This pharmacy will be updated for all patients, proceed ?`,
      })
    ) {
      try {
        await putPatientRecord(
          "/pharmacies",
          item.id,
          auth?.userId,
          auth?.authToken,
          formDatas
        );
        setDatas(
          await getPatientRecord("/pharmacies", patientId, auth?.authToken)
        );
        editCounter.current -= 1;
        setEditVisible(false);
        toast.success("Saved successfully", { containerId: "B" });
      } catch (err) {
        toast.error("Unable to save, please contact admin", {
          containerId: "B",
        });
      }
    }
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      //delete pharmacy for patient only
      //Get the pharmacy itemInfos
      const pharmacy = { ...itemInfos };
      const patients = [...pharmacy.patients];
      const patientsFiltered = patients.filter(
        ({ patients_id }) => patients_id !== patientId
      );
      pharmacy.patients = patientsFiltered;
      await putPatientRecord(
        "/pharmacies",
        item.id,
        auth?.userId,
        auth?.authToken,
        pharmacy
      );
      setDatas(
        await getPatientRecord("/pharmacies", patientId, auth?.authToken)
      );
    }
  };

  return (
    itemInfos && (
      <tr className="pharmacies-item">
        <td>
          {editVisible ? (
            <input
              type="text"
              name="name"
              className="pharmacies-item-input3"
              value={itemInfos.name}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.name
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="address"
              className="pharmacies-item-input1"
              type="text"
              value={itemInfos.address}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.address
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="province_state"
              className="pharmacies-item-input2"
              type="text"
              value={itemInfos.province_state}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.province_state
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="postal_code"
              className="pharmacies-item-input4"
              type="text"
              value={itemInfos.postal_code}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.postal_code
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="city"
              className="pharmacies-item-input2"
              type="text"
              value={itemInfos.city}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.city
          )}
        </td>
        <td>
          {editVisible ? (
            <CountriesList
              name="country"
              handleChange={handleChange}
              value={itemInfos.country}
            />
          ) : (
            itemInfos.country
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="phone"
              className="pharmacies-item-input2"
              type="text"
              value={itemInfos.phone}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.phone
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="fax"
              className="pharmacies-item-input2"
              type="text"
              value={itemInfos.fax}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.fax
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="email"
              className="pharmacies-item-input3"
              type="email"
              value={itemInfos.email}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.email
          )}
        </td>
        <td>
          <em>{formatName(itemInfos.created_by_name.full_name)}</em>
        </td>
        <td>
          <em>{toLocalDate(itemInfos.date_created)}</em>
        </td>
        <td>
          <div className="pharmacies-item-btn-container">
            {!editVisible ? (
              <button onClick={handleEditClick}>Edit</button>
            ) : (
              <input type="submit" value="Save" onClick={handleSubmit} />
            )}
            <button onClick={handleDeleteClick}>Delete</button>
          </div>
        </td>
      </tr>
    )
  );
};

export default PharmacyItem;
