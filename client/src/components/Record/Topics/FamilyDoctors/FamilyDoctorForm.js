import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";
import { doctorSchema } from "../../../../validation/doctorValidation";
import { postPatientRecord } from "../../../../api/fetchRecords";
import axiosXano from "../../../../api/xano";
import { toast } from "react-toastify";
import CountriesList from "../../../Lists/CountriesList";
import formatName from "../../../../utils/formatName";
import { toISOStringNoMs, toLocalDate } from "../../../../utils/formatDates";

const FamilyDoctorForm = ({
  setDoctorsList,
  setAddNew,
  patientId,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [formDatas, setFormDatas] = useState({
    name: "",
    speciality: "",
    licence_nbr: "",
    patients: [{ patients_id: patientId }],
    address: "",
    province_state: "",
    postal_code: "",
    city: "",
    country: "",
    phone: "",
    fax: "",
    email: "",
  });
  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      name: firstLetterUpper(formDatas.name),
      speciality: firstLetterUpper(formDatas.speciality),
      address: firstLetterUpper(formDatas.address),
      province_state: firstLetterUpper(formDatas.province_state),
      city: firstLetterUpper(formDatas.city),
      email: formDatas.email.toLowerCase(),
    };
    //Validation
    try {
      await doctorSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord("/doctors", user.id, auth.authToken, datasToPost);
      setAddNew(false);
      const response = await axiosXano.get("/all_doctors", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setDoctorsList(response.data);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to add doctor: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  return (
    <tr className="doctors-form">
      <td>
        <input
          name="name"
          type="text"
          value={formDatas.name}
          className="doctors-form-input3"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="speciality"
          type="text"
          value={formDatas.speciality}
          className="doctors-form-input3"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="licence_nbr"
          type="text"
          value={formDatas.licence_nbr}
          className="doctors-form-input3"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="address"
          type="text"
          value={formDatas.address}
          className="doctors-form-input1"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="province_state"
          type="text"
          value={formDatas.province_state}
          className="doctors-form-input2"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="postal_code"
          type="text"
          value={formDatas.postal_code}
          className="doctors-form-input4"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="city"
          type="text"
          value={formDatas.city}
          className="doctors-form-input2"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <CountriesList
          handleChange={handleChange}
          name="country"
          value={formDatas.country}
        />
      </td>
      <td>
        <input
          name="phone"
          type="text"
          value={formDatas.phone}
          className="doctors-form-input2"
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          name="fax"
          type="text"
          value={formDatas.fax}
          className="doctors-form-input2"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="email"
          type="text"
          value={formDatas.email}
          className="doctors-form-input3"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{formatName(user.name)}</em>
      </td>
      <td>
        <em>{toLocalDate(toISOStringNoMs(new Date()))}</em>
      </td>
      <td style={{ textAlign: "center" }}>
        <input type="submit" value="Save" onClick={handleSubmit} />
      </td>
    </tr>
  );
};

export default FamilyDoctorForm;
