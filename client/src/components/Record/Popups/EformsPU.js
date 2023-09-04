import React, { useRef, useState } from "react";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import EformItem from "../Topics/Eforms/EformItem";
import Eform from "../Topics/Eforms/Eform";
import axiosXano from "../../../api/xano";
import useAuth from "../../../hooks/useAuth";
import { postPatientRecord } from "../../../api/fetchRecords";

const EformsPU = ({
  patientId,
  patientInfos,
  showDocument,
  setPopUpVisible,
  datas,
  setDatas,
  fetchRecord,
  errMsg,
  isLoading,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState(false);
  const [columnToSort, setColumnToSort] = useState("date_created");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
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

  const handleAdd = (e) => {
    setAddVisible((v) => !v);
  };

  const handleClose = async (e) => {
    setPopUpVisible(false);
  };

  const handleAddToRecord = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 20000000) {
        alert("The file is too large, please choose another one");
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result; // this is the content!
        try {
          const response = await axiosXano.post(
            "/upload/attachment",
            {
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          );

          await postPatientRecord("/eforms", user.id, auth.authToken, {
            patient_id: patientId,
            name: file.name,
            file: response.data,
          });
          const abortController = new AbortController();
          fetchRecord(abortController);
          toast.success(`Form successfully added to patient record`, {
            containerId: "B",
          });
          setIsLoadingFile(false);
        } catch (err) {
          toast.error(`Error: unable to save file: ${err.message}`, {
            containerId: "B",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  return (
    <>
      {!isLoading ? (
        errMsg ? (
          <p className="electronic-err">{errMsg}</p>
        ) : (
          datas && (
            <>
              <h1 className="electronic-title">Patient e-forms</h1>
              <table className="electronic-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>Name</th>
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
                  {direction.current
                    ? datas
                        .sort((a, b) =>
                          a[columnToSort]
                            ?.toString()
                            .localeCompare(b[columnToSort]?.toString())
                        )
                        .map((eform) => (
                          <EformItem
                            item={eform}
                            key={eform.id}
                            fetchRecord={fetchRecord}
                            setErrMsgPost={setErrMsgPost}
                          />
                        ))
                    : datas
                        .sort((a, b) =>
                          b[columnToSort]
                            ?.toString()
                            .localeCompare(a[columnToSort]?.toString())
                        )
                        .map((eform) => (
                          <EformItem
                            item={eform}
                            key={eform.id}
                            fetchRecord={fetchRecord}
                            showDocument={showDocument}
                          />
                        ))}
                </tbody>
              </table>
              <div className="electronic-btn-container">
                <button onClick={handleAdd} disabled={addVisible}>
                  Add e-form
                </button>
                <button onClick={handleClose} disabled={isLoadingFile}>
                  Close
                </button>
              </div>
              {addVisible && (
                <Eform
                  setAddVisible={setAddVisible}
                  patientId={patientId}
                  patientInfos={patientInfos}
                  fetchRecord={fetchRecord}
                  setErrMsgPost={setErrMsgPost}
                  handleAddToRecord={handleAddToRecord}
                  isLoadingFile={isLoadingFile}
                />
              )}
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

export default EformsPU;
