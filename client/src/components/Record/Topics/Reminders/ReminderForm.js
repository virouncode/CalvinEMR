import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toLocalDate } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import {
  getPatientRecord,
  postPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const ReminderForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setDatas,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    active: true,
    reminder: "",
  });
  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    let value = e.target.value;
    const name = e.target.name;
    if (name === "active") {
      value = value === "true";
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDatas.reminder === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await postPatientRecord("/reminders", user.id, auth.authToken, formDatas);
      setDatas(await getPatientRecord("/reminders", patientId, auth.authToken));
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", {
        containerId: "B",
      });
    }
  };

  return (
    <tr className="reminders-form">
      <td>
        <select
          name="active"
          value={formDatas.active.toString()}
          onChange={handleChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <input
          type="text"
          value={formDatas.reminder}
          name="reminder"
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{formatName(user.name)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.parse(new Date()))}</em>
      </td>
      <td style={{ textAlign: "center" }}>
        <input type="submit" value="Save" onClick={handleSubmit} />
      </td>
    </tr>
  );
};

export default ReminderForm;
