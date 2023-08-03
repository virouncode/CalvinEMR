//Library
import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";

//Components
import ConfirmPopUp from "../../Confirm/ConfirmPopUp";
import VaccineCaption from "../Topics/Vaccines/VaccineCaption";
import VaccineHeaderAge from "../Topics/Vaccines/VaccineHeaderAge";
import AlertMsg from "../../Alert/AlertMsg";
import VaccineItem from "../Topics/Vaccines/VaccineItem";
import SplittedHeader from "../../Presentation/SplittedHeader";

//Utils
import { useRecord } from "../../../hooks/useRecord";
import { vaccinesList } from "../../../utils/vaccines";
import { formatAge } from "../../../utils/formatAge";
import useAuth from "../../../hooks/useAuth";
import { putPatientRecord } from "../../../api/fetchRecords";

const VaccinesPU = ({
  patientId,
  datas,
  setDatas,
  setPopUpVisible,
  patientInfos,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [editable, setEditable] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  useRecord("/vaccines", patientId, setDatas);

  //STYLES
  const DIALOG_CONTAINER_STYLE = {
    height: "100vh",
    width: "150vw",
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

  const handleChangeObs = (e) => {
    const value = e.target.value;
    setDatas({ ...datas, observations: value });
  };

  const handleEditClick = (e) => {
    setEditVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await putPatientRecord(
      "/vaccines",
      datas.id,
      user.id,
      auth.authToken,
      datas
    );
    setEditVisible(false);
  };

  return (
    <>
      {datas ? (
        <>
          <h1 className="vaccines-title">Patient vaccines</h1>
          {alertVisible && (
            <AlertMsg
              severity="error"
              setAlertVisible={setAlertVisible}
              title="Error"
              msg="Please check first dose before"
            />
          )}
          <table className="vaccines-table">
            <thead>
              <tr>
                <SplittedHeader left="Vaccine" right="Age" />
                {datas.ages.map((age) => (
                  <VaccineHeaderAge key={age} name={formatAge(age)} />
                ))}
              </tr>
            </thead>
            <tbody>
              {vaccinesList.map((vaccine, index) => (
                <VaccineItem
                  key={vaccine.id}
                  vaccineId={vaccine.id}
                  item={datas[vaccine.name]}
                  dose={vaccine.dose}
                  ages={datas.ages}
                  name={vaccine.name}
                  type={vaccine.type}
                  description={vaccine.description}
                  datas={datas}
                  setDatas={setDatas}
                  patientInfos={patientInfos}
                  setEditable={setEditable}
                  editable={editable}
                  setAlertVisible={setAlertVisible}
                />
              ))}
            </tbody>
          </table>
          <VaccineCaption />
          <div className="vaccines-obs">
            <p className="vaccines-obs-title">Observations</p>
            {editVisible ? (
              <textarea
                value={datas.observations}
                onChange={handleChangeObs}
                autoFocus
              />
            ) : (
              <p className="vaccines-obs-content">{datas.observations}</p>
            )}
            <div className="vaccines-obs-btn-container">
              {!editVisible ? (
                <button type="button" onClick={handleEditClick}>
                  Edit
                </button>
              ) : (
                <button type="button" onClick={handleSave}>
                  Save
                </button>
              )}
            </div>
          </div>
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
      )}
    </>
  );
  // );
};

export default VaccinesPU;
