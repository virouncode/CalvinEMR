//Librairies
import React, { useRef, useState } from "react";
//Components
import MedicationEvent from "../Topics/Medications/MedicationEvent";
import MedicationForm from "../Topics/Medications/MedicationForm";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import { CircularProgress } from "@mui/material";
import NewWindow from "react-new-window";
import PrescriptionPU from "./PrescriptionPU";
import { ToastContainer } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const MedicationsPU = ({
  patientId,
  setPopUpVisible,
  patientInfos,
  datas,
  setDatas,
  fetchRecord,
  isLoading,
  errMsg,
}) => {
  //HOOKS
  const { user } = useAuth();
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [presVisible, setPresVisible] = useState(false);
  const [columnToSort, setColumnToSort] = useState("start");
  const [medsRx, setMedsRx] = useState([]);
  const direction = useRef(false);

  //STYLE
  const DIALOG_CONTAINER_STYLE = {
    height: "100vh",
    width: "100vw",
    fontFamily: "Arial",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    top: "0px",
    left: "0px",
    background: "rgba(0,0,0,0.8)",
    zIndex: "100000",
  };

  //HANDLERS
  const handleSort = (columnName) => {
    direction.current = !direction.current;
    setColumnToSort(columnName);
    setDatas([...datas]);
  };

  const handleAdd = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  const handleClose = async (e) => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlertPopUp({
          content:
            "Do you really want to close the window ? Your changes will be lost",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  return (
    <>
      {!isLoading ? (
        errMsg ? (
          <p className="medications-err">{errMsg}</p>
        ) : (
          datas && (
            <>
              <h1 className="medications-title">Patient medications</h1>
              {errMsgPost && (
                <div className="medications-err">{errMsgPost}</div>
              )}
              <table className="medications-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("active")}>Active</th>
                    <th onClick={() => handleSort("name")}>Medication Name</th>
                    <th onClick={() => handleSort("active_ingredients")}>
                      Active Ingredients
                    </th>
                    <th onClick={() => handleSort("route_of_administration")}>
                      Route
                    </th>
                    <th onClick={() => handleSort("dose")}>Dose</th>
                    <th onClick={() => handleSort("frequency")}>Frequency</th>
                    <th onClick={() => handleSort("number_of_doses")}>
                      Number of doses
                    </th>
                    <th onClick={() => handleSort("duration")}>Duration</th>
                    <th onClick={() => handleSort("created_by_id")}>
                      Created By
                    </th>
                    <th onClick={() => handleSort("date_created")}>
                      Created On
                    </th>
                    {user.title === "Doctor" && (
                      <th style={{ textDecoration: "none", cursor: "default" }}>
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {direction.current
                    ? datas
                        .filter((medication) => medication.active)
                        .sort((a, b) =>
                          a[columnToSort]
                            ?.toString()
                            .localeCompare(b[columnToSort]?.toString())
                        )
                        .map((medication) => (
                          <MedicationEvent
                            event={medication}
                            key={medication.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            presVisible={presVisible}
                            setPresVisible={setPresVisible}
                            setErrMsgPost={setErrMsgPost}
                            medsRx={medsRx}
                            setMedsRx={setMedsRx}
                          />
                        ))
                    : datas
                        .filter((medication) => medication.active)
                        .sort((a, b) =>
                          b[columnToSort]
                            ?.toString()
                            .localeCompare(a[columnToSort]?.toString())
                        )
                        .map((medication) => (
                          <MedicationEvent
                            event={medication}
                            key={medication.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            setErrMsgPost={setErrMsgPost}
                            presVisible={presVisible}
                            setPresVisible={setPresVisible}
                            medsRx={medsRx}
                            setMedsRx={setMedsRx}
                          />
                        ))}
                  {direction.current
                    ? datas
                        .filter((medication) => !medication.active)
                        .sort((a, b) =>
                          a[columnToSort]
                            ?.toString()
                            .localeCompare(b[columnToSort]?.toString())
                        )
                        .map((medication) => (
                          <MedicationEvent
                            event={medication}
                            key={medication.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            setErrMsgPost={setErrMsgPost}
                            presVisible={presVisible}
                            setPresVisible={setPresVisible}
                            medsRx={medsRx}
                            setMedsRx={setMedsRx}
                          />
                        ))
                    : datas
                        .filter((medication) => !medication.active)
                        .sort((a, b) =>
                          b[columnToSort]
                            ?.toString()
                            .localeCompare(a[columnToSort]?.toString())
                        )
                        .map((medication) => (
                          <MedicationEvent
                            event={medication}
                            key={medication.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            setErrMsgPost={setErrMsgPost}
                            presVisible={presVisible}
                            setPresVisible={setPresVisible}
                            medsRx={medsRx}
                            setMedsRx={setMedsRx}
                          />
                        ))}
                </tbody>
              </table>
              {user.title === "Doctor" && (
                <div className="medications-btn-container">
                  <button onClick={handleAdd} disabled={addVisible}>
                    Add Medication To Profile
                  </button>
                  <button onClick={handleClose}>Close</button>
                </div>
              )}
            </>
          )
        )
      ) : (
        <CircularProgress />
      )}
      {addVisible && (
        <MedicationForm
          fetchRecord={fetchRecord}
          patientId={patientId}
          setAddVisible={setAddVisible}
          editCounter={editCounter}
          setErrMsgPost={setErrMsgPost}
        />
      )}
      {presVisible && (
        <NewWindow
          title="New Prescription"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 793.7,
            height: 1122.5,
            left: 0,
            top: 0,
          }}
          onUnload={() => {
            setPresVisible(false);
            setMedsRx([]);
          }}
        >
          <PrescriptionPU medsRx={medsRx} patientInfos={patientInfos} />
        </NewWindow>
      )}
      <ConfirmPopUp containerStyle={DIALOG_CONTAINER_STYLE} />
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

export default MedicationsPU;
