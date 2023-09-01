import React, { useState } from "react";
import Calendar from "../components/Calendar/Calendar";
import ToggleView from "../components/Calendar/ToggleView";
import DocumentViewerComponent from "../components/DocumentViewerComponent";

const CalendarPage = () => {
  const [timelineVisible, setTimelineVisible] = useState(false);

  return (
    <>
      {/* <DocumentViewerComponent /> */}
      <ToggleView
        setTimelineVisible={setTimelineVisible}
        timelineVisible={timelineVisible}
      />
      <Calendar timelineVisible={timelineVisible} />
    </>
  );
};

export default CalendarPage;
