//Librairies
import React from "react";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const Shortcutpickr = ({ handleShortcutpickrChange }) => {
  return (
    <div className="calendar-shortcutpickr">
      <Flatpickr
        options={{
          inline: true,
          dateFormat: "Z",
        }}
        onChange={handleShortcutpickrChange}
      />
    </div>
  );
};

export default Shortcutpickr;
