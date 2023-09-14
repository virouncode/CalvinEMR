import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { postPatientRecord } from "../../../../api/fetchRecords";
import axiosXano from "../../../../api/xano";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";

const DocumentForm = ({
  patientId,
  fetchRecord,
  setAddVisible,
  editCounter,
  setErrMsgPost,
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
      description: firstLetterUpper(formDatas.description),
    });
    const datasToPost = {
      ...formDatas,
      description: firstLetterUpper(formDatas.description),
    };
    //Validation
    if (datasToPost.description === "") {
      setErrMsgPost("Description field is required");
      return;
    }
    try {
      await postPatientRecord(
        "/documents",
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
      toast.error(`Error unable to save document: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  const handleUpload = async (e) => {
    setErrMsgPost("");
    setSaveDisabled(true);
    const file = e.target.files[0];
    if (file.size > 25000000) {
      setErrMsgPost("The file is over 25Mb, please choose another file");
      setIsLoadingFile(false);
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
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
        toast.error(`Error unable to load document: ${err.message}`, {
          containerId: "B",
        });
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
            accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
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
