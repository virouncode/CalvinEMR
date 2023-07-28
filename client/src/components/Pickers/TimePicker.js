import React from "react";
import {
  toLocalHours,
  toLocalAMPM,
  toLocalMinutes,
} from "../../utils/formatDates";

const TimePicker = ({
  handleChange,
  dateTimeValue,
  passingRefHour,
  passingRefMin,
  passingRefAMPM,
  readOnly,
}) => {
  return (
    <div className="time-picker">
      <select
        className="time-picker-hours"
        onChange={handleChange}
        value={toLocalHours(dateTimeValue, true)}
        ref={passingRefHour}
        name="hour"
        disabled={readOnly}
        style={{ width: "40px" }}
      >
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
        <option value="06">06</option>
        <option value="07">07</option>
        <option value="08">08</option>
        <option value="09">09</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </select>
      <select
        className="time-picker-min"
        onChange={handleChange}
        value={toLocalMinutes(dateTimeValue)}
        ref={passingRefMin}
        name="min"
        disabled={readOnly}
        style={{ width: "40px", marginLeft: "3px" }}
      >
        <option value="00">00</option>
        <option value="05">05</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="35">35</option>
        <option value="40">40</option>
        <option value="45">45</option>
        <option value="50">50</option>
        <option value="55">55</option>
      </select>
      <select
        className="time-picker-12"
        onChange={handleChange}
        value={toLocalAMPM(dateTimeValue)}
        ref={passingRefAMPM}
        name="ampm"
        disabled={readOnly}
        style={{ width: "45px", marginLeft: "3px" }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimePicker;
