//Librairies
import React from "react";
//Components
import PatientTopic from "./PatientTopic";

const PatientMenuLeft = ({
  patientInfos,
  setPatientInfos,
  patientId,
  allContentsVisible,
}) => {
  return (
    <section className="patient-menu-left">
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="DEMOGRAPHICS"
        patientInfos={patientInfos}
        setPatientInfos={setPatientInfos}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="MEDICAL HISTORY"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="FAMILY HISTORY"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="RELATIONSHIPS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="SOCIAL HISTORY"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="RISK FACTORS/PREVENTION"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="MEDICATIONS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        patientInfos={patientInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="PHARMACIES"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        topic="MEASUREMENTS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
    </section>
  );
};

export default PatientMenuLeft;
