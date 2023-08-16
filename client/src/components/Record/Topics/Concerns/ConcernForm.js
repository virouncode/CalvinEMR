import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toISOStringNoMs, toLocalDate } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const ConcernForm = ({
  editCounter,
  setAddVisible,
  patientId,
  fetchRecord,
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
        "/ongoing_concerns",
        user.id,
        auth.authToken,
        formDatas
      );
      const abortController = new AbortController();
      fetchRecord(abortController);
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save ongoing concern: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr className="concerns-form">
      <td>
        <input
          name="description"
          onChange={handleChange}
          type="text"
          value={formDatas.description}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{formatName(user.name)}</em>
      </td>
      <td>
        <em>{toLocalDate(toISOStringNoMs(new Date()))}</em>
      </td>
      <td style={{ textAlign: "center" }}>
        <input type="submit" value="Save" onClick={handleSubmit} />
      </td>
    </tr>
  );
};

export default ConcernForm;
