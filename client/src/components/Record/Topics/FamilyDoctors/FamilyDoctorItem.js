//Librairies
import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toLocalDate } from "../../../../utils/formatDates";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";
import { doctorSchema } from "../../../../validation/doctorValidation";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import { putPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";
import CountriesList from "../../../Lists/CountriesList";

const FamilyDoctorItem = ({
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
      speciality: firstLetterUpper(itemInfos.speciality),
      address: firstLetterUpper(itemInfos.address),
      province_state: firstLetterUpper(itemInfos.province_state),
      city: firstLetterUpper(itemInfos.city),
      email: itemInfos.email.toLowerCase(),
    });
    const formDatas = {
      ...itemInfos,
      name: firstLetterUpper(itemInfos.name),
      speciality: firstLetterUpper(itemInfos.speciality),
      address: firstLetterUpper(itemInfos.address),
      province_state: firstLetterUpper(itemInfos.province_state),
      city: firstLetterUpper(itemInfos.city),
      email: itemInfos.email.toLowerCase(),
    };
    //Validation
    try {
      await doctorSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    if (
      await confirmAlertPopUp({
        content: `You're about to update ${itemInfos.name} infos. This doctor will be updated for all patients, proceed ?`,
      })
    ) {
      try {
        await putPatientRecord(
          "/doctors",
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
        toast.error(`Error: unable to update doctor:${err.message}`, {
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
        content:
          "Do you really want to remove this doctor from the patient record ?",
      })
    ) {
      //delete doctor for patient only
      //Get the doctor itemInfos
      const doctor = { ...itemInfos };
      const patients = [...doctor.patients];
      const patientsFiltered = patients.filter((id) => id !== patientId);
      doctor.patients = patientsFiltered;
      try {
        await putPatientRecord(
          "/doctors",
          item.id,
          user.id,
          auth.authToken,
          doctor
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
      <tr className="doctors-item">
        <td>
          {editVisible ? (
            <input
              type="text"
              name="name"
              className="doctors-item-input3"
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
              type="text"
              name="speciality"
              className="doctors-item-input3"
              value={itemInfos.speciality}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.speciality
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="licence_nbr"
              className="doctors-item-input3"
              value={itemInfos.licence_nbr}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.licence_nbr
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="address"
              className="doctors-item-input1"
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
              className="doctors-item-input2"
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
              className="doctors-item-input4"
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
              className="doctors-item-input2"
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
              className="doctors-item-input2"
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
              className="doctors-item-input2"
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
              className="doctors-item-input3"
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
          <div className="doctors-item-btn-container">
            {!editVisible ? (
              <button onClick={handleEditClick}>Edit</button>
            ) : (
              <input type="submit" value="Save" onClick={handleSubmit} />
            )}
            <button onClick={handleDeleteClick}>Remove</button>
          </div>
        </td>
      </tr>
    )
  );
};

export default FamilyDoctorItem;
