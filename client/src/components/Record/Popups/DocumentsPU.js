//Librairies
import React, { useRef, useState } from "react";
import { useRecord } from "../../../hooks/useRecord";
//Components
import DocumentItem from "../Topics/Documents/DocumentItem";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import DocumentForm from "../Topics/Documents/DocumentForm";
import { CircularProgress } from "@mui/material";
import AlertMsg from "../../Alert/AlertMsg";
import { ToastContainer } from "react-toastify";

const DocumentsPU = ({
  patientId,
  datas,
  setDatas,
  showDocument,
  setPopUpVisible,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [columnToSort, setColumnToSort] = useState("date_created");
  const direction = useRef(false);
  useRecord("/documents", patientId, setDatas);

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

  const handleAdd = (e) => {
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

  return datas ? (
    <>
      <h1 className="documents-title">Patient documents</h1>
      {errMsgPost && (
        <div className="documents-err">
          Unable to save document : please fill out "Description" field
        </div>
      )}
      {alertVisible && (
        <AlertMsg
          severity="error"
          setAlertVisible={setAlertVisible}
          title="Error"
          msg="The file is too large, please choose another file"
        />
      )}
      <table className="documents-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("description")}>Description</th>
            <th onClick={() => handleSort("name")}>File Name</th>
            <th onClick={() => handleSort("type")}>Type</th>
            <th onClick={() => handleSort("created_by_id")}>Created By</th>
            <th onClick={() => handleSort("date_created")}>Created On</th>
            <th style={{ textDecoration: "none", cursor: "default" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {columnToSort === "name" || columnToSort === "type"
            ? direction.current
              ? datas
                  .sort((a, b) =>
                    a.file[columnToSort]
                      ?.toString()
                      .localeCompare(b.file[columnToSort]?.toString())
                  )
                  .map((document) => (
                    <DocumentItem
                      item={document}
                      key={document.id}
                      setDatas={setDatas}
                      showDocument={showDocument}
                    />
                  ))
              : datas
                  .sort((a, b) =>
                    b.file[columnToSort]
                      ?.toString()
                      .localeCompare(a.file[columnToSort]?.toString())
                  )
                  .map((document) => (
                    <DocumentItem
                      item={document}
                      key={document.id}
                      setDatas={setDatas}
                      showDocument={showDocument}
                    />
                  ))
            : direction.current
            ? datas
                .sort((a, b) =>
                  a[columnToSort]
                    ?.toString()
                    .localeCompare(b[columnToSort]?.toString())
                )
                .map((document) => (
                  <DocumentItem
                    item={document}
                    key={document.id}
                    setDatas={setDatas}
                    showDocument={showDocument}
                  />
                ))
            : datas
                .sort((a, b) =>
                  b[columnToSort]
                    ?.toString()
                    .localeCompare(a[columnToSort]?.toString())
                )
                .map((document) => (
                  <DocumentItem
                    item={document}
                    key={document.id}
                    setDatas={setDatas}
                    showDocument={showDocument}
                  />
                ))}
        </tbody>
      </table>
      <div className="documents-btn-container">
        <button disabled={addVisible} onClick={handleAdd}>
          Add document
        </button>
        <button onClick={handleClose}>Close</button>
      </div>
      {addVisible && (
        <DocumentForm
          patientId={patientId}
          setDatas={setDatas}
          setAddVisible={setAddVisible}
          editCounter={editCounter}
          setErrMsgPost={setErrMsgPost}
          setAlertVisible={setAlertVisible}
        />
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
  ) : (
    <CircularProgress />
  );
};

export default DocumentsPU;
