import React, { useEffect, useState } from "react";
import MedsSearch from "./MedsSearch";
import { getActiveIngredients, getRoute } from "../../../../api/medsService";
import useAuth from "../../../../hooks/useAuth";
import {
  getPatientRecord,
  postPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const MedicationForm = ({
  patientId,
  setDatas,
  setAddVisible,
  editCounter,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth } = useAuth();
  const [allergies, setAllergies] = useState([]);
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    name: "",
    active_ingredients: "",
    route_of_administration: "",
    dose: "",
    frequency: "",
    number_of_doses: "",
    duration: "",
    active: true,
  });

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const allergiesResults = await getPatientRecord(
          "/allergies",
          patientId,
          auth?.authToken
        );
        setAllergies(allergiesResults);
      } catch (err) {}
    };
    fetchAllergies();
  }, [auth?.authToken, patientId]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    let value = e.target.value;
    const name = e.target.name;
    if (name === "start") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDatas.name === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await postPatientRecord(
        "/medications",
        auth?.userId,
        auth?.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/medications", patientId, auth?.authToken)
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", { containerId: "B" });
    }
  };

  const handleMedClick = async (drugName, drugCode) => {
    const activeIngredients = await getActiveIngredients(drugCode);
    const route = await getRoute(drugCode);
    setFormDatas({
      ...formDatas,
      name: drugName,
      active_ingredients: activeIngredients,
      route_of_administration: route,
    });
  };

  return (
    <div className="medications-form-container">
      <form>
        <div className="medications-form-allergies">
          <i
            className="fa-solid fa-triangle-exclamation"
            style={{ color: "#ff0000" }}
          ></i>{" "}
          Patient Allergies :{" "}
          {allergies.length > 0
            ? allergies.map(({ allergy }) => allergy).join(", ")
            : "No Allergies"}
        </div>
        <div className="medications-form-row">
          <label>Medication Name</label>
          <input
            name="name"
            type="text"
            value={formDatas.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form-row">
          <label>Active Ingredients</label>
          <input
            name="active_ingredients"
            type="text"
            value={formDatas.active_ingredients}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form-row">
          <label>Route of administration</label>
          <input
            name="route_of_administration"
            type="text"
            value={formDatas.route_of_administration}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form-row">
          <label>Dose</label>
          <input
            name="dose"
            type="text"
            value={formDatas.dose}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form-row">
          <label>Frequency</label>
          <input
            name="frequency"
            type="text"
            value={formDatas.frequency}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form-row">
          <label>Number of doses</label>
          <input
            name="number_of_doses"
            type="text"
            value={formDatas.number_of_doses}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form-row">
          <label>Duration of treatment</label>
          <input
            name="duration"
            type="text"
            value={formDatas.duration}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form-row">
          <button
            type="button"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            Save
          </button>
        </div>
      </form>
      <MedsSearch handleMedClick={handleMedClick} />
    </div>
  );
};

export default MedicationForm;