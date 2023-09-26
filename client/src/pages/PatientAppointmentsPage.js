import React from "react";
import PastAppointments from "../components/PatientPortal/AppointmentsPatient/PastAppointments";
import NextAppointments from "../components/PatientPortal/AppointmentsPatient/NextAppointments";
import NewAppointment from "../components/PatientPortal/AppointmentsPatient/NewAppointment";
import { Helmet } from "react-helmet";

const PatientAppointmentsPage = () => {
  return (
    <div className="patient-appointments-section">
      <Helmet>
        <title>Calvin EMR Appointments</title>
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
