import React, { useState } from "react";
import Calendar from "../components/Calendar/Calendar";
import ToggleView from "../components/Calendar/ToggleView";
import { Helmet } from "react-helmet";

const CalendarPage = () => {
  const [timelineVisible, setTimelineVisible] = useState(false);

  return (
    <>
      <Helmet>
        <title>Calvin EMR Calendar</title>
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
