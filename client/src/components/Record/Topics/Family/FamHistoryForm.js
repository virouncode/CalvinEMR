import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toLocalDate, toISOStringNoMs } from "../../../../utils/formatDates";
import RelativesList from "../../../Lists/RelativesList";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";
import { famHistorySchema } from "../../../../validation/famHistoryValidation";
import { firstLetterOfFirstWordUpper } from "../../../../utils/firstLetterUpper";

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
    date_of_event: Date.now(),
  });

  //EVENT HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_of_event") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleMemberChange = (value) => {
    setFormDatas({ ...formDatas, family_member_affected: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      description: firstLetterOfFirstWordUpper(formDatas.description),
    };
    //Validation
    try {
      await famHistorySchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/family_history",
        user.id,
        auth.authToken,
        datasToPost
      );
      const abortController = new AbortController();
      fetchRecord(abortController);
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save family history item: ${err.message}`, {
        containerId: "B",
      });
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
          handleChange={handleMemberChange}
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
