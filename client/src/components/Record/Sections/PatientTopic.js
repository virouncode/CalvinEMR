import React, { useRef, useState } from "react";
import NewWindow from "react-new-window";
import { usePatientRecord } from "../../../hooks/usePatientRecord";
import AllergiesPU from "../Popups/AllergiesPU";
import AppointmentsPU from "../Popups/AppointmentsPU";
import ConcernsPU from "../Popups/ConcernsPU";
import DemographicsPU from "../Popups/DemographicsPU";
import DocumentsPU from "../Popups/DocumentsPU";
import EformsPU from "../Popups/EformsPU";
import FamHistoryPU from "../Popups/FamHistoryPU";
import FamilyDoctorsPU from "../Popups/FamilyDoctorsPU";
import MeasurementsPU from "../Popups/MeasurementsPU";
import MedHistoryPU from "../Popups/MedHistoryPU";
import MedicationsPU from "../Popups/MedicationsPU";
import PharmaciesPU from "../Popups/PharmaciesPU";
import PregnanciesPU from "../Popups/PregnanciesPU";
import RelationshipsPU from "../Popups/RelationshipsPU";
import RemindersPU from "../Popups/RemindersPU";
import RiskPU from "../Popups/RiskPU";
import SocHistoryPU from "../Popups/SocHistoryPU";
import VaccinesPU from "../Popups/VaccinesPU";
import AllergiesContent from "../Topics/Allergies/AllergiesContent";
import AppointmentsContent from "../Topics/Appointments/AppointmentsContent";
import ConcernsContent from "../Topics/Concerns/ConcernsContent";
import DemographicsContent from "../Topics/Demographics/DemographicsContent";
import DocumentsContent from "../Topics/Documents/DocumentsContent";
import EformsContent from "../Topics/Eforms/EformsContent";
import FamHistoryContent from "../Topics/Family/FamHistoryContent";
import DoctorsContent from "../Topics/FamilyDoctors/FamilyDoctorsContent";
import MeasurementsContent from "../Topics/Measurements/MeasurementsContent";
import MedHistoryContent from "../Topics/MedHistory/MedHistoryContent";
import MedicationsContent from "../Topics/Medications/MedicationsContent";
import MessagesContent from "../Topics/MessagesAboutPatient/MessagesContent";
import MessagesExternalContent from "../Topics/MessagesWithPatient/MessagesExternalContent";
import PharmaciesContent from "../Topics/Pharmacies/PharmaciesContent";
import PregnanciesContent from "../Topics/Pregnancies/PregnanciesContent";
import RelationshipsContent from "../Topics/Relationships/RelationshipsContent";
import RemindersContent from "../Topics/Reminders/RemindersContent";
import RiskContent from "../Topics/Risks/RiskContent";
import SocHistoryContent from "../Topics/Social/SocHistoryContent";
import VaccinesContent from "../Topics/Vaccines/VaccinesContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopic = ({
  url,
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
  const [{ datas, isLoading, errMsg }, fetchRecord, setDatas] =
    usePatientRecord(url, patientId);
  const contentRef = useRef("null");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //HANDLERS
  const handlePopUpClick = (e) => {
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    if (topic === "E-FORMS" || topic === "MESSAGES WITH PATIENT") {
      contentRef.current.classList.toggle(
        `patient-topic-content-${side}-bottom--active`
      );
    } else {
      contentRef.current.classList.toggle(
        `patient-topic-content-${side}--active`
      );
    }
  };

  const showDocument = async (docUrl, docMime) => {
    let docWindow;
    if (!docMime.includes("officedocument")) {
      docWindow = window.open(
        docUrl,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    } else {
      docWindow = window.open(
        `https://docs.google.com/gview?url=${docUrl}`,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    }

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
          popUpButton={
            topic === "MESSAGES WITH PATIENT" ||
            topic === "MESSAGES ABOUT PATIENT"
              ? false
              : true
          }
        />
      </div>
      <div
        className={
          allContentsVisible
            ? topic === "E-FORMS" || topic === "MESSAGES WITH PATIENT"
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
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamHistoryContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              setPopUpVisible={setPopUpVisible}
              isLoading={isLoading}
              errMsg={errMsg}
            />
          </NewWindow>
        )}
        {/*******************/}
        {/* FAMILY DOCTORS */}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && (
          <DoctorsContent datas={datas} isLoading={isLoading} errMsg={errMsg} />
        )}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && popUpVisible && (
          <NewWindow
            title="Patient Doctors"
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 1200,
              height: 600,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <FamilyDoctorsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* RISK FACTORS */}
        {topic === "RISK FACTORS/PREVENTION" && (
          <RiskContent datas={datas} isLoading={isLoading} errMsg={errMsg} />
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* MEDICATIONS */}
        {topic === "MEDICATIONS" && (
          <MedicationsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
              patientInfos={patientInfos}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* PHARMACIES */}
        {topic === "PHARMACIES" && (
          <PharmaciesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* MEASUREMENTS */}
        {topic === "MEASUREMENTS" && (
          <MeasurementsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}
        {/*E-FORMS */}
        {topic === "E-FORMS" && (
          <EformsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
            showDocument={showDocument}
          />
        )}
        {topic === "E-FORMS" && popUpVisible && (
          <NewWindow
            title="Patient Electronic Forms"
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
            <EformsPU
              patientInfos={patientInfos}
              patientId={patientId}
              showDocument={showDocument}
              datas={datas}
              setDatas={setDatas}
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}
        {/* SOCIAL HISTORY */}
        {topic === "SOCIAL HISTORY" && (
          <SocHistoryContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              datas={datas}
              setDatas={setDatas}
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* REMINDERS */}
        {topic === "REMINDERS/ALERTS" && (
          <RemindersContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* ALLERGIES */}
        {topic === "ALLERGIES" && (
          <AllergiesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* CONCERNS */}
        {topic === "ONGOING CONCERNS" && (
          <ConcernsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "ONGOING CONCERNS" && popUpVisible && (
          <NewWindow
            title="Ongoing concerns"
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* DOCUMENTS */}
        {topic === "DOCUMENTS" && (
          <DocumentsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              showDocument={showDocument}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* VACCINES */}
        {topic === "VACCINES" && <VaccinesContent />}
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
              datas={datas}
              setDatas={setDatas}
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
              patientInfos={patientInfos}
            />
          </NewWindow>
        )}
        {/*******************/}

        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "APPOINTMENTS" && popUpVisible && (
          <NewWindow
            title="Patient Appointments"
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
              fetchRecord={fetchRecord}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </NewWindow>
        )}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
        {/* MESSAGES WITH PATIENT */}
        {topic === "MESSAGES WITH PATIENT" && (
          <MessagesExternalContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopic;
