import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { postPatientRecord } from "../../../../api/fetchRecords";
import useAuth from "../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { allergySchema } from "../../../../validation/allergyValidation";

const AllergyForm = ({
  editCounter,
  setAddVisible,
  patientId,
  fetchRecord,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth, user, clinic } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    allergy: "",
  });

  useEffect(() => {
    const socket = io(
      "https://fierce-retreat-45158-56541fefe81e.herokuapp.com/"
    );
    socket.on("xano message", (message) => {
      alert(message);
      // if (message.action === 'create') {
      //   // Handle message creation
      //   setMessages([...messages, message.data]);
      // } else if (message.action === 'update') {
      //   // Handle message update
      //   setMessages((prevMessages) => {
      //     return prevMessages.map((prevMessage) =>
      //       prevMessage.id === message.data.id ? message.data : prevMessage
      //     );
      //   });
      // } else if (message.action === 'delete') {
      //   // Handle message deletion
      //   setMessages((prevMessages) =>
      //     prevMessages.filter((prevMessage) => prevMessage.id !== message.data.id)
      //   );
      // }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
        <em>{staffIdToTitleAndName(clinic.staffInfos, user.id, true)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
      <td style={{ textAlign: "center" }}>
        <input type="submit" value="Save" onClick={handleSubmit} />
      </td>
    </tr>
  );
};

export default AllergyForm;
