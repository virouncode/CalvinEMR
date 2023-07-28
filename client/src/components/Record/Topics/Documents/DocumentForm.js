import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import {
  getPatientRecord,
  postPatientRecord,
} from "../../../../api/fetchRecords";
import axios from "../../../../api/xano";
import { toast } from "react-toastify";

const DocumentForm = ({
  patientId,
  setDatas,
  setAddVisible,
  editCounter,
  setErrMsgPost,
  setAlertVisible,
}) => {
  //HOOKS
  const { auth } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    description: "",
    file: null,
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
        "/documents",
        auth?.userId,
        auth?.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord("/documents", patientId, auth?.authToken)
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", { containerId: "B" });
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file.size > 20000000) {
      setAlertVisible(true);
      return;
    }
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      let fileToUpload = await axios.post(
        "/upload/attachment",
        {
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.authToken}`,
          },
        }
      );
      setFormDatas({ ...formDatas, file: fileToUpload.data });
    };
  };

  return (
    <div className="documents-form">
      <form className="documents-form-content" onSubmit={handleSubmit}>
        <div className="documents-form-content-row">
          <label>Description</label>
          <input
            name="description"
            required
            type="text"
            value={formDatas.description}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="documents-form-content-row">
          <label>Upload document</label>
          <input name="file" required type="file" onChange={handleUpload} />
        </div>
        <div className="documents-form-content-row">
          <input type="submit" value="Save" />
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
