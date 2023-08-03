import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toISOStringNoMs, toLocalDate } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import {
  getPatientRecord,
  postPatientRecord,
} from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const RiskForm = ({
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
    description: "",
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    let value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDatas.description === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await postPatientRecord(
        "/risk_factors",
        user.id,
        auth.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/risk_factors", patientId, auth.authToken)
      );
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
    <tr className="risk-form">
      <td>
        <input
          type="text"
          value={formDatas.description}
          onChange={handleChange}
          name="description"
          autoComplete="off"
        />
      </td>
      <td>
        <em>{formatName(user.name)}</em>
      </td>
      <td>
        <em>{toLocalDate(toISOStringNoMs(new Date()))}</em>
      </td>
      <td>
        <input type="submit" value="Save" onClick={handleSubmit} />
      </td>
    </tr>
  );
};

export default RiskForm;
