import React, { useState } from "react";
import formatName from "../../../../utils/formatName";
import { toLocalDate } from "../../../../utils/formatDates";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";
import { allergySchema } from "../../../../validation/allergyValidation";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";

const AllergyForm = ({
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
    allergy: "",
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
    setFormDatas({
      ...formDatas,
      allergy: firstLetterUpper(formDatas.allergy),
    });
    const datasToPost = {
      ...formDatas,
      allergy: firstLetterUpper(formDatas.allergy),
    };
    //Validation
    try {
      await allergySchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/allergies",
        user.id,
        auth.authToken,
        datasToPost
      );
      const abortController = new AbortController();
      await fetchRecord(abortController);
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save new allergy: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr className="allergies-form">
      <td>
        <input
          name="allergy"
          type="text"
          value={formDatas.allergy}
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

export default AllergyForm;
