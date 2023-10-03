import React, { useEffect, useState } from "react";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { firstLetterUpper } from "../../utils/firstLetterUpper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { myAccountSchema } from "../../validation/myAccountValidation";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const MyAccountForm = () => {
  //HOOKS
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(null);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const { auth, user, clinic, setClinic } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMyInfos = async () => {
      try {
        const response = await axiosXano.get(`/staff/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setFormDatas(response.data);
        setTempFormDatas(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch your account infos: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchMyInfos();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeCredentials = (e) => {
    navigate("/credentials");
  };

  const handleSignChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsg("");
    if (file.size > 25000000) {
      setErrMsg("File is over 25Mb, please choose another file");
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
        let fileToUpload = await axiosXano.post(
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
        setTempFormDatas({ ...tempFormDatas, sign: fileToUpload.data });
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

      //Formatting
      datasToPut.first_name = firstLetterUpper(datasToPut.first_name);
      datasToPut.middle_name = firstLetterUpper(datasToPut.middle_name);
      datasToPut.last_name = firstLetterUpper(datasToPut.last_name);
      datasToPut.full_name = firstLetterUpper(full_name);
      datasToPut.speciality = firstLetterUpper(datasToPut.speciality);
      datasToPut.subspeciality = firstLetterUpper(datasToPut.subspeciality);
      datasToPut.date_created = Date.now();

      //Validation
      try {
        await myAccountSchema.validate(datasToPut);
      } catch (err) {
        setErrMsg(err.message);
        return;
      }

      //Submission
      await axiosXano.put(`/staff/${user.id}`, datasToPut, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setSuccessMsg(
        "Infos changed successfully, we will redirect you to the login page"
      );
      //update clinic context staffInfos
      const response = await axiosXano.get("/staff", {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      setClinic({ ...clinic, staffInfos: response.data });
      localStorage.setItem(
        "clinic",
        JSON.stringify({ ...clinic, staffInfos: response.data })
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
    }
  };

  const handleCancel = (e) => {
    setTempFormDatas(formDatas);
    setEditVisible(false);
  };

  return (
    <div className="myaccount-section-container">
      {errMsg && <p className="myaccount-section-err">{errMsg}</p>}
      {successMsg && <p className="myaccount-section-confirm">{successMsg}</p>}
      {tempFormDatas && (
        <div className="myaccount-section-form">
          <div className="myaccount-section-form-column">
            <div className="myaccount-section-form-row">
              <label>Email*: </label>
              <p>{tempFormDatas.email}</p>
            </div>
            <div className="myaccount-section-form-row">
              <label>First Name*: </label>
              {editVisible ? (
                <input
                  type="text"
                  required
                  value={tempFormDatas.first_name}
                  onChange={handleChange}
                  name="first_name"
                  autoComplete="off"
                />
              ) : (
                <p>{tempFormDatas.first_name}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Middle Name: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.middle_name}
                  onChange={handleChange}
                  name="middle_name"
                  autoComplete="off"
                />
              ) : (
                <p>{tempFormDatas.middle_name}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Last Name*: </label>
              {editVisible ? (
                <input
                  type="text"
                  required
                  value={tempFormDatas.last_name}
                  onChange={handleChange}
                  name="last_name"
                  autoComplete="off"
                />
              ) : (
                <p>{tempFormDatas.last_name}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Gender*: </label>
              {editVisible ? (
                <select
                  required
                  value={tempFormDatas.gender}
                  onChange={handleChange}
                  name="gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p>{tempFormDatas.gender}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Occupation*: </label>
              {editVisible ? (
                <select
                  required
                  value={tempFormDatas.title}
                  onChange={handleChange}
                  name="title"
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Medical Student">Medical Student</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Nursing Student">Nursing Student</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Ultra Sound Technician">
                    Ultra Sound Technician
                  </option>
                  <option value="Nutritionist">Nutritionist</option>
                  <option value="Physiotherapist">Physiotherapist</option>
                  <option value="Psychologist">Psychologist</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p>{tempFormDatas.title}</p>
              )}
            </div>
          </div>
          <div className="signup-staff-form-column">
            <div className="myaccount-section-form-row">
              <label>Speciality: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.speciality}
                  onChange={handleChange}
                  name="speciality"
                  autoComplete="off"
                />
              ) : (
                <p>{tempFormDatas.speciality}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Subspeciality: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.subspeciality}
                  onChange={handleChange}
                  name="subspeciality"
                  autoComplete="off"
                />
              ) : (
                <p>{tempFormDatas.subspeciality}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Licence nbr: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.licence_nbr}
                  onChange={handleChange}
                  name="licence_nbr"
                  autoComplete="off"
                  required={tempFormDatas.title === "Doctor"}
                />
              ) : (
                <p>{tempFormDatas.licence_nbr}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Cell phone*: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.cell_phone}
                  onChange={handleChange}
                  name="cell_phone"
                  autoComplete="off"
                  required
                />
              ) : (
                <p>{tempFormDatas.cell_phone}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Backup phone: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.backup_phone}
                  onChange={handleChange}
                  name="backup_phone"
                  autoComplete="off"
                />
              ) : (
                <p>{tempFormDatas.backup_phone}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>Link for video calls: </label>
              {editVisible ? (
                <input
                  name="video_link"
                  type="text"
                  autoComplete="off"
                  value={tempFormDatas.video_link}
                  onChange={handleChange}
                />
              ) : (
                <p>{tempFormDatas.video_link}</p>
              )}
            </div>
            <div className="myaccount-section-form-row">
              <label>E-sign: </label>
              <div className="myaccount-section-form-row-image">
                {isLoadingFile ? (
                  <CircularProgress />
                ) : tempFormDatas.sign ? (
                  <img
                    src={`${BASE_URL}${tempFormDatas.sign?.path}`}
                    alt="e-sign"
                    width="150px"
                  />
                ) : (
                  <img
                    src="https://placehold.co/200x100/png?font=roboto&text=Sign"
                    alt="user-avatar-placeholder"
                  />
                )}
                {editVisible && (
                  <input
                    name="sign"
                    type="file"
                    accept=".jpeg, .jpg, .png, .tif, .pdf, .svg"
                    onChange={handleSignChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
              Change email/password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccountForm;
