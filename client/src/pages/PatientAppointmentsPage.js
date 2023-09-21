import React from "react";
import PastAppointments from "../components/PatientPortal/AppointmentsPatient.js/PastAppointments";
import NextAppointments from "../components/PatientPortal/AppointmentsPatient.js/NextAppointments";
import NewAppointment from "../components/PatientPortal/AppointmentsPatient.js/NewAppointment";

const PatientAppointmentsPage = () => {
  return (
    <div className="patient-appointments-section">
      <div>
        <PastAppointments />
        <NextAppointments />
      </div>
      <NewAppointment />
    </div>
  );
};

export default PatientAppointmentsPage;
