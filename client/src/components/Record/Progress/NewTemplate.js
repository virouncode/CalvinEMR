import React, { useState } from "react";
import CopyTemplatesList from "./CopyTemplatesList";
import axios from "../../../api/xano";
import useAuth from "../../../hooks/useAuth";

const NewTemplate = ({
  setNewTemplateVisible,
  templates,
  setTemplateSelectedId,
  setTemplates,
  setFormDatas,
  formDatas,
}) => {
  const { auth, user } = useAuth();
  const [copyTemplateSelectedId, setCopyTemplateSelectedId] = useState("-1");
  const [newTemplate, setNewTemplate] = useState({ name: "", body: "" });

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
      alert("Please enter a name for this new template");
      return;
    }
    const templateToSave = { ...newTemplate };
    templateToSave.date_created = Date.parse(new Date());
    templateToSave.author_id = user.id;

    const response = await axios.post(
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
    const response2 = await axios.get("/progress_notes_templates", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.authToken}`,
      },
    });
    setTemplates(response2.data);
    setFormDatas({ ...formDatas, body: newTemplate.body });

    setTemplateSelectedId(response.data.id);
    setNewTemplateVisible(false);
  };
  return (
    <div className="new-template">
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
    </div>
  );
};

export default NewTemplate;
