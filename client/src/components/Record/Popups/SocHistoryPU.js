//Librairies
import React from "react";
import { useState } from "react";
import { useRecord } from "../../../hooks/useRecord";

//Utils
import { toLocalDateAndTime } from "../../../utils/formatDates";
import { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";
import ConfirmPopUp from "../../Confirm/ConfirmPopUp";
import { getPatientRecord, putPatientRecord } from "../../../api/fetchRecords";
import useAuth from "../../../hooks/useAuth";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const SocHistoryPU = ({ patientId, setDatas, setPopUpVisible }) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(null);
  useRecord("/social_history", patientId, setDatas, setFormDatas);

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
  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleClose = async (e) => {
    if (!editVisible) {
      setPopUpVisible(false);
    } else if (
      editVisible &&
      (await confirmAlertPopUp({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      }))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditVisible(false);
    try {
      await putPatientRecord(
        "/social_history",
        formDatas.id,
        user.id,
        auth.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/social_history", patientId, auth.authToken)
      );
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", {
        containerId: "B",
      });
    }
  };

  return (
    <>
      {formDatas ? (
        <>
          <div className="sochistory-card">
            <div className="sochistory-card-header">
              <h1>Patient social history</h1>
              <div className="sochistory-card-header-btns">
                {!editVisible ? (
                  <button onClick={() => setEditVisible((v) => !v)}>
                    Edit
                  </button>
                ) : (
                  <input type="submit" value="Save" onClick={handleSubmit} />
                )}
                <button onClick={handleClose}>Close</button>
              </div>
            </div>
            <form className="sochistory-card-form">
              <p>
                <label>Occupations: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.occupations}
                    name="occupations"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.occupations
                )}
              </p>
              <p>
                <label>Income: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.income}
                    name="income"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.income
                )}
              </p>
              <p>
                <label>Religion: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.religion}
                    name="religion"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.religion
                )}
              </p>
              <p>
                <label>Sexual orientation: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.sexual_orientation}
                    name="sexual_orientation"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.sexual_orientation
                )}
              </p>
              <p>
                <label>Special diet: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.special_diet}
                    name="special_diet"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Special_Diet
                )}
              </p>
              <p>
                <label>Smoking: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.smoking}
                    name="smoking"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.smoking
                )}
              </p>
              <p>
                <label>Alcohol: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.alcohol}
                    name="alcohol"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.alcohol
                )}
              </p>
              <p>
                <label>Recreational drugs: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.recreational_drugs}
                    name="recreational_drugs"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.recreational_drugs
                )}
              </p>
              <p
                style={{
                  padding: "0 5px",
                  textAlign: "right",
                  fontSize: "0.6rem",
                }}
              >
                <em>
                  Edited by {formDatas.created_by_name?.full_name} on{" "}
                  {toLocalDateAndTime(
                    new Date(formDatas.date_created).toISOString()
                  )}
                </em>
              </p>
            </form>
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

export default SocHistoryPU;
