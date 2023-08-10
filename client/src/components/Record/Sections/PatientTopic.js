//Librairies
import React, { useRef, useState } from "react";
//Components
import DemographicsContent from "../Topics/Demographics/DemographicsContent";
import MedHistoryContent from "../Topics/MedHistory/MedHistoryContent";
import FamHistoryContent from "../Topics/Family/FamHistoryContent";
import SocHistoryContent from "../Topics/Social/SocHistoryContent";
import RiskContent from "../Topics/Risks/RiskContent";
import MedicationsContent from "../Topics/Medications/MedicationsContent";
import PharmaciesContent from "../Topics/Pharmacies/PharmaciesContent";
import MeasurementsContent from "../Topics/Measurements/MeasurementsContent";
import DoctorsContent from "../Topics/Doctors/DoctorsContent";
import RemindersContent from "../Topics/Reminders/RemindersContent";
import PregnanciesContent from "../Topics/Pregnancies/PregnanciesContent";
import AllergiesContent from "../Topics/Allergies/AllergiesContent";
import ConcernsContent from "../Topics/Concerns/ConcernsContent";
import DocumentsContent from "../Topics/Documents/DocumentsContent";
import VaccinesContent from "../Topics/Vaccines/VaccinesContent";
import AppointmentsContent from "../Topics/Appointments/AppointmentsContent";
import DemographicsPU from "../Popups/DemographicsPU";
import MedHistoryPU from "../Popups/MedHistoryPU";
import FamHistoryPU from "../Popups/FamHistoryPU";
import SocHistoryPU from "../Popups/SocHistoryPU";
import RiskPU from "../Popups/RiskPU";
import MedicationsPU from "../Popups/MedicationsPU";
import PharmaciesPU from "../Popups/PharmaciesPU";
import DoctorsPU from "../Popups/DoctorsPU";
import RemindersPU from "../Popups/RemindersPU";
import PregnanciesPU from "../Popups/PregnanciesPU";
import AllergiesPU from "../Popups/AllergiesPU";
import ConcernsPU from "../Popups/ConcernsPU";
import DocumentsPU from "../Popups/DocumentsPU";
import VaccinesPU from "../Popups/VaccinesPU";
import AppointmentsPU from "../Popups/AppointmentsPU";
import MeasurementsPU from "../Popups/MeasurementsPU";
import PatientTopicHeader from "./PatientTopicHeader";
import NewWindow from "react-new-window";
import RelationshipsContent from "../Topics/Relationships/RelationshipsContent";
import RelationshipsPU from "../Popups/RelationshipsPU";
import MessagesContent from "../Topics/MessagesAboutPatient/MessagesContent";
import MessagesPU from "../Popups/MessagesPU";

