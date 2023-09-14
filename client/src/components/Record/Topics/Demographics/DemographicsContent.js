//Librairies
import React from "react";
//Utils
import { getAge } from "../../../../utils/getAge";
import { toLocalDate } from "../../../../utils/formatDates";
import { CircularProgress } from "@mui/material";
import avatar from "../../../../assets/img/avatar.png";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const DemographicsContent = ({ patientInfos }) => {
  return patientInfos ? (
    <div className="patient-demo-content">
      <div className="patient-demo-content-infos">
        <p>
          <label>First Name: </label>
          {patientInfos.first_name}
        </p>
        <p>
          <label>Middle Name: </label>
          {patientInfos.middle_name}
        </p>
        <p>
          <label>Last Name: </label>
          {patientInfos.last_name}
        </p>
        <p>
          <label>Gender at birth: </label>
          {patientInfos.gender_at_birth}
        </p>
        <p>
          <label>Gender identification: </label>
          {patientInfos.gender_identification}
        </p>
        <p>
          <label>Chart Nbr: </label>
          {patientInfos.chart_nbr}
        </p>
        <p>
          <label>Health Insurance Nbr: </label>
          {patientInfos.health_insurance_nbr}
        </p>
        <p>
          <label>Health Card Expiry: </label>
          {toLocalDate(patientInfos.health_card_expiry)}
        </p>
        <p>
          <label>Date of birth: </label>
          {toLocalDate(patientInfos.date_of_birth)}
        </p>
        <p>
          <label>Age: </label>
          {getAge(patientInfos.date_of_birth)}
        </p>
        <p>
          <label>Email: </label>
          {patientInfos.email}
        </p>
        <p>
          <label>Cell Phone: </label>
          {patientInfos.cell_phone}
        </p>
        <p>
          <label>Home Phone: </label>
          {patientInfos.home_phone}
        </p>
        <p>
          <label>Preferred Phone: </label>
          {patientInfos.preferred_phone}
        </p>
        <p>
          <label>Address: </label>
          {patientInfos.address}
        </p>
        <p>
          <label>Postal Code: </label>
          {patientInfos.postal_code}
        </p>
        <p>
          <label>Province/State: </label>
          {patientInfos.province_state}
        </p>
        <p>
          <label>City: </label>
          {patientInfos.city}
        </p>
        <p>
          <label>Country: </label>
          {patientInfos.country}
        </p>
        <p>
          <label>Assigned MD: </label>
          {patientInfos.assigned_md_name?.full_name}
        </p>
        <p>
          <label>Assigned Resident: </label>
          {patientInfos.assigned_resident_name?.full_name}
        </p>
        <p>
          <label>Assigned Student: </label>
          {patientInfos.assigned_student_name?.full_name}
        </p>
        <p>
          <label>Assigned Nurse: </label>
          {patientInfos.assigned_nurse_name?.full_name}
        </p>
        <p>
          <label>Assigned Midwife: </label>
          {patientInfos.assigned_midwife_name?.full_name}
        </p>
      </div>
      <div className="patient-demo-content-avatar">
        {patientInfos.avatar ? (
          <img
            src={`${BASE_URL}${patientInfos.avatar.path}`}
            alt="user-avatar"
          />
        ) : (
          <img src={avatar} alt="user-avatar-placeholder" />
        )}
      </div>
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default DemographicsContent;
