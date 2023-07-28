import React, { useState } from "react";
import Calendar from "../components/Calendar/Calendar";
import ToggleView from "../components/Calendar/ToggleView";

const CalendarPage = () => {
  const [timelineVisible, setTimelineVisible] = useState(false);

  return (
    <>
      <ToggleView
        setTimelineVisible={setTimelineVisible}
        timelineVisible={timelineVisible}
      />
      <Calendar timelineVisible={timelineVisible} />
    </>
  );
};

export default CalendarPage;
