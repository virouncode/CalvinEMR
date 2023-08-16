import React, { useState } from "react";
import { toLocalDate } from "../../utils/formatDates";
import CountriesList from "../Lists/CountriesList";
import axiosXano from "../../api/xano";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { createChartNbr } from "../../utils/createChartNbr";
import { firstLetterUpper } from "../../utils/firstLetterUpper";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const SignupPatientForm = () => {
  const { auth } = useAuth();
  const [patientAdded, setPatientAdded] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [formDatas, setFormDatas] = useState({
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender_at_birth: "Male",
    gender_identification: "Male",
    date_of_birth: "",
    health_insurance_nbr: "",
    health_card_expiry: null,
    cell_phone: "",
    home_phone: "",
    preferred_phone: "",
    address: "",
    postal_code: "",
    province_state: "",
    city: "",
    country: "",
    account_status: "Confirmed",
    avatar: null,
  });
  const handleSubmit = async (e) => {
    //DONT FORGET TO GENERATE CHART NUMBER AND POST VACCINES
    e.preventDefault();
    if (formDatas.confirm_password !== formDatas.password) {
      setErrMsg("You entered two different passwords");
      return;
    }

    try {
      const patients = await axiosXano.get("/patients", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      if (
        patients.data.find(
          ({ email }) => email.toLowerCase() === formDatas.email.toLowerCase()
        )
      ) {
        setErrMsg(
          "There is already an account with this email, please choose another one"
        );
        return;
      }
    } catch (err) {
      setErrMsg(err.message);
      return;
    }

    try {
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPost = { ...formDatas };
      datasToPost.city = firstLetterUpper(datasToPost.city);
      datasToPost.first_name = firstLetterUpper(datasToPost.first_name);
      datasToPost.middle_name = firstLetterUpper(datasToPost.middle_name);
      datasToPost.last_name = firstLetterUpper(datasToPost.last_name);
      datasToPost.full_name = firstLetterUpper(full_name);
      datasToPost.province_state = firstLetterUpper(datasToPost.province_state);
      datasToPost.date_created = Date.parse(new Date());
      delete datasToPost.confirm_password;

      const response = await axiosXano.post("/patients", datasToPost, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      datasToPost.chart_nbr = createChartNbr(
        formDatas.date_of_birth,
        formDatas.gender_identification,
        response.data.id
      );

      await axiosXano.put(`/patients/${response.data.id}`, datasToPost, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });

      const vaccinesDatas = {
        patient_id: response.data.id,
        ages: [
          "2_months",
          "4_months",
          "6_months",
          "1_year",
          "15_months",
          "18_months",
          "4_years",
          "grade_7",
          "14_years",
          "24_years",
          "34_years",
          "65_years",
        ],
        "DTaP-IPV-Hib": {
          "2_months": {},
          "4_months": {},
          "6_months": {},
          "18_months": {},
        },
        "Pneu-C-13": {
          "2_months": {},
          "4_months": {},
          "1_year": {},
        },
        "Rot-1": {
          "2_months": {},
          "4_months": {},
        },
        "Men-C-C": {
          "1_year": {},
        },
        MMR: {
          "1_year": {},
        },
        Var: {
          "15_months": {},
        },
        MMRV: {
          "4_years": {},
        },
        "Tdap-IPV": {
          "4_years": {},
        },
        HB: {
          grade7: [],
        },
        "Men-C-ACYW": {
          grade_7: {},
        },
        Tdap: {
          "14_years": {},
          "24_years": {},
        },
        Td_booster: {
          "34_years": [],
        },
        HZ: {
          "65_years": [],
        },
        "Pneu-P-23": {
          "65_years": {},
        },
        Tdap_pregnancy: {
          grade_7: [],
        },
        Inf: {
          "6_months": [],
        },
        "HPV-9": {
          grade_7: [],
        },
        observations: "",
      };

      await axiosXano.post("/vaccines", vaccinesDatas, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setPatientAdded(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrMsg(err.message);
    }
  };
  const handleChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "health_card_expiry" || name === "date_of_birth") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleAvatarChange = (e) => {
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
        let fileToUpload = await axiosXano.post("/upload/attachment_register", {
          content: content,
        });
        setFormDatas({ ...formDatas, avatar: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(err.message, { containerId: "A" });
        setIsLoadingFile(false);
      }
    };
  };

  const navigate = useNavigate();

  return !patientAdded ? (
    <>
      {errMsg && <p className="signup-patient-err">{errMsg}</p>}
      <form className="signup-patient-form" onSubmit={handleSubmit}>
        <div className="signup-patient-form-column">
          <div className="signup-patient-form-row">
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
          <div className="signup-patient-form-row">
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
          <div className="signup-patient-form-row">
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
          <div className="signup-patient-form-row">
            <label>Middle Name: </label>
            <input
              type="text"
              value={formDatas.middle_name}
              onChange={handleChange}
              name="middle_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
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
          <div className="signup-patient-form-row">
            <label>Gender at birth: </label>
            <select
              value={formDatas.gender_at_birth}
              onChange={handleChange}
              name="gender_at_birth"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="signup-patient-form-row">
            <label>Gender identification: </label>
            <select
              value={formDatas.gender_identification}
              onChange={handleChange}
              name="gender_identification"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="signup-patient-form-row">
            <label>Date of birth*: </label>
            <input
              type="date"
              required
              value={
                formDatas.date_of_birth !== null
                  ? toLocalDate(formDatas.date_of_birth)
                  : ""
              }
              onChange={handleChange}
              name="date_of_birth"
              max={toLocalDate(new Date().toISOString())}
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Health Insurance Nbr: </label>
            <input
              type="text"
              value={formDatas.health_insurance_nbr}
              onChange={handleChange}
              name="health_insurance_nbr"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Health Card Expiry: </label>
            <input
              type="date"
              value={
                formDatas.health_card_expiry !== null
                  ? toLocalDate(formDatas.health_card_expiry)
                  : ""
              }
              onChange={handleChange}
              name="health_card_expiry"
            />
          </div>
        </div>
        <div className="signup-patient-form-column">
          <div className="signup-patient-form-row">
            <label>Cell Phone*: </label>
            <input
              type="tel"
              value={formDatas.cell_phone}
              onChange={handleChange}
              name="cell_phone"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Home Phone: </label>
            <input
              type="tel"
              value={formDatas.home_phone}
              onChange={handleChange}
              name="home_phone"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Preferred Phone: </label>
            <input
              type="text"
              value={formDatas.preferred_phone}
              onChange={handleChange}
              name="preferred_phone"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Address*: </label>
            <input
              required
              type="text"
              value={formDatas.address}
              onChange={handleChange}
              name="address"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Postal Code*: </label>
            <input
              required
              type="text"
              value={formDatas.postal_code}
              onChange={handleChange}
              name="postal_code"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Province/State: </label>
            <input
              type="text"
              value={formDatas.province_state}
              onChange={handleChange}
              name="province_state"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>City*: </label>
            <input
              required
              type="text"
              value={formDatas.city}
              onChange={handleChange}
              name="city"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Country*: </label>
            <CountriesList
              required
              handleChange={handleChange}
              value={formDatas.country}
              name="country"
            />
          </div>
          <div className="signup-patient-form-row">
            <label>Avatar: </label>
            <input
              name="avatar"
              type="file"
              accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
              onChange={handleAvatarChange}
            />
            {isLoadingFile && (
              <CircularProgress size="1rem" style={{ margin: "5px" }} />
            )}
          </div>
          <div className="signup-patient-form-row-submit">
            <input type="submit" value="Sign Up" disabled={isLoadingFile} />
          </div>
        </div>
      </form>
    </>
  ) : (
    <span className="signup-patient-confirm">Patient added successfully</span>
  );
};

export default SignupPatientForm;
