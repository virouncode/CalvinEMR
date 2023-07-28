//Librairies
import React from "react";
import Flatpickr from "react-flatpickr";

const FlatpickrEnd = ({
  fpEnd,
  start,
  endTime,
  allDay,
  fpVisible,
  handleEndChange,
}) => {
  return (
    <>
      <label>End</label>
      <Flatpickr
        ref={fpEnd}
        options={{
          enableTime: true,
          altInput: true,
          altFormat: "M j, Y, h:i K",
          dateFormat: "Z",
          minDate: start,
        }}
        name="End_Time"
        value={endTime}
        onChange={handleEndChange}
        onOpen={() => {
          if (allDay) {
            fpEnd.current.flatpickr.close();
            return;
          }
          fpVisible.current = true;
        }}
        onClose={() => {
          fpVisible.current = false;
        }}
      />
    </>
  );
};

export default FlatpickrEnd;
