import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { putPatientRecord } from "../../../api/fetchRecords";
import useAuth from "../../../hooks/useAuth";
import { formatAge } from "../../../utils/formatAge";
import { vaccinesList } from "../../../utils/vaccines";
import ConfirmPopUp from "../../Confirm/ConfirmPopUp";
import SplittedHeader from "../../Presentation/SplittedHeader";
import VaccineCaption from "../Topics/Vaccines/VaccineCaption";
import VaccineHeaderAge from "../Topics/Vaccines/VaccineHeaderAge";
import VaccineItem from "../Topics/Vaccines/VaccineItem";

const VaccinesPU = ({
  datas,
  setDatas,
  fetchRecord,
  isLoading,
  errMsg,
  setPopUpVisible,
  patientInfos,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editable, setEditable] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

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
    setErrMsgPost("");
    const value = e.target.value;
    setDatas({ ...datas, observations: value });
  };

  const handleEditClick = (e) => {
    setErrMsgPost("");
    setEditVisible(true);
  };

  const handleClose = () => {
    setPopUpVisible(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await putPatientRecord(
        "/vaccines",
        datas.id,
        user.id,
        auth.authToken,
        datas
      );
      toast.success("Observations saved successfully", { containerId: "B" });
      setEditVisible(false);
    } catch (err) {
      toast.error(`Error: unable to save vaccine: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <>
      {!isLoading ? (
        errMsg ? (
          <p className="vaccines-err">{errMsg}</p>
        ) : (
          datas && (
            <>
              <h1 className="vaccines-title">
                Patient vaccines <button onClick={handleClose}>Close</button>
              </h1>
              {errMsgPost && <div className="vaccines-err">{errMsgPost}</div>}
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
                      fetchRecord={fetchRecord}
                      patientInfos={patientInfos}
                      setEditable={setEditable}
                      editable={editable}
                      setErrMsgPost={setErrMsgPost}
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
          )
        )
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default VaccinesPU;
