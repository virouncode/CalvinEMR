//Librairies
import React from "react";
//Components
import PatientTopic from "./PatientTopic";

const PatientMenuRight = ({ patientId, allContentsVisible, patientInfos }) => {
  return (
    <section className="patient-menu-right">
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="FAMILY DOCTORS/SPECIALISTS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="REMINDERS/ALERTS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="PREGNANCIES"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALLERGIES"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="ONGOING CONCERNS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="DOCUMENTS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="VACCINES"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
        patientInfos={patientInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        topic="APPOINTMENTS"
        patientId={patientId}
        patientInfos={patientInfos}
        allContentsVisible={allContentsVisible}
        side="right"
      />
    </section>
  );
};
export default PatientMenuRight;
