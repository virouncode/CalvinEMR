//Librairies
import React from "react";
//Components
import FilterCheckboxes from "./FilterCheckboxes";

const CalendarFilter = ({
  staffInfos,
  hostsIds,
  setHostsIds,
  setEvents,
  rangeStart,
  rangeEnd,
  remainingStaff,
  setRemainingStaff,
}) => {
  return (
    <div className="calendar-filter">
      <p className="calendar-filter-title">Show Calendars</p>
      <FilterCheckboxes
        staffInfos={staffInfos}
        hostsIds={hostsIds}
        setHostsIds={setHostsIds}
        setEvents={setEvents}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        remainingStaff={remainingStaff}
        setRemainingStaff={setRemainingStaff}
      />
    </div>
  );
};

export default CalendarFilter;
