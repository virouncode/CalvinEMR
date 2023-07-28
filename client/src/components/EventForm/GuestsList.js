//Librairies
import React, { useEffect, useState } from "react";
import GuestPatientItem from "./GuestPatientItem";
import GuestStaffItem from "./GuestStaffItem";

const GuestsList = ({
  staffGuestsInfos,
  patientsGuestsInfos,
  handleRemoveGuest,
}) => {
  // const [guestsNames, setGuestsNames] = useState([]);
  // useEffect(() => {
  //   if (staffGuestsInfos && patientsGuestsInfos) {
  //     const staffGuestsNames = staffGuestsInfos.map(
  //       ({ full_name }) => full_name
  //     );
  //     const patientsGuestsNames = patientsGuestsInfos.map(
  //       ({ full_name }) => full_name
  //     );
  //     setGuestsNames([...patientsGuestsNames, ...staffGuestsNames]);
  //   }
  // }, [patientsGuestsInfos, staffGuestsInfos]);

  return (
    <p className="guests-list-caption">
      {patientsGuestsInfos.map((patient) => (
        <GuestPatientItem
          key={patient.id}
          guest={patient}
          handleRemoveGuest={handleRemoveGuest}
        />
      ))}
      {staffGuestsInfos.map((staff) => (
        <GuestStaffItem
          key={staff.id}
          guest={staff}
          handleRemoveGuest={handleRemoveGuest}
        />
      ))}
    </p>
  );
};

export default GuestsList;
