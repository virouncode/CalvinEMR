import React, { useRef, useState } from "react";
import ConcernItem from "../Topics/Concerns/ConcernItem";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import ConcernForm from "../Topics/Concerns/ConcernForm";
import { useRecord } from "../../../hooks/useRecord";
import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";

const ConcernsPU = ({ patientId, datas, setDatas, setPopUpVisible }) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState(false);
  const [columnToSort, setColumnToSort] = useState("date_created");
  const direction = useRef(false);
  useRecord("/ongoing_concerns", patientId, setDatas);

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
      {datas ? (
        <>
          <h1 className="concerns-title">Patient concerns</h1>
          {errMsgPost && (
            <div className="concerns-err">
              Unable to save form : please fill out all fields
            </div>
          )}
          <table className="concerns-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("description")}>Concern</th>
                <th onClick={() => handleSort("created_by_id")}>Created By</th>
                <th onClick={() => handleSort("date_created")}>Created On</th>
                <th style={{ textDecoration: "none", cursor: "default" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <ConcernForm
                  editCounter={editCounter}
                  setAddVisible={setAddVisible}
                  patientId={patientId}
                  setDatas={setDatas}
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
                    .map((concern) => (
                      <ConcernItem
                        item={concern}
                        key={concern.id}
                        setDatas={setDatas}
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
                    .map((concern) => (
                      <ConcernItem
                        item={concern}
                        key={concern.id}
                        setDatas={setDatas}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                      />
                    ))}
            </tbody>
          </table>
          <div className="concerns-btn-container">
            <button onClick={handleAdd} disabled={addVisible}>
              Add Concern
            </button>
            <button onClick={handleClose}>Close</button>
          </div>
        </>
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

export default ConcernsPU;
