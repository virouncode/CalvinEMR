import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Calendar from "../components/Calendar/Calendar";
import ToggleView from "../components/Calendar/ToggleView";

const CalendarPage = () => {
  const [timelineVisible, setTimelineVisible] = useState(false);

  return (
    <>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <ToggleView
        setTimelineVisible={setTimelineVisible}
        timelineVisible={timelineVisible}
      />
      <Calendar timelineVisible={timelineVisible} />
    </>
  );
};

export default CalendarPage;
