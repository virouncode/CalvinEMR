import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toISOStringNoMs, toLocalDate } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";
import { riskSchema } from "../../../../validation/riskValidation";
import { firstLetterOfFirstWordUpper } from "../../../../utils/firstLetterUpper";

const RiskForm = ({
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
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
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
      await riskSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/risk_factors",
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
      toast.error(`Error unable to save risk factor: ${err.message}`, {
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
