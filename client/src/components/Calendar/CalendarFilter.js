//Librairies
import React from "react";
//Components
import FilterCheckboxes from "./FilterCheckboxes";

const CalendarFilter = ({
  staffInfos,
  hostsIds,
  setHostsIds,
  remainingStaff,
}) => {
  return (
    <div className="calendar-filter">
      <p className="calendar-filter-title">Show Calendars</p>
      <FilterCheckboxes
        staffInfos={staffInfos}
        hostsIds={hostsIds}
        setHostsIds={setHostsIds}
        remainingStaff={remainingStaff}
      />
    </div>
  );
};

export default CalendarFilter;
