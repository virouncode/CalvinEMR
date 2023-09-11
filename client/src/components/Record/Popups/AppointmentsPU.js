import React, { useRef, useState } from "react";
import AppointmentEvent from "../Topics/Appointments/AppointmentEvent";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import AppointmentForm from "../Topics/Appointments/AppointmentForm";

import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";

const AppointmentsPU = ({
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
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [columnToSort, setColumnToSort] = useState("start");
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

  const handleAdd = async (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      {!isLoading ? (
        errMsg ? (
          <p className="appointments-err">{errMsg}</p>
        ) : (
          datas && (
            <>
              <h1 className="appointments-title">Patient appointments</h1>
              {errMsgPost && (
                <div className="appointments-err">{errMsgPost}</div>
              )}

              <table className="appointments-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("host_id")}>Host</th>
                    <th onClick={() => handleSort("reason")}>Reason</th>
                    <th onClick={() => handleSort("start")}>From</th>
                    <th onClick={() => handleSort("end")}>To</th>
                    <th onClick={() => handleSort("all_day")}>All Day</th>
                    <th onClick={() => handleSort("room")}>Room</th>
                    <th onClick={() => handleSort("status")}>Status</th>
                    <th onClick={() => handleSort("created_by_id")}>
                      Created By
                    </th>
                    <th onClick={() => handleSort("date_created")}>
                      Created On
                    </th>
                    <th style={{ textDecoration: "none", cursor: "default" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {addVisible && (
                    <AppointmentForm
                      patientId={patientId}
                      fetchRecord={fetchRecord}
                      editCounter={editCounter}
                      patientInfos={patientInfos}
                      setAddVisible={setAddVisible}
                      setErrMsgPost={setErrMsgPost}
                    />
                  )}
                  {direction.current
                    ? datas
                        .sort((a, b) =>
                          a[columnToSort]
                            ?.toString()
                            .localeCompare(b[columnToSort]?.toString())
                        )
                        .map((appointment) => (
                          <AppointmentEvent
                            event={appointment}
                            key={appointment.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            setErrMsgPost={setErrMsgPost}
                          />
                        ))
                    : datas
                        .sort((a, b) =>
                          b[columnToSort]
                            ?.toString()
                            .localeCompare(a[columnToSort]?.toString())
                        )
                        .map((appointment) => (
                          <AppointmentEvent
                            event={appointment}
                            key={appointment.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            setErrMsgPost={setErrMsgPost}
                          />
                        ))}
                </tbody>
              </table>
              <div className="appointments-btn-container">
                <button onClick={handleAdd} disabled={addVisible}>
                  Add Appointment
                </button>
                <button onClick={handleClose}>Close</button>
              </div>
            </>
          )
        )
      ) : (
        <CircularProgress />
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

export default AppointmentsPU;
