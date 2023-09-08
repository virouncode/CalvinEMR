import React, { useEffect, useState } from "react";
import axiosXanoPatient from "../../../api/xanoPatient";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { toLocalDate } from "../../../utils/formatDates";
import { getAge } from "../../../utils/getAge";
import DoctorsList from "../../Lists/DoctorsLists";
import CountriesList from "../../Lists/CountriesList";
import StudentsList from "../../Lists/StudentsList";
import NursesList from "../../Lists/NursesList";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const AccountPatientForm = () => {
  //HOOKS
  const { auth, user, clinic, setClinic } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(user.demographics);
  const [tempFormDatas, setTempFormDatas] = useState(user.demographics);
  const [errMsg, setErrMsg] = useState("");
  const [errMsgPost, setErrMsgPost] = useState("");
  const navigate = useNavigate();
  const [infosChanged, setInfosChanged] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeCredentials = (e) => {
    navigate("/patient/credentials");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file.size > 20000000) {
      alert("File size exceeds 20Mbs, please choose another file");
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await axiosXanoPatient.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        console.log(fileToUpload.data);
        setTempFormDatas({ ...tempFormDatas, avatar: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "A",
        });
      }
    };
  };
  const handleEdit = (e) => {
    setEditVisible(true);
  };

  const handleSave = async (e) => {
    try {
      const full_name =
        tempFormDatas.first_name +
        " " +
        (tempFormDatas.middle_name ? tempFormDatas.middle_name + " " : "") +
        tempFormDatas.last_name;

      const datasToPut = { ...tempFormDatas };

      datasToPut.first_name = firstLetterUpper(datasToPut.first_name);
      datasToPut.middle_name = firstLetterUpper(datasToPut.middle_name);
      datasToPut.last_name = firstLetterUpper(datasToPut.last_name);
      datasToPut.full_name = firstLetterUpper(full_name);

      await axiosXanoPatient.put(`/staff/${user.id}`, datasToPut, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setInfosChanged(true);
      //update clinic context staffInfos
      const response = await axiosXanoPatient.get("/patients", {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      setClinic({ ...clinic, patientInfos: response.data });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
    }
  };

  const handleCancel = (e) => {
    setTempFormDatas(formDatas);
    setEditVisible(false);
  };

  return !infosChanged ? (
    <>
      {errMsg && <p className="patient-account-err">{errMsg}</p>}
      <form className="patient-account-form">
        <div className="patient-account-form-content">
          {errMsgPost && editVisible && (
            <div className="patient-account-form-content-errpost">
              Unable to save form
            </div>
          )}
          {errMsg && editVisible && (
            <p className="patient-account-form-content-err">Invalid fields</p>
          )}
          <div className="patient-account-form-content-column">
            <div className="patient-account-form-content-column-img">
              {isLoadingFile ? (
                <CircularProgress />
              ) : tempFormDatas.avatar ? (
                <img
                  src={`${BASE_URL}${tempFormDatas.avatar.path}`}
                  alt="user-avatar"
                />
              ) : (
                <img
                  src="https://placehold.co/300x500/png?font=roboto&text=Profile\nPic"
                  alt="user-avatar-placeholder"
                />
              )}
              {editVisible && (
                <input
                  name="avatar"
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
                  onChange={handleAvatarChange}
                />
              )}
            </div>
          </div>
          <div className="patient-account-form-content-column">
            <div className="patient-account-form-content-row">
              <label>First Name: </label>
              {editVisible ? (
                <input
                  type="text"
                  required
                  value={tempFormDatas.first_name}
                  onChange={handleChange}
                  name="first_name"
                  id="1"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.first_name
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Middle Name: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.middle_name}
                  onChange={handleChange}
                  name="middle_name"
                  id="2"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.middle_name
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Last Name: </label>
              {editVisible ? (
                <input
                  type="text"
                  required
                  value={tempFormDatas.last_name}
                  onChange={handleChange}
                  name="last_name"
                  id="3"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.last_name
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Email: </label>
              {user.demographics.email}
            </div>
            <div className="patient-account-form-content-row">
              <label>Gender at birth: </label>
              {editVisible ? (
                <select
                  id="4"
                  value={tempFormDatas.gender_at_birth}
                  onChange={handleChange}
                  name="gender_at_birth"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                tempFormDatas.gender_at_birth
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Gender identification: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.gender_identification}
                  onChange={handleChange}
                  name="gender_identification"
                  id="5"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.gender_identification
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Chart Nbr: </label>
              {tempFormDatas.chart_nbr}
            </div>
            <div className="patient-account-form-content-row">
              <label>Health Insurance Nbr: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.health_insurance_nbr.toString()}
                  onChange={handleChange}
                  name="health_insurance_nbr"
                  id="6"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.health_insurance_nbr
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Health Card Expiry: </label>
              {editVisible ? (
                <input
                  type="date"
                  value={
                    tempFormDatas.health_card_expiry !== null
                      ? toLocalDate(tempFormDatas.health_card_expiry)
                      : ""
                  }
                  onChange={handleChange}
                  name="health_card_expiry"
                  id="7"
                />
              ) : tempFormDatas.health_card_expiry !== null ? (
                toLocalDate(tempFormDatas.health_card_expiry)
              ) : (
                ""
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Date of birth: </label>
              {editVisible ? (
                <input
                  type="date"
                  required
                  value={
                    tempFormDatas.date_of_birth !== null
                      ? toLocalDate(tempFormDatas.date_of_birth)
                      : ""
                  }
                  onChange={handleChange}
                  name="date_of_birth"
                  id="8"
                  max={toLocalDate(new Date().toISOString())}
                />
              ) : tempFormDatas.date_of_birth !== null ? (
                toLocalDate(tempFormDatas.date_of_birth)
              ) : (
                ""
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Age: </label>
              {tempFormDatas.date_of_birth !== null
                ? getAge(toLocalDate(tempFormDatas.date_of_birth))
                : ""}
            </div>
            <div className="patient-account-form-content-row">
              <label>Cell Phone: </label>
              {editVisible ? (
                <input
                  type="tel"
                  value={tempFormDatas.cell_phone}
                  onChange={handleChange}
                  name="cell_phone"
                  id="9"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.cell_phone
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Home Phone: </label>
              {editVisible ? (
                <input
                  type="tel"
                  value={tempFormDatas.home_phone}
                  onChange={handleChange}
                  name="home_phone"
                  id="10"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.home_phone
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Preferred Phone: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.preferred_phone}
                  onChange={handleChange}
                  name="preferred_phone"
                  id="11"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.preferred_phone
              )}
            </div>
          </div>
          <div className="patient-account-form-content-column">
            <div className="patient-account-form-content-row">
              <label>Address: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.address}
                  onChange={handleChange}
                  name="address"
                  id="12"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.address
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Postal Code: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.postal_code}
                  onChange={handleChange}
                  name="postal_code"
                  id="13"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.postal_code
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Province State: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.province_state}
                  onChange={handleChange}
                  name="province_state"
                  id="14"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.province_state
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>City: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.city}
                  onChange={handleChange}
                  name="city"
                  id="15"
                  autoComplete="off"
                />
              ) : (
                tempFormDatas.city
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Country: </label>
              {editVisible ? (
                <CountriesList
                  id="16"
                  handleChange={handleChange}
                  value={tempFormDatas.country}
                  name="country"
                />
              ) : (
                tempFormDatas.country
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Assigned MD: </label>
              {editVisible ? (
                <DoctorsList
                  value={tempFormDatas.assigned_md_id}
                  handleChange={handleChange}
                  name="assigned_md_id"
                  id="17"
                  staffInfos={clinic.staffInfos}
                />
              ) : (
                tempFormDatas.assigned_md_name?.full_name
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Assigned Resident: </label>
              {editVisible ? (
                <DoctorsList
                  value={tempFormDatas.assigned_resident_id}
                  handleChange={handleChange}
                  name="assigned_resident_id"
                  id="18"
                  staffInfos={clinic.staffInfos}
                />
              ) : (
                tempFormDatas.assigned_resident_name?.full_name
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Assigned Student: </label>
              {editVisible ? (
                <StudentsList
                  value={tempFormDatas.assigned_student_id}
                  handleChange={handleChange}
                  name="assigned_student_id"
                  id="19"
                  staffInfos={clinic.staffInfos}
                />
              ) : (
                tempFormDatas.assigned_student_name?.full_name
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Assigned Nurse: </label>
              {editVisible ? (
                <NursesList
                  value={tempFormDatas.assigned_nurse_id}
                  handleChange={handleChange}
                  name="assigned_nurse_id"
                  id="20"
                  staffInfos={clinic.staffInfos}
                />
              ) : (
                tempFormDatas.assigned_nurse_name?.full_name
              )}
            </div>
            <div className="patient-account-form-content-row">
              <label>Assigned Midwife: </label>
              {editVisible ? (
                <NursesList
                  value={tempFormDatas.assigned_midwife_id}
                  handleChange={handleChange}
                  name="assigned_midwife_id"
                  id="21"
                  staffInfos={clinic.staffInfos}
                />
              ) : (
                tempFormDatas.assigned_midwife_name?.full_name
              )}
            </div>
          </div>
        </div>
      </form>
      <div className="myaccount-section-btns">
        {editVisible ? (
          <>
            <button onClick={handleSave} disabled={isLoadingFile}>
              Save
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleChangeCredentials}>
              Change credentials
            </button>
          </>
        )}
      </div>
    </>
  ) : (
    <p className="myaccount-section-confirm">Infos changed successfully</p>
  );
};

export default AccountPatientForm;
