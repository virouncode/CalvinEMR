//Librairies
import React, { useEffect, useState } from "react";
//Components
import GuestsSearch from "./GuestsSearch";
import GuestsList from "./GuestsList";

const EditGuests = ({
  staffInfos,
  patientsInfos,
  tempFormDatas,
  setTempFormDatas,
  currentEvent,
  editable,
  hostId,
  staffGuestsInfos,
  setStaffGuestsInfos,
  patientsGuestsInfos,
  setPatientsGuestsInfos,
}) => {
  //=========================== HOOKS =========================//

  useEffect(() => {
    const staffGuestsIds = tempFormDatas.staff_guests.map(
      ({ staff_id }) => staff_id
    );
    setStaffGuestsInfos(
      staffInfos.filter(({ id }) => staffGuestsIds.includes(id))
    );

    const patientsGuestsIds = tempFormDatas.patients_guests.map(
      ({ patients_id }) => patients_id
    );
    setPatientsGuestsInfos(
      patientsInfos.filter(({ id }) => patientsGuestsIds.includes(id))
    );
  }, [patientsInfos, staffInfos, tempFormDatas]);

  // //========================== EVENTS HANDLERS =======================//

  const handleAddGuest = (guest, e) => {
    const guestId = parseInt(e.target.parentElement.getAttribute("data-key"));
    const guestType = e.target.parentElement.getAttribute("data-type");

    let staffGuestsIdsUpdated = [...tempFormDatas.staff_guests];
    let patientsGuestsIdsUpdated = [...tempFormDatas.patients_guests];

    if (guestType === "staff") {
      staffGuestsIdsUpdated = [
        ...staffGuestsIdsUpdated,
        { staff_id: guestId, staff_name: { full_name: guest.full_name } },
      ];
      setTempFormDatas({
        ...tempFormDatas,
        staff_guests: staffGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "staffGuestsNames",
        staffGuestsIdsUpdated.map(({ staff_name }) => staff_name.full_name)
      );
    } else {
      patientsGuestsIdsUpdated = [
        ...patientsGuestsIdsUpdated,
        { patients_id: guestId, patient_name: { full_name: guest.full_name } },
      ];
      setTempFormDatas({
        ...tempFormDatas,
        patients_guests: patientsGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "patientsGuestsNames",
        patientsGuestsIdsUpdated.map(
          ({ patient_name }) => patient_name.full_name
        )
      );
    }
  };

  const handleRemoveGuest = (e) => {
    const parentKey = parseInt(e.target.parentElement.getAttribute("data-key")); //from GuestStaffItem
    const parentType = e.target.parentElement.getAttribute("data-type");

    let staffGuestsIdsUpdated = [...tempFormDatas.staff_guests];
    let patientsGuestsIdsUpdated = [...tempFormDatas.patients_guests];

    //FAIRE DES FILTER AU LIEU DE INDEX TO REMOVE CAR L'ORDRE N'EST PAS LE MEME
    if (parentType === "staff") {
      //i want to remove a staff guest
      staffGuestsIdsUpdated = staffGuestsIdsUpdated.filter(
        ({ staff_id }) => staff_id !== parentKey
      );
      setTempFormDatas({
        ...tempFormDatas,
        staff_guests: staffGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "staffGuestsNames",
        staffGuestsIdsUpdated.map(({ staff_name }) => staff_name.full_name)
      );
    } else {
      patientsGuestsIdsUpdated = patientsGuestsIdsUpdated.filter(
        (guest) => guest.patients_id !== parentKey
      );

      setTempFormDatas({
        ...tempFormDatas,
        patients_guests: patientsGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "patientsGuestsNames",
        patientsGuestsIdsUpdated.map(
          ({ patient_name }) => patient_name.full_name
        )
      );
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="form-row-guests-list">
        <label>Patients/Guests: </label>
        <GuestsList
          patientsGuestsInfos={patientsGuestsInfos}
          staffGuestsInfos={staffGuestsInfos}
          handleRemoveGuest={handleRemoveGuest}
        />
      </div>
      {editable && (
        <div className="form-row-guests-search">
          <GuestsSearch
            handleAddGuest={handleAddGuest}
            patientsInfos={patientsInfos}
            staffInfos={staffInfos}
            patientsGuestsInfos={patientsGuestsInfos}
            staffGuestsInfos={staffGuestsInfos}
            hostId={hostId}
          />
        </div>
      )}
    </div>
  );
};

export default EditGuests;
