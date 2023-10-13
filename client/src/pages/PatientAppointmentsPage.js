import React from "react";
import { Helmet } from "react-helmet";
import NewAppointment from "../components/PatientPortal/AppointmentsPatient/NewAppointment";
import NextAppointments from "../components/PatientPortal/AppointmentsPatient/NextAppointments";
import PastAppointments from "../components/PatientPortal/AppointmentsPatient/PastAppointments";

const PatientAppointmentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Appointments</title>
      </Helmet>
      <section className="patient-appointments-section">
        <h2 className="patient-appointments-section-title">Appointments</h2>
        <div className="patient-appointments-section-content">
          <div>
            <PastAppointments />
            <NextAppointments />
          </div>
          <NewAppointment />
        </div>
      </section>
    </>
  );
};

export default PatientAppointmentsPage;
