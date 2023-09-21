import React from "react";
import TimePickerAvailability from "../Pickers/TimePickerAvailability";
import { firstLetterUpper } from "../../utils/firstLetterUpper";

const AvailabilityItem = ({
  day,
  handleStartMorningChange,
  handleEndMorningChange,
  handleStartAfternoonChange,
  handleEndAfternoonChange,
  handleCheck,
  scheduleMorning,
  scheduleAfternoon,
  unavailable,
}) => {
  return (
    <div className="availability-form-row">
      <div className="availability-form-row-day">{firstLetterUpper(day)}</div>
      <div className="availability-form-row-time">
        <TimePickerAvailability
          day={day}
          handleChange={handleStartMorningChange}
          readOnly={unavailable}
          timeValueHour={scheduleMorning[0].hours}
          timeValueMin={scheduleMorning[0].min}
          timeValueAMPM={scheduleMorning[0].ampm}
        />
        <p>To</p>
        <TimePickerAvailability
          day={day}
          handleChange={handleEndMorningChange}
          readOnly={unavailable}
          timeValueHour={scheduleMorning[1].hours}
          timeValueMin={scheduleMorning[1].min}
          timeValueAMPM={scheduleMorning[1].ampm}
        />
      </div>
      <div className="availability-form-row-time">
        <TimePickerAvailability
          day={day}
          handleChange={handleStartAfternoonChange}
          readOnly={unavailable}
          timeValueHour={scheduleAfternoon[0].hours}
          timeValueMin={scheduleAfternoon[0].min}
          timeValueAMPM={scheduleAfternoon[0].ampm}
        />
        <p>To</p>
        <TimePickerAvailability
          day={day}
          handleChange={handleEndAfternoonChange}
          readOnly={unavailable}
          timeValueHour={scheduleAfternoon[1].hours}
          timeValueMin={scheduleAfternoon[1].min}
          timeValueAMPM={scheduleAfternoon[1].ampm}
        />
      </div>
      <div className="availability-form-row-checkbox">
        <input
          type="checkbox"
          id="notavailable"
          onChange={(e) => handleCheck(e, day)}
          checked={unavailable}
        />
        <label htmlFor="notavailable">Not available</label>
      </div>
    </div>
  );
};

export default AvailabilityItem;
