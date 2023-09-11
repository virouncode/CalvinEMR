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
import RelationshipsForm from "./RelationshipsForm";
import { toInverseRelation } from "../../utils/toInverseRelation";
import { postPatientRecord, putPatientRecord } from "../../api/fetchRecords";
import { demographicsSchema } from "../../validation/demographicsValidation";
import { patientSchema } from "../../validation/patientValidation";

const SignupPatientForm = () => {
  const { auth, user, clinic, setClinic } = useAuth();
  const [patientAdded, setPatientAdded] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [formDatas, setFormDatas] = useState({
    email: "",
    password: "",
    confirm_password: "",
    access_level: "Patient",
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
      setErrMsg("Passwords don't match");
      return;
    }

    let emptyRelation = false;
    for (let item of relationships) {
      if (item.relationship === "" || item.relation_id === "") {
        emptyRelation = true;
        break;
      }
    }
    if (emptyRelation) {
      setErrMsg("Please define all relationships or remove unnecessary lines");
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
      setErrMsg(`Error: unable to sign up patient: ${err.message}`);
      return;
    }

    try {
      //Formatting
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPost = { ...formDatas };
      datasToPost.email = datasToPost.email.toLowerCase();
      datasToPost.first_name = firstLetterUpper(datasToPost.first_name);
      datasToPost.middle_name = firstLetterUpper(datasToPost.middle_name);
      datasToPost.last_name = firstLetterUpper(datasToPost.last_name);
      datasToPost.full_name = firstLetterUpper(full_name);
      datasToPost.province_state = firstLetterUpper(datasToPost.province_state);
      datasToPost.city = firstLetterUpper(datasToPost.city);
      delete datasToPost.confirm_password;

      //Validation
      try {
        await patientSchema.validate(datasToPost);
      } catch (err) {
        setErrMsg(err.message);
        return;
      }

      //Submission
      const response = await postPatientRecord(
        "/patients",
        user.id,
        auth.authToken,
        datasToPost
      );

      datasToPost.chart_nbr = createChartNbr(
        formDatas.date_of_birth,
        formDatas.gender_identification,
        response.data.id
      );

      await putPatientRecord(
        "/patients",
        response.data.id,
        user.id,
        auth.authToken,
        datasToPost
      );

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

      const relationshipsToPost = [...relationships];
      relationshipsToPost.forEach((relationship) => {
        delete relationship.id;
        relationship.patient_id = response.data.id;
        relationship.created_by_id = user.id;
        relationship.date_created = Date.parse(new Date());
      });

      relationshipsToPost.forEach(
        async (relationship) =>
          await axiosXano.post("/relationships", relationship, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          })
      );

      let inverseRelationsToPost = [...relationshipsToPost];
      inverseRelationsToPost.forEach((item) => {
        const gender = clinic.patientsInfos.filter(
          ({ id }) => id === item.relation_id
        )[0].gender_identification;

        item.patient_id = item.relation_id;
        item.relationship = toInverseRelation(item.relationship, gender);
        item.relation_id = response.data.id;
        item.date_created = Date.parse(new Date());
        item.created_by_id = user.id;
      });

      inverseRelationsToPost.forEach(
        async (relationship) =>
          await axiosXano.post("/relationships", relationship, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          })
      );

      //update patientsInfos
      const response2 = await axiosXano.get("/patients", {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      setClinic({ ...clinic, patientsInfos: response2.data });
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
        toast.error(`Error unable to sload file: ${err.message}`, {
          containerId: "A",
        });
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
            <label htmlFor="email">Email*: </label>
            <input
              id="email"
              type="email"
              value={formDatas.email}
              name="email"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="pwd">Password*: </label>
            <input
              id="pwd"
              type="password"
              value={formDatas.password}
              name="password"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-staff-form-row">
            <label htmlFor="pwd2">Confirm Password*: </label>
            <input
              id="pwd2"
              type="password"
              value={formDatas.confirm_password}
              name="confirm_password"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="firstname">First Name*: </label>
            <input
              id="firstname"
              type="text"
              value={formDatas.first_name}
              onChange={handleChange}
              name="first_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="middlename">Middle Name: </label>
            <input
              id="middlename"
              type="text"
              value={formDatas.middle_name}
              onChange={handleChange}
              name="middle_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="lastname">Last Name*: </label>
            <input
              id="lastname"
              type="text"
              value={formDatas.last_name}
              onChange={handleChange}
              name="last_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="gender_birth">Gender at birth: </label>
            <select
              value={formDatas.gender_at_birth}
              onChange={handleChange}
              name="gender_at_birth"
              id="gender_birth"
              autoComplete="off"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="gender_identification">
              Gender identification:{" "}
            </label>
            <select
              value={formDatas.gender_identification}
              onChange={handleChange}
              name="gender_identification"
              id="gender_identification"
              autoComplete="off"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="dob">Date of birth*: </label>
            <input
              type="date"
              value={
                formDatas.date_of_birth !== null
                  ? toLocalDate(formDatas.date_of_birth)
                  : ""
              }
              onChange={handleChange}
              name="date_of_birth"
              max={toLocalDate(new Date().toISOString())}
              id="dob"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="hin">Health Insurance Nbr: </label>
            <input
              type="text"
              value={formDatas.health_insurance_nbr}
              onChange={handleChange}
              name="health_insurance_nbr"
              autoComplete="off"
              id="hin"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="expiry">Health Card Expiry: </label>
            <input
              type="date"
              value={
                formDatas.health_card_expiry !== null
                  ? toLocalDate(formDatas.health_card_expiry)
                  : ""
              }
              onChange={handleChange}
              name="health_card_expiry"
              id="expiry"
            />
          </div>
        </div>
        <div className="signup-patient-form-column">
          <div className="signup-patient-form-row">
            <label htmlFor="cell_phone">Cell Phone*: </label>
            <input
              type="tel"
              value={formDatas.cell_phone}
              onChange={handleChange}
              name="cell_phone"
              autoComplete="off"
              id="cell_phone"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="home_phone">Home Phone: </label>
            <input
              type="tel"
              value={formDatas.home_phone}
              onChange={handleChange}
              name="home_phone"
              autoComplete="off"
              id="home_phone"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="preferred_phone">Preferred Phone*: </label>
            <input
              type="text"
              value={formDatas.preferred_phone}
              onChange={handleChange}
              name="preferred_phone"
              autoComplete="off"
              id="preferred_phone"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="address">Address*: </label>
            <input
              type="text"
              value={formDatas.address}
              onChange={handleChange}
              name="address"
              autoComplete="off"
              id="address"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="postal">Postal Code*: </label>
            <input
              type="text"
              value={formDatas.postal_code}
              onChange={handleChange}
              name="postal_code"
              autoComplete="off"
              id="postal"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="province">Province/State: </label>
            <input
              type="text"
              value={formDatas.province_state}
              onChange={handleChange}
              name="province_state"
              autoComplete="off"
              id="province"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="city">City*: </label>
            <input
              type="text"
              value={formDatas.city}
              onChange={handleChange}
              name="city"
              autoComplete="off"
              id="city"
            />
          </div>
          <div className="signup-patient-form-row">
            <label htmlFor="country">Country*: </label>
            <CountriesList
              handleChange={handleChange}
              value={formDatas.country}
              name="country"
            />
          </div>
          <RelationshipsForm
            relationships={relationships}
            setRelationships={setRelationships}
          />
          <div className="signup-patient-form-row">
            <label htmlFor="avatar">Avatar: </label>
            <input
              name="avatar"
              type="file"
              accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
              onChange={handleAvatarChange}
              id="avatar"
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
