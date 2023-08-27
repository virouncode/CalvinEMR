import React, { useRef, useState } from "react";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import { CircularProgress } from "@mui/material";
import RelationshipForm from "../Topics/Relationships/RelationshipForm";
import RelationshipItem from "../Topics/Relationships/RelationshipItem";
import { ToastContainer } from "react-toastify";

const RelationshipsPU = ({
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

  //STYLES
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
          <p className="relationships-err">{errMsg}</p>
        ) : (
          datas && (
            <>
              <h1 className="relationships-title">Patient relationships</h1>
              {errMsgPost && (
                <div className="relationships-err">
                  Unable to save form : please fill out all fields
                </div>
              )}
              <table className="relationships-table">
                <thead>
                  <tr>
                    <th style={{ textDecoration: "none" }}>Relation with</th>
                    <th style={{ textDecoration: "none" }}>Patient</th>
                    <th style={{ textDecoration: "none" }}>Created By</th>
                    <th style={{ textDecoration: "none" }}>Created On</th>
                    <th style={{ textDecoration: "none" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {addVisible && (
                    <RelationshipForm
                      editCounter={editCounter}
                      setAddVisible={setAddVisible}
                      patientId={patientId}
                      fetchRecord={fetchRecord}
                      setErrMsgPost={setErrMsgPost}
                    />
                  )}
                  {datas.map((item) => (
                    <RelationshipItem
                      item={item}
                      key={item.id}
                      fetchRecord={fetchRecord}
                      editCounter={editCounter}
                      setErrMsgPost={setErrMsgPost}
                    />
                  ))}
                </tbody>
              </table>
              <div className="relationships-btn-container">
                <button onClick={handleAdd} disabled={addVisible}>
                  Add Relationship
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

export default RelationshipsPU;
