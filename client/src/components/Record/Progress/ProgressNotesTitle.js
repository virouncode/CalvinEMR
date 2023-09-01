//Librairies
import React from "react";
//Components
import TriangleButton from "../Buttons/TriangleButton";
//Utils
import { getAge } from "../../../utils/getAge";

const ProgressNotesTitle = ({
  patientInfos,
  allContentsVisible,
  contentRef,
  triangleRef,
  setSelectAllDisabled,
}) => {
  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    contentRef.current.classList.toggle("progress-notes-content--active");
    setSelectAllDisabled((d) => !d);
  };

  return (
    <div className="progress-notes-title">
      <div>
        <TriangleButton
          handleTriangleClick={handleTriangleClick}
          className={
            allContentsVisible ? "triangle triangle--active" : "triangle"
          }
          color="#21201e"
          triangleRef={triangleRef}
        />
        <strong style={{ marginLeft: "10px" }}>PROGRESS NOTES </strong>
      </div>
      <span>
        {patientInfos.full_name}, {patientInfos.gender_at_birth},{" "}
        {getAge(patientInfos.date_of_birth)}, Chart Nbr:{" "}
        {patientInfos.chart_nbr},{" "}
        <i className="fa-regular fa-envelope fa-sm"></i> {patientInfos.email},{" "}
        <i className="fa-solid fa-phone fa-sm"></i>{" "}
        {patientInfos.preferred_phone}
      </span>
    </div>
  );
};

export default ProgressNotesTitle;