const PatientTopic = ({
  backgroundColor,
  textColor,
  topic,
  patientId,
  patientInfos = {},
  setPatientInfos = null,
  allContentsVisible,
  side,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [datas, setDatas] = useState(null);
  const contentRef = useRef("null");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //HANDLERS
  const handlePopUpClick = (e) => {
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    if (topic === "MEASUREMENTS" || topic === "MESSAGES") {
      contentRef.current.classList.toggle(
        `patient-topic-content-${side}-bottom--active`
      );
    } else {
      contentRef.current.classList.toggle(
        `patient-topic-content-${side}--active`
      );
    }
  };

  const showDocument = async (url) => {
    const docWindow = window.open(
      url,
      "_blank",
      "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
    );

    if (docWindow === null) {
      alert("Please disable your browser pop-up blocker and sign in again");
      window.location.assign("/login");
      return;
    }
  };

  return (
    <div className="patient-topic">
      <div className={`patient-topic-title-${side}`} style={TOPIC_STYLE}>
        <PatientTopicHeader
          topic={topic}
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          allContentsVisible={allContentsVisible}
          popUpButton={topic === "MESSAGES" ? false : true}
        />
      </div>
      <div
        className={
          allContentsVisible
            ? topic === "MEASUREMENTS" || topic === "MESSAGES"
              ? `patient-topic-content-${side} patient-topic-content-${side}-bottom--active`
              : `patient-topic-content-${side} patient-topic-content-${side}--active`
            : `patient-topic-content-${side}`
        }
        ref={contentRef}
      >
        {/* DEMOGRAPHICS */}
        {topic === "DEMOGRAPHICS" && (
          <DemographicsContent patientInfos={patientInfos} />
        )}
        {topic === "DEMOGRAPHICS" && popUpVisible && (
          <NewWindow
            title="Patient Demographics"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <DemographicsPU
              patientInfos={patientInfos}
              setPatientInfos={setPatientInfos}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* MEDICAL HISTORY */}
        {topic === "MEDICAL HISTORY" && (
          <MedHistoryContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "MEDICAL HISTORY" && popUpVisible && (
          <NewWindow
            title="Patient Medical History"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <MedHistoryPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamHistoryContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "FAMILY HISTORY" && popUpVisible && (
          <NewWindow
            title="Patient Family History"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <FamHistoryPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "RELATIONSHIPS" && popUpVisible && (
          <NewWindow
            title="Patient Relationships"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <RelationshipsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* SOCIAL HISTORY */}
        {topic === "SOCIAL HISTORY" && (
          <SocHistoryContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "SOCIAL HISTORY" && popUpVisible && (
          <NewWindow
            title="Patient Social History"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <SocHistoryPU
              patientId={patientId}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* RISK FACTORS */}
        {topic === "RISK FACTORS/PREVENTION" && (
          <RiskContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "RISK FACTORS/PREVENTION" && popUpVisible && (
          <NewWindow
            title="Patient Risk Factors & Prevention"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <RiskPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* MEDICATIONS */}
        {topic === "MEDICATIONS" && (
          <MedicationsContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "MEDICATIONS" && popUpVisible && (
          <NewWindow
            title="Patient Medications"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 1200,
              height: 600,
              left: 120,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <MedicationsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
              patientInfos={patientInfos}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* PHARMACIES */}
        {topic === "PHARMACIES" && (
          <PharmaciesContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "PHARMACIES" && popUpVisible && (
          <NewWindow
            title="Patient Pharmacies"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 1200,
              height: 600,
              left: 120,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <PharmaciesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* MEASUREMENTS */}
        {topic === "MEASUREMENTS" && (
          <MeasurementsContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "MEASUREMENTS" && popUpVisible && (
          <NewWindow
            title="Patient Measurements"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 1200,
              height: 600,
              left: 120,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <MeasurementsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* FAMILY DOCTORS */}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && (
          <DoctorsContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && popUpVisible && (
          <NewWindow
            title="Patient's Doctors"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <DoctorsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* REMINDERS */}
        {topic === "REMINDERS/ALERTS" && (
          <RemindersContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "REMINDERS/ALERTS" && popUpVisible && (
          <NewWindow
            title="Patient Reminders & Alerts"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <RemindersPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "PREGNANCIES" && popUpVisible && (
          <NewWindow
            title="Patient Pregnancies"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <PregnanciesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* ALLERGIES */}
        {topic === "ALLERGIES" && (
          <AllergiesContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "ALLERGIES" && popUpVisible && (
          <NewWindow
            title="Patient Allergies"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <AllergiesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* CONCERNS */}
        {topic === "ONGOING CONCERNS" && (
          <ConcernsContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "ONGOING CONCERNS" && popUpVisible && (
          <NewWindow
            title="Patient Concerns"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <ConcernsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* DOCUMENTS */}
        {topic === "DOCUMENTS" && (
          <DocumentsContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
            showDocument={showDocument}
          />
        )}
        {topic === "DOCUMENTS" && popUpVisible && (
          <NewWindow
            title="Patient Documents"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <DocumentsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              showDocument={showDocument}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* VACCINES */}
        {topic === "VACCINES" && (
          <VaccinesContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
            patientInfos={patientInfos}
          />
        )}
        {topic === "VACCINES" && popUpVisible && (
          <NewWindow
            title="Patient Vaccines"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 1200,
              height: 800,
              left: 120,
              top: 0,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <VaccinesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
              patientInfos={patientInfos}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "APPOINTMENTS" && popUpVisible && (
          <NewWindow
            title="Patient Vaccines"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 1200,
              height: 600,
              left: 120,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <AppointmentsPU
              patientId={patientId}
              patientInfos={patientInfos}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}
        {/* MESSAGES */}
        {topic === "MESSAGES" && (
          <MessagesContent
            patientId={patientId}
            datas={datas}
            setDatas={setDatas}
          />
        )}
        {topic === "MESSAGES" && popUpVisible && (
          <NewWindow
            title="Messages about patient"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 800,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <MessagesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopic;
