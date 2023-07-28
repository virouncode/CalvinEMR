import React from "react";
import TriangleButton from "../Buttons/TriangleButton";
import PopUpButton from "../Buttons/PopUpButton";

const PatientTopicHeader = ({
  topic,
  handleTriangleClick,
  handlePopUpClick,
  allContentsVisible,
}) => {
  return (
    <>
      <TriangleButton
        handleTriangleClick={handleTriangleClick}
        className={
          allContentsVisible ? "triangle triangle--active" : "triangle"
        }
        color="#FEFEFE"
      />
      {topic}
      <PopUpButton handlePopUpClick={handlePopUpClick} />
    </>
  );
};

export default PatientTopicHeader;
