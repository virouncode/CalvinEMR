//Librairies
import React, { useEffect, useState } from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";

const MeasurementsContent = ({ patientId, datas, setDatas }) => {
  //HOOKS
  const [lastMeasurement, setLastMeasurement] = useState({});
  useRecord("/measurements", patientId, setDatas);
  useEffect(() => {
    if (datas) {
      setLastMeasurement(
        datas.sort(
          (a, b) => new Date(b.date_created) - new Date(a.date_created)
        )[0]
      );
    }
  }, [datas]);

  return datas ? (
    <div className="patient-measurements-content">
      {datas.length >= 1 ? (
        <>
          <p>
            <label>Heigth(cm): </label>
            {lastMeasurement.height_cm}
          </p>
          <p>
            <label>Height(feet): </label>
            {lastMeasurement.height_feet}
          </p>
          <p>
            <label>Weight(kg): </label>
            {lastMeasurement.weight_kg}
          </p>
          <p>
            <label>Weight(lbs): </label>
            {lastMeasurement.weight_lbs}
          </p>
          <p>
            <label>Waist Circumference(cm): </label>
            {lastMeasurement.waist_circumference}
          </p>
          <p>
            <label>Body Mass Index(kg/m2): </label>
            {lastMeasurement.body_mass_index}
          </p>
          <p>
            <label>Body Surface Area(m2): </label>
            {lastMeasurement.body_surface_area}
          </p>
          <p>
            <label>Systolic(mmHg): </label>
            {lastMeasurement.blood_pressure_systolic}
          </p>
          <p>
            <label>Diastolic(mmHg): </label>
            {lastMeasurement.blood_pressure_diastolic}
          </p>
        </>
      ) : (
        "No measurements"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MeasurementsContent;
