import React, { useState } from "react";
import CopyTemplatesList from "./CopyTemplatesList";
import axiosXano from "../../../api/xano";
import useAuth from "../../../hooks/useAuth";
import AlertMsg from "../../Alert/AlertMsg";
import { ToastContainer, toast } from "react-toastify";
import ConfirmPopUp from "../../Confirm/ConfirmPopUp";

const NewTemplate = ({
  setNewTemplateVisible,
  templates,
  setTemplateSelectedId,
  setTemplates,
  setFormDatas,
  formDatas,
}) => {
  const { auth, user } = useAuth();
  const [copyTemplateSelectedId, setCopyTemplateSelectedId] = useState("");
  const [newTemplate, setNewTemplate] = useState({ name: "", body: "" });
  const [alertVisible, setAlertVisible] = useState(false);

  const DIALOG_CONTAINER_STYLE = {
    height: "100vh",
    width: "200vw",
    fontFamily: "Arial",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    top: "0px",
    left: "0px",
    background: "rgba(0,0,0,0.8)",
    zIndex: "100000",
  };

  const handleSelectCopyTemplate = (e) => {
    const value = parseInt(e.target.value);
    setCopyTemplateSelectedId(value);
    setNewTemplate({
      ...newTemplate,
      body: templates.find(({ id }) => id === value).body,
    });
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleCancel = () => {
    setNewTemplateVisible(false);
  };

  const handleSave = async () => {
    //save template
    if (!newTemplate.name) {
      setAlertVisible(true);
      return;
    }
    const templateToSave = { ...newTemplate };
    templateToSave.date_created = Date.parse(new Date());
    templateToSave.author_id = user.id;
    try {
      const response = await axiosXano.post(
        "/progress_notes_templates",
        templateToSave,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      //reload templates :
      const response2 = await axiosXano.get("/progress_notes_templates", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setTemplates(response2.data);
      setFormDatas({ ...formDatas, body: newTemplate.body });
      setTemplateSelectedId(response.data.id);
      setNewTemplateVisible(false);
      toast.success("Saved succesfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save template: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  return (
    <div className="new-template">
      <AlertMsg
        severity="error"
        title="Error"
        msg="Please enter a name for this new template"
        open={alertVisible}
        setOpen={setAlertVisible}
      />
      <div className="new-template-title">
        Please write a new template or copy{" "}
        <CopyTemplatesList
          templates={templates}
          copyTemplateSelectedId={copyTemplateSelectedId}
          handleSelectCopyTemplate={handleSelectCopyTemplate}
        />
      </div>
      <div className="new-template-name">
        <input
          type="text"
          name="name"
          value={newTemplate.name}
          onChange={handleChange}
          placeholder="New template name"
        />
      </div>
      <div className="new-template-body">
        <textarea
          name="body"
          value={newTemplate.body}
          onChange={handleChange}
        />
      </div>
      <div className="new-template-btns">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
      <ConfirmPopUp containerStyle={DIALOG_CONTAINER_STYLE} />
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </div>
  );
};

export default NewTemplate;
