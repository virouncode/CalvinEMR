import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toLocalDate } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import {
  getPatientRecord,
  postPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const MedHistoryForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setDatas,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    ongoing: "false",
    description: "",
    date_of_event: Date.parse(new Date()),
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_of_event") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    if (name === "ongoing") {
      value = value === "true";
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDatas.description === "" || formDatas.date_of_event === null) {
      setErrMsgPost(true);
      return;
    }
    try {
      await postPatientRecord(
        "/medical_history",
        auth?.userId,
        auth?.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/medical_history", patientId, auth?.authToken)
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", { containerId: "B" });
    }
  };

  return (
    <tr className="medhistory-form">
      <td>
        <select
          name="ongoing"
          value={formDatas.ongoing}
          onChange={handleChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <input
          name="description"
          type="text"
          value={formDatas.description}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="date_of_event"
          type="date"
          max={toLocalDate(new Date().toISOString())}
          value={
            formDatas.date_of_event !== null
              ? toLocalDate(formDatas.date_of_event)
              : ""
          }
          onChange={handleChange}
        />
      </td>
      <td>
        <em>{formatName(auth?.userName)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.parse(new Date()))}</em>
      </td>
      <td>
        <input type="submit" value="Save" onClick={handleSubmit} />
      </td>
    </tr>
  );
};

export default MedHistoryForm;
