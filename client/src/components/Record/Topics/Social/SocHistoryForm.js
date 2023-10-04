import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import useAuth from "../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";

const SocHistoryForm = ({ fetchRecord, setPopUpVisible, patientId }) => {
  const { user, auth } = useAuth();
  const [formDatas, setFormDatas] = useState({});
  const [errMsgPost, setErrMsgPost] = useState("");

  const handleChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleClose = (e) => {
    e.preventDefault();
    setPopUpVisible(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatasForValidation = { ...formDatas };
    //Validation
    if (
      !Object.values(formDatasForValidation).some((v) => v) ||
      !formDatasForValidation
    ) {
      setErrMsgPost("Please fill at least one field");
      return;
    }
    const formDatasToPost = {
      ...formDatas,
      patient_id: patientId,
      occupations: firstLetterUpper(formDatas.occupations),
      religion: firstLetterUpper(formDatas.religion),
      sexual_orientation: firstLetterUpper(formDatas.sexual_orientation),
      special_diet: firstLetterUpper(formDatas.special_diet),
      smoking: firstLetterUpper(formDatas.smoking),
      alcohol: firstLetterUpper(formDatas.alcohol),
      recreational_drugs: firstLetterUpper(formDatas.recreational_drugs),
    };

    try {
      await postPatientRecord(
        "/social_history",
        user.id,
        auth.authToken,
        formDatasToPost
      );
      const abortController = new AbortController();
      fetchRecord(abortController);
      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error unable to save social history: ${err.message}`, {
        containerId: "B",
      });
    }
    setPopUpVisible(false);
  };
  return (
    <div className="sochistory-card">
      <div className="sochistory-card-header">
        <h1>Patient social history</h1>
      </div>
      <form className="sochistory-card-form">
        {errMsgPost && (
          <div className="sochistory-card-form-err">{errMsgPost}</div>
        )}
        <p>
          <label>Occupations: </label>
          <input
            type="text"
            value={formDatas.occupations}
            name="occupations"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p>
          <label>Income: </label>
          <input
            type="text"
            value={formDatas.income}
            name="income"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p>
          {" "}
          <label>Religion: </label>
          <input
            type="text"
            value={formDatas.religion}
            name="religion"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p>
          <label>Sexual orientation: </label>
          <input
            type="text"
            value={formDatas.sexual_orientation}
            name="sexual_orientation"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p>
          <label>Special diet: </label>
          <input
            type="text"
            value={formDatas.special_diet}
            name="special_diet"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p>
          <label>Smoking: </label>
          <input
            type="text"
            value={formDatas.smoking}
            name="smoking"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p>
          <label>Alcohol: </label>
          <input
            type="text"
            value={formDatas.alcohol}
            name="alcohol"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p>
          <label>Recreational drugs: </label>
          <input
            type="text"
            value={formDatas.recreational_drugs}
            name="recreational_drugs"
            onChange={handleChange}
            autoComplete="off"
          />
        </p>
        <p className="sochistory-card-form-btns">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={handleClose}>Close</button>
        </p>
      </form>
    </div>
  );
};

export default SocHistoryForm;
