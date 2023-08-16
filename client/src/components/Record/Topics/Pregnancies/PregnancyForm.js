import React, { useState } from "react";
import PregnanciesList from "../../../Lists/PregnanciesList";
import formatName from "../../../../utils/formatName";
import { toLocalDate, toISOStringNoMs } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const PregnancyForm = ({
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
    date_of_event: Date.parse(new Date()),
    premises: "",
    term_nbr_of_weeks: "",
    term_nbr_of_days: "",
  });

  //HANDLERS
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
    if (formDatas.date_of_event === null || formDatas.description === "") {
      setErrMsgPost(true);
      return;
    }
    try {
      await postPatientRecord(
        "/pregnancies",
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
      toast.error(`Error: unable to save pregnancey event: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr className="pregnancies-form">
      <td>
        <PregnanciesList
          value={formDatas.description}
          name="description"
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="date_of_event"
          type="date"
          value={
            formDatas.date_of_event !== null
              ? toLocalDate(formDatas.date_of_event)
              : ""
          }
          onChange={handleChange}
          className="pregnancies-form-input2"
        />
      </td>
      <td>
        <input
          name="premises"
          type="text"
          value={formDatas.premises}
          onChange={handleChange}
          autoComplete="off"
          className="pregnancies-form-input1"
        />
      </td>
      <td>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "150px",
          }}
        >
          <input
            name="term_nbr_of_weeks"
            type="number"
            value={formDatas.term_nbr_of_weeks}
            onChange={handleChange}
            autoComplete="off"
            className="pregnancies-form-input3"
          />
          w
          <input
            name="term_nbr_of_days"
            type="number"
            value={formDatas.term_nbr_of_days}
            onChange={handleChange}
            autoComplete="off"
            className="pregnancies-form-input3"
          />
          d
        </div>
      </td>
      <td>
        <em>{formatName(user.name)}</em>{" "}
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

export default PregnancyForm;
