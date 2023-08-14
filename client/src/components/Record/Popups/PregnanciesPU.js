//Librairies
import React, { useRef, useState } from "react";
//Components
import PregnancyEvent from "../Topics/Pregnancies/PregnancyEvent";
import { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import ConfirmPopUp from "../../Confirm/ConfirmPopUp";
import PregnancyForm from "../Topics/Pregnancies/PregnancyForm";
import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";

const PregnanciesPU = ({
  patientId,
  setPopUpVisible,
  datas,
  setDatas,
  fetchRecord,
  isLoading,
  errMsg,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState(false);
  const [columnToSort, setColumnToSort] = useState("date_of_event");
  const direction = useRef(false);

  //STYLE
  const DIALOG_CONTAINER_STYLE = {
    height: "100vh",
    width: "200vw",
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

  const handleAdd = (e) => {
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      {!isLoading ? (
        errMsg ? (
          <p className="pregnancies-err">{errMsg}</p>
        ) : (
          datas && (
            <>
              <h1 className="pregnancies-title">Patient pregnancies</h1>
              {errMsgPost && (
                <div className="pregnancies-err">
                  Unable to save form : please fill out "Description, Date Of
                  Event" fields
                </div>
              )}
              <table className="pregnancies-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("description")}>
                      Description
                    </th>
                    <th onClick={() => handleSort("date_of_event")}>
                      Date Of Event
                    </th>
                    <th onClick={() => handleSort("premises")}>Premises</th>
                    <th className="pregnancies-table-nofilter">Term</th>
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
                    <PregnancyForm
                      editCounter={editCounter}
                      setAddVisible={setAddVisible}
                      patientId={patientId}
                      fetchRecord={fetchRecord}
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
                        .map((pregnancy) => (
                          <PregnancyEvent
                            event={pregnancy}
                            key={pregnancy.id}
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
                        .map((pregnancy) => (
                          <PregnancyEvent
                            event={pregnancy}
                            key={pregnancy.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            setErrMsgPost={setErrMsgPost}
                          />
                        ))}
                </tbody>
              </table>
              <div className="pregnancies-btn-container">
                <button onClick={handleAdd} disabled={addVisible}>
                  Add Event
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

export default PregnanciesPU;
