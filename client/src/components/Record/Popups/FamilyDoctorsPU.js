import React, { useRef, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import { putPatientRecord } from "../../../api/fetchRecords";
import { ToastContainer, toast } from "react-toastify";
import FamilyDoctorItem from "../Topics/FamilyDoctors/FamilyDoctorItem";
import FamilyDoctorsList from "../Topics/FamilyDoctors/FamilyDoctorsList";
import { CircularProgress } from "@mui/material";

const FamilyDoctorsPU = ({
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
  const { auth, user } = useAuth();
  const editCounter = useRef(0);
  const direction = useRef(false);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [columnToSort, setColumnToSort] = useState("date_created");
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
  const handleClose = async (e) => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlertPopUp({
          content: "Do you really want to close the window ?",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleAdd = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  const handleAddItemClick = async (item, e) => {
    //add patient id in pharmacies list
    const doctor = { ...item };
    const patients = [...doctor.patients, patientId];
    doctor.patients = patients;
    try {
      await putPatientRecord(
        "/doctors",
        item.id,
        user.id,
        auth.authToken,
        doctor
      );
      const abortController = new AbortController();
      fetchRecord(abortController);
      toast.success("Doctor added to patient", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to add doctor: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleSort = (columnName) => {
    direction.current = !direction.current;
    setColumnToSort(columnName);
    setDatas([...datas]);
  };
  return (
    <>
      {!isLoading ? (
        errMsg ? (
          <p className="doctors-err">{errMsg}</p>
        ) : (
          datas && (
            <>
              <h1 className="doctors-title"> Patient Doctors</h1>
              {errMsgPost && <div className="doctors-err">{errMsgPost}</div>}
              <table className="doctors-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>Name</th>
                    <th onClick={() => handleSort("speciality")}>Speciality</th>
                    <th onClick={() => handleSort("licence_nbr")}>
                      Licence nbr
                    </th>
                    <th onClick={() => handleSort("address")}>Address</th>
                    <th onClick={() => handleSort("province_state")}>
                      Province/State
                    </th>
                    <th onClick={() => handleSort("postal_code")}>
                      Postal Code
                    </th>
                    <th onClick={() => handleSort("city")}>City</th>
                    <th onClick={() => handleSort("country")}>Country</th>
                    <th onClick={() => handleSort("phone")}>Phone</th>
                    <th onClick={() => handleSort("fax")}>Fax</th>
                    <th onClick={() => handleSort("email")}>Email</th>
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
                        .map((item) => (
                          <FamilyDoctorItem
                            item={item}
                            key={item.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            patientId={patientId}
                            setErrMsgPost={setErrMsgPost}
                          />
                        ))
                    : datas
                        .sort((a, b) =>
                          b[columnToSort]
                            ?.toString()
                            .localeCompare(a[columnToSort]?.toString())
                        )
                        .map((item) => (
                          <FamilyDoctorItem
                            item={item}
                            key={item.id}
                            fetchRecord={fetchRecord}
                            editCounter={editCounter}
                            patientId={patientId}
                            setErrMsgPost={setErrMsgPost}
                          />
                        ))}
                </tbody>
              </table>
              <div className="doctors-btn-container">
                <button onClick={handleAdd} disabled={addVisible}>
                  Add Doctor to patient
                </button>
                <button onClick={handleClose}>Close</button>
              </div>
              {addVisible && (
                <FamilyDoctorsList
                  datas={datas}
                  handleAddItemClick={handleAddItemClick}
                  setErrMsgPost={setErrMsgPost}
                  patientId={patientId}
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

export default FamilyDoctorsPU;
