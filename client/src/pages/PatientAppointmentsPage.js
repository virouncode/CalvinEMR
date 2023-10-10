import React from "react";
import { Helmet } from "react-helmet";
import NewAppointment from "../components/PatientPortal/AppointmentsPatient/NewAppointment";
import NextAppointments from "../components/PatientPortal/AppointmentsPatient/NextAppointments";
import PastAppointments from "../components/PatientPortal/AppointmentsPatient/PastAppointments";

const PatientAppointmentsPage = () => {
  return (
    <div className="patient-appointments-section">
      <Helmet>
        <title>Appointments</title>
      </Helmet>
      <div>
        <PastAppointments />
        <NextAppointments />
      </div>
      <NewAppointment />
    </div>
  );
};

export default PatientAppointmentsPage;
