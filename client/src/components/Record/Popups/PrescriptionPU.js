import React, { useEffect, useRef, useState } from "react";
import formatName from "../../../utils/formatName";
import useAuth from "../../../hooks/useAuth";
import {
  toLocalDate,
  toLocalDateAndTimeWithSeconds,
} from "../../../utils/formatDates";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { postPatientRecord } from "../../../api/fetchRecords";
import axios from "../../../api/xano";
import { ToastContainer, toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import AddressesList from "../../Lists/AddressesList";

const PrescriptionPU = ({ medsRx, patientInfos }) => {
  const { auth } = useAuth();
  const [addNotes, setAddNotes] = useState("");
  const [progress, setProgress] = useState(false);
  const printRef = useRef();
  const [addressSelected, setAddressSelected] = useState("");
  const [sites, setSites] = useState([]);
  const [settings, setSettings] = useState();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(`/sites`, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        setSites(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSites();
  }, [auth.authToken]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`/settings?staff_id=${auth.userId}`, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        setAddressSelected(response.data.clinic_address);
        setSettings(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAddress();
  }, [auth.authToken, auth.userId]);

  const handleAddNotes = (e) => {
    const value = e.target.value;
    setAddNotes(value);
  };

  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };

  const handleAddToRecord = async (e) => {
    setProgress(true);
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      useCORS: true,
    });
    const dataURL = canvas.toDataURL("image/png");
    const pdf = new jsPDF("portrait", "pt", "a4");
    // const imgProperties = pdf.getImageProperties(dataURL);
    pdf.addImage(
      dataURL,
      "PNG",
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight()
    );
    let fileToUpload = await axios.post(
      "/upload/attachment",
      {
        content: pdf.output("dataurlstring"),
      },
      {
        headers: {
          Authorization: `Bearer ${auth?.authToken}`,
        },
      }
    );

    const datas = {
      patient_id: patientInfos.id,
      description: `Prescription ${toLocalDateAndTimeWithSeconds(new Date())}`,
      file: fileToUpload.data,
    };

    const datasAttachment = [
      {
        patient_id: patientInfos.id,
        file: fileToUpload.data,
        date_created: Date.parse(new Date()),
        created_by_id: auth?.userId,
      },
    ];

    try {
      await postPatientRecord(
        "/documents",
        auth?.userId,
        auth?.authToken,
        datas
      );
      const attach_ids = (
        await postPatientRecord("/attachments", auth?.userId, auth?.authToken, {
          attachments_array: datasAttachment,
        })
      ).data;

      await postPatientRecord(
        "/progress_notes",
        auth?.userId,
        auth?.authToken,
        {
          patient_id: patientInfos.id,
          object: `Prescription ${toLocalDateAndTimeWithSeconds(new Date())}`,
          body: "See attachment",
          version_nbr: 1,
          attachments_ids: attach_ids,
        }
      );

      setProgress(false);
      toast.success("Saved succesfully", { containerId: "C" });
    } catch (err) {
      setProgress(false);
      toast.error("Unable to save, please contact admin", { containerId: "C" });
    }
  };

  const handleFax = () => {};

  const handleAddressChange = async (e) => {
    setAddressSelected(e.target.value);
    try {
      await axios.put(
        `/settings/${settings.id}`,
        { ...settings, clinic_address: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="prescription-actions">
        <button onClick={handlePrint} disabled={progress}>
          Print
        </button>
        <button onClick={handleAddToRecord} disabled={progress}>
          Add To Patient Record
        </button>
        <button onClick={handleFax} disabled={progress}>
          Fax
        </button>
        <AddressesList
          handleAddressChange={handleAddressChange}
          addressSelected={addressSelected}
          sites={sites}
        />
        {progress && <CircularProgress />}
      </div>
      <div className="prescription-page">
        <div ref={printRef} className="prescription-container">
          <div className="prescription-header">
            <div className="prescription-logo">
              <div className="prescription-logo-img"></div>
              {/* <img src={logo} alt="CalvinEMR-logo" width="200px" /> */}
            </div>
            <div className="prescription-doctor-infos">
              <p>
                Prescriber: Dr. {formatName(auth?.userName)} (LIC.{" "}
                {auth?.licence_nbr})
              </p>
              <p>{sites.find(({ name }) => name === addressSelected)?.name}</p>
              <p>
                {sites.find(({ name }) => name === addressSelected)?.address}{" "}
                {
                  sites.find(({ name }) => name === addressSelected)
                    ?.postal_code
                }{" "}
                {
                  sites.find(({ name }) => name === addressSelected)
                    ?.province_state
                }{" "}
                {sites.find(({ name }) => name === addressSelected)?.city}
              </p>
              <p>
                Phone:{" "}
                {sites.find(({ name }) => name === addressSelected)?.phone}
              </p>
              <p>
                Fax: {sites.find(({ name }) => name === addressSelected)?.fax}
              </p>
            </div>
          </div>
          <div className="prescription-subheader">
            <div className="prescription-patient-infos">
              <p>
                Patient:{" "}
                {patientInfos.gender_identification.toLowerCase() === "male"
                  ? "Mr."
                  : "Mrs."}{" "}
                {patientInfos.full_name}, born{" "}
                {new Date(patientInfos.date_of_birth).toLocaleDateString(
                  "en-CA",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
            <p className="prescription-date">
              Date emitted: {toLocalDate(new Date())}
            </p>
          </div>
          <div className="prescription-body">
            <p className="prescription-body-title">Prescription</p>
            <div className="prescription-body-content">
              {medsRx.map((med) => (
                <p key={med.id}>
                  {med.name} {med.dose ? `, ${med.dose}` : ""}{" "}
                  {med.route_of_administration
                    ? `, ${med.route_of_administration}`
                    : ""}{" "}
                  {med.frequency ? `, ${med.frequency}` : ""}{" "}
                  {med.number_of_doses ? `, ${med.number_of_doses}` : ""}{" "}
                  {med.duration ? `, during ${med.duration}` : ""}{" "}
                </p>
              ))}
              <p style={{ whiteSpace: "pre-line", lineHeight: "1.7rem" }}>
                {addNotes}
              </p>
            </div>
          </div>
          <div className="prescription-sign">
            <p>Sign: </p>
            <div className="prescription-sign-image">
              <img
                src={auth?.sign?.url}
                alt="doctor sign"
                crossOrigin="Anonymous"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="prescription-add">
        <label>Additional Notes: </label>
        <textarea name="addNotes" onChange={handleAddNotes} value={addNotes} />
      </div>
      <ToastContainer
        enableMultiContainer
        containerId={"C"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default PrescriptionPU;