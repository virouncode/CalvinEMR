import React from "react";

const ToggleView = ({ timelineVisible, setTimelineVisible }) => {
  const handleClickCalendar = (e) => {
    setTimelineVisible(false);
  };
  const handleClickRooms = (e) => {
    setTimelineVisible(true);
  };
  return (
    <div className="toggle-view">
      <p
        className={
          timelineVisible
            ? "toggle-view-option"
            : "toggle-view-option toggle-view-option--active"
        }
        onClick={handleClickCalendar}
      >
        Calendar
      </p>
      <p
        className={
          timelineVisible
            ? "toggle-view-option toggle-view-option--active"
            : "toggle-view-option"
        }
        onClick={handleClickRooms}
      >
        Rooms
      </p>
    </div>
  );
};

export default ToggleView;
