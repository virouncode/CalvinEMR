import React, { useState } from "react";
import { postPatientRecord } from "../../../../api/fetchRecords";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";

const SocHistoryForm = ({ fetchRecord, setPopUpVisible, patientId }) => {
  const { user, auth } = useAuth();
  const [formDatas, setFormDatas] = useState({});
  const handleChange = (e) => {
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
    const formDatasToPost = { ...formDatas };
    formDatasToPost.patient_id = patientId;
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
      <form className="sochistory-card-form">
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
