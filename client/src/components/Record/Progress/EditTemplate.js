import React, { useState } from "react";
import CopyTemplatesList from "./CopyTemplatesList";
import axios from "../../../api/xano";
import useAuth from "../../../hooks/useAuth";
import EditTemplatesList from "./EditTemplatesList";

const EditTemplate = ({
  setEditTemplateVisible,
  myTemplates,
  setTemplateSelectedId,
  setTemplates,
  setFormDatas,
  formDatas,
}) => {
  const { auth, user } = useAuth();
  const [editTemplateSelectedId, setEditTemplateSelectedId] = useState("-1");
  const [editedTemplate, setEditedTemplate] = useState({
    author_id: user.id,
    body: "",
    name: "",
  });

  const handleSelectEditTemplate = (e) => {
    const value = parseInt(e.target.value);
    setEditTemplateSelectedId(value);
    setEditedTemplate({
      ...editedTemplate,
      body: myTemplates.find(({ id }) => id === value).body,
      name: myTemplates.find(({ id }) => id === value).name,
    });
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditedTemplate({ ...editedTemplate, [name]: value });
  };

  const handleCancel = () => {
    setEditTemplateVisible(false);
  };

  const handleDelete = async () => {
    await axios.delete(`/progress_notes_templates/${editTemplateSelectedId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.authToken}`,
      },
    });
    //reload templates :
    const response = await axios.get("/progress_notes_templates", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.authToken}`,
      },
    });
    setTemplates(response.data);
    setEditTemplateVisible(false);
  };

  const handleSave = async () => {
    //save template
    const templateToPut = { ...editedTemplate };
    templateToPut.date_created = Date.parse(new Date());

    await axios.put(
      `/progress_notes_templates/${editTemplateSelectedId}`,
      templateToPut,
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
    setFormDatas({ ...formDatas, body: editedTemplate.body });
    setTemplateSelectedId(editTemplateSelectedId);
    setEditTemplateVisible(false);
  };
  return (
    <div className="edit-template">
      <div className="edit-template-title">
        Please choose a template to edit/delete in:{"   "}
        <EditTemplatesList
          myTemplates={myTemplates}
          editTemplateSelectedId={editTemplateSelectedId}
          handleSelectEditTemplate={handleSelectEditTemplate}
        />
      </div>
      <div className="edit-template-name">
        <label>Your template name: </label>
        <span>{editedTemplate.name}</span>
      </div>
      <div className="edit-template-body">
        <textarea
          name="body"
          value={editedTemplate.body}
          onChange={handleChange}
        />
      </div>
      <div className="edit-template-btns">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTemplate;
