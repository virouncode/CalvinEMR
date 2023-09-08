import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { useNavigate } from "react-router-dom";
import { firstLetterUpper } from "../../utils/firstLetterUpper";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const SignupStaffForm = () => {
  const { auth, clinic, setClinic } = useAuth();
  const [staffAdded, setStaffAdded] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const navigate = useNavigate();
  const [formDatas, setFormDatas] = useState({
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "Male",
    title: "Doctor",
    speciality: "",
    subspeciality: "",
    licence_nbr: "",
    access_level: "User",
    account_status: "Confirmed",
    cell_phone: "",
    backup_phone: "",
    sign: null,
  });

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSignChange = async (e) => {
    const file = e.target.files[0];
    if (file.size > 20000000) {
      alert("File size exceeds 20Mbs, please choose another file");
      return;
    }
    setIsLoadingFile(true);
    // setting up the reader
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
        setFormDatas({ ...formDatas, sign: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setIsLoadingFile(false);
      }
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDatas.confirm_password !== formDatas.password) {
      setErrMsg("Passwords don't match");
      return;
    }

    try {
      const staff = await axiosXano.get("/staff", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      if (
        staff.data.find(
          ({ email }) => email.toLowerCase() === formDatas.email.toLowerCase()
        )
      ) {
        setErrMsg(
          "There is already an account with this email, please choose another one"
        );
        return;
      }
    } catch (err) {
      setErrMsg(`Error: unable to sign up staff: ${err.message}`);
      return;
    }
    try {
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPost = { ...formDatas };

      datasToPost.first_name = firstLetterUpper(datasToPost.first_name);
      datasToPost.middle_name = firstLetterUpper(datasToPost.middle_name);
      datasToPost.last_name = firstLetterUpper(datasToPost.last_name);
      datasToPost.full_name = firstLetterUpper(full_name);
      datasToPost.speciality = firstLetterUpper(datasToPost.speciality);
      datasToPost.subspeciality = firstLetterUpper(datasToPost.subspeciality);
      datasToPost.date_created = Date.parse(new Date());
      delete datasToPost.confirm_password;

      const response = await axiosXano.post("/staff", datasToPost, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });

      await axiosXano.post(
        "/settings",
        {
          staff_id: response.data.id,
          slot_duration: "00:15",
          first_day: "0",
          invitation_templates: [
            {
              name: "In person appointment",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Video appointment",
              intro: `This email/text message is to remind you about your upcoming VIDEO appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: This appointment is online. DO NOT COME TO THE CLINIC.\n\nPlease login 5 minutes before your appointment by clicking the following link:\n[video_call_link]\n\n`,
              message: `You will be directed to the virtual waiting room. The physician will let you in the meeting once available.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Phone appointment",
              intro: `This email/text message is to remind you about your upcoming PHONE appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: This appointment is a phone call. DO NOT COME TO THE CLINIC.\n\n`,
              message: `Please make sure your phone is on and not on mute. The call will come from the clinic, or a No Caller ID number.\nIf you do not answer the phone, the appointment could be cancelled and rescheduled.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Surgery/Procedure",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your Surgery/Procedure.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
            },
            {
              name: "Meeting",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Diagnostic Imaging",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your Diagnostic Imaging procedure (ultrasound, X-ray, etc…)\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
            },
            {
              name: "Blood test / Urine test",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your blood and/or urine test.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
            },
            { name: "[Blank]", intro: "", infos: "", message: "" },
          ],
          clinic_address: "",
          progress_notes_order: "top",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      //update patientsInfos
      const response2 = await axiosXano.get("/staff", {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      setClinic({ ...clinic, staffInfos: response2.data });
      setStaffAdded(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrMsg(err.message);
    }
  };
  return !staffAdded ? (
    <>
      {errMsg && <p className="signup-staff-err">{errMsg}</p>}
      <form className="signup-staff-form" onSubmit={handleSubmit}>
        <div className="signup-staff-form-column">
          <div className="signup-staff-form-row">
            <label>Email*: </label>
            <input
              type="email"
              required
              value={formDatas.email}
              name="email"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Password*: </label>
            <input
              type="password"
              required
              value={formDatas.password}
              name="password"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Confirm Password*: </label>
            <input
              type="password"
              required
              value={formDatas.confirm_password}
              name="confirm_password"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-staff-form-row">
            <label>First Name*: </label>
            <input
              type="text"
              required
              value={formDatas.first_name}
              onChange={handleChange}
              name="first_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Middle Name: </label>
            <input
              type="text"
              value={formDatas.middle_name}
              onChange={handleChange}
              name="middle_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Last Name*: </label>
            <input
              type="text"
              required
              value={formDatas.last_name}
              onChange={handleChange}
              name="last_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Gender*: </label>
            <select
              required
              value={formDatas.gender}
              onChange={handleChange}
              name="gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="signup-staff-form-row">
            <label>Occupation*: </label>
            <select
              required
              value={formDatas.title}
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
          </div>
        </div>
        <div className="signup-staff-form-column">
          <div className="signup-staff-form-row">
            <label>Access Level*: </label>
            <select
              required
              value={formDatas.access_level}
              onChange={handleChange}
              name="access_level"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="signup-staff-form-row">
            <label>Speciality: </label>
            <input
              type="text"
              value={formDatas.speciality}
              onChange={handleChange}
              name="speciality"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Subspeciality: </label>
            <input
              type="text"
              value={formDatas.subspeciality}
              onChange={handleChange}
              name="subspeciality"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Licence nbr: </label>
            <input
              type="text"
              value={formDatas.licence_nbr}
              onChange={handleChange}
              name="licence_nbr"
              autoComplete="off"
              required={formDatas.title === "Doctor"}
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Cell phone*: </label>
            <input
              type="text"
              value={formDatas.cell_phone}
              onChange={handleChange}
              name="cell_phone"
              autoComplete="off"
              required
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Backup phone: </label>
            <input
              type="text"
              value={formDatas.backup_phone}
              onChange={handleChange}
              name="backup_phone"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff-form-row">
            <label>Link for video calls: </label>
            <input
              name="video_link"
              type="text"
              autoComplete="off"
              value={formDatas.video_link}
              onChange={handleChange}
            />
          </div>
          <div className="signup-staff-form-row">
            <label>E-sign: </label>
            <input
              name="sign"
              type="file"
              accept=".jpeg, .jpg, .png, .tif, .pdf, .svg"
              onChange={handleSignChange}
            />
            {isLoadingFile && (
              <CircularProgress size="1rem" style={{ margin: "5px" }} />
            )}
          </div>
          <div className="signup-staff-form-row-submit">
            <input type="submit" value="Sign Up" disabled={isLoadingFile} />
          </div>
        </div>
      </form>
    </>
  ) : (
    <p className="signup-staff-confirm">Staff added successfully</p>
  );
};

export default SignupStaffForm;
