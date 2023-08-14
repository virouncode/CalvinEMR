import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import axiosXano from "../../../../api/xano";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const DocumentForm = ({
  patientId,
  fetchRecord,
  setAddVisible,
  editCounter,
  setErrMsgPost,
  setAlertVisible,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    description: "",
    file: null,
  });
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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
      await postPatientRecord("/documents", user.id, auth.authToken, formDatas);
      const abortController = new AbortController();
      fetchRecord(abortController);
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(err.message, { containerId: "B" });
    }
  };
  const handleUpload = async (e) => {
    setAlertVisible(false);
    setIsLoadingFile(true);
    setSaveDisabled(true);
    const file = e.target.files[0];
    if (file.size > 20000000) {
      setAlertVisible(true);
      setIsLoadingFile(false);
      return;
    }
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      let fileToUpload;
      try {
        fileToUpload = await axiosXano.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setIsLoadingFile(false);
        setSaveDisabled(false);
        setFormDatas({ ...formDatas, file: fileToUpload.data });
      } catch (err) {
        setIsLoadingFile(false);
        toast.error(err.message, { containerId: "B" });
      }
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
          <input
            name="file"
            required
            type="file"
            onChange={handleUpload}
            accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .wav"
          />
        </div>
        <div className="documents-form-content-row">
          {!saveDisabled && <input type="submit" value="Save" />}
        </div>
        <div className="documents-form-content-row">
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
