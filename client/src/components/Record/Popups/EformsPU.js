import React, { useEffect, useRef, useState } from "react";
import EformsList from "../../Lists/EformsList";
import axiosXano from "../../../api/xano";
import useAuth from "../../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import fillPdfForm from "../../../utils/fillPdfForm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { postPatientRecord } from "../../../api/fetchRecords";

const EformsPU = ({ patientInfos, setPopUpVisible }) => {
  const { auth, user, clinic } = useAuth();
  const [eForms, setEforms] = useState([]);
  const [formSelected, setFormSelected] = useState("");
  const [formURL, setFormURL] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const abortController = new AbortController();
    const fetchEforms = async () => {
      try {
        const response = await axiosXano.get("/eforms_blank", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setEforms(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch eforms: ${err.message}`, {
            containerId: "B",
          });
      }
    };
    fetchEforms();
    return () => abortController.abort();
  }, [auth.authToken]);

  const handleClose = () => {
    setPopUpVisible(false);
  };

  const handleFormChange = async (e) => {
    setFormSelected(e.target.value);
    setFormURL(
      await fillPdfForm(
        eForms.find(({ name }) => name === e.target.value).file.url,
        patientInfos,
        {
          full_name: user.name,
          sign: user.sign,
          phone: clinic.staffInfos.find(({ id }) => id === user.id).cell_phone,
        }
      )
    );
  };

  const handleAddToRecord = async (e) => {
    // setProgress(true);
    window.open(formURL);
    // console.log(element);
    // // // element.print();
    // const canvas = await html2canvas(element);
    // //   , {
    // //   logging: true,
    // //   letterRendering: 1,
    // //   allowTaint: false,
    // //   useCORS: true,
    // // });
    // const dataURL = canvas.toDataURL("image/png");
    // const pdf = new jsPDF("portrait", "pt", "a4");
    // // const imgProperties = pdf.getImageProperties(dataURL);
    // pdf.addImage(
    //   dataURL,
    //   "PNG",
    //   0,
    //   0,
    //   pdf.internal.pageSize.getWidth(),
    //   pdf.internal.pageSize.getHeight()
    // );
    // let fileToUpload = await axiosXano.post(
    //   "/upload/attachment",
    //   {
    //     content: pdf.output("dataurlstring"),
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${auth.authToken}`,
    //     },
    //   }
    // );

    // const datas = {
    //   patient_id: patientInfos.id,
    //   name: "Test E-form",
    //   file: fileToUpload.data,
    // };

    // try {
    //   await postPatientRecord("/eforms", user.id, auth.authToken, datas);
    //   // setProgress(false);
    //   toast.success("Saved succesfully", { containerId: "B" });
    // } catch (err) {
    //   // setProgress(false);
    //   toast.error(`Error: unable to save e-form: ${err.message}`, {
    //     containerId: "B",
    //   });
    // }
  };

  return (
    <>
      <div className="eforms">
        <div className="eforms-title">E-forms</div>
        <div className="eforms-select">
          <EformsList
            handleFormChange={handleFormChange}
            formSelected={formSelected}
            eforms={eForms}
          />
        </div>
        {formURL && (
          <div className="eforms-content">
            <iframe
              src={formURL}
              title="form"
              width="800"
              height="1000"
              ref={printRef}
            />
          </div>
        )}
        <div className="eforms-btns">
          <button onClick={handleAddToRecord}>Add To Record</button>
          <button>Fax</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
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

export default EformsPU;
