import React, { useState } from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import CountriesList from "../../../Lists/CountriesList";
import useAuth from "../../../../hooks/useAuth";
import { putPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";
import { pharmacySchema } from "../../../../validation/pharmacyValidation";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const PharmacyItem = ({
  patientId,
  item,
  fetchRecord,
  editCounter,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth, user, clinic } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(item);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    setItemInfos({
      ...itemInfos,
      name: firstLetterUpper(itemInfos.name),
      address: firstLetterUpper(itemInfos.address),
      province_state: firstLetterUpper(itemInfos.province_state),
      city: firstLetterUpper(itemInfos.city),
      email: itemInfos.email.toLowerCase(),
    });
    const formDatas = {
      ...itemInfos,
      name: firstLetterUpper(itemInfos.name),
      address: firstLetterUpper(itemInfos.address),
      province_state: firstLetterUpper(itemInfos.province_state),
      city: firstLetterUpper(itemInfos.city),
      email: itemInfos.email.toLowerCase(),
    };
    //Validation
    try {
      await pharmacySchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
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
          user.id,
          auth.authToken,
          formDatas
        );
        const abortController = new AbortController();
        fetchRecord(abortController);
        editCounter.current -= 1;
        setEditVisible(false);
        toast.success("Saved successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to update pharmacy:${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
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
      try {
        await putPatientRecord(
          "/pharmacies",
          item.id,
          user.id,
          auth.authToken,
          pharmacy
        );
        const abortController = new AbortController();
        fetchRecord(abortController);
        toast.success("Saved successfully", { containerId: "B" });
      } catch (err) {
        toast.error(err.message, { containerId: "B" });
      }
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
          <em>
            {staffIdToTitleAndName(
              clinic.staffInfos,
              itemInfos.created_by_id,
              true
            )}
          </em>
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
