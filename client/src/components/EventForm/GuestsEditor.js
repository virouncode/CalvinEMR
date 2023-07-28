//Librairies
import React from "react";
//Components
import GuestPatientItem from "./GuestPatientItem";
import GuestStaffItem from "./GuestStaffItem";

const GuestsEditor = ({
  staffGuestsInfos,
  patientsGuestsInfos,
  tempFormDatas,
  setTempFormDatas,
  handleClickAddGuest,
  handleRemoveGuest,
  setGuestsEditorVisible,
}) => {
  return (
    <>
      <ul>
        {staffGuestsInfos.map((guest) => (
          <GuestStaffItem
            key={guest.id}
            guest={guest}
            handleRemoveGuest={handleRemoveGuest}
          />
        ))}
        {patientsGuestsInfos.map((guest) => (
          <GuestPatientItem
            key={guest.id}
            guest={guest}
            handleRemoveGuest={handleRemoveGuest}
          />
        ))}
      </ul>
      <div className="guests-edit-buttons">
        <button type="button" onClick={handleClickAddGuest}>
          Add Guests
        </button>
        <button
          type="button"
          className="add-guest"
          onClick={(e) => setGuestsEditorVisible(false)}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default GuestsEditor;
