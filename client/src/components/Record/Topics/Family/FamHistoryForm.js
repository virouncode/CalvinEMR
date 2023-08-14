import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toLocalDate, toISOStringNoMs } from "../../../../utils/formatDates";
import RelativesList from "../../../Lists/RelativesList";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const FamHistoryForm = ({
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
    family_member_affected: "",
    date_of_event: Date.parse(new Date()),
  });

  //EVENT HANDLERS
  const handleChange = (e) => {
    setErrMsgPost(false);
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_of_event") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formDatas.description === "" ||
      formDatas.date_of_event === null ||
      formDatas.family_member_affected === ""
    ) {
      setErrMsgPost(true);
      return;
    }
    try {
      await postPatientRecord(
        "/family_history",
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
      toast.error(err.message, { containerId: "B" });
    }
  };

  return (
    <tr className="famhistory-form">
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
        <RelativesList
          name="family_member_affected"
          handleChange={handleChange}
          value={formDatas.family_member_affected}
        />
      </td>
      <td>
        <input
          type="date"
          max={toLocalDate(new Date().toISOString())}
          name="date_of_event"
          value={
            formDatas.date_of_event !== null
              ? toLocalDate(formDatas.date_of_event)
              : ""
          }
          onChange={handleChange}
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

export default FamHistoryForm;
