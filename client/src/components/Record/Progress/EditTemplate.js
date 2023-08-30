import React, { useState } from "react";
import axiosXano from "../../../api/xano";
import useAuth from "../../../hooks/useAuth";
import EditTemplatesList from "./EditTemplatesList";
import { ToastContainer, toast } from "react-toastify";
import ConfirmPopUp, { confirmAlertPopUp } from "../../Confirm/ConfirmPopUp";

const EditTemplate = ({
  setEditTemplateVisible,
  myTemplates,
  setTemplateSelectedId,
  setTemplates,
  setFormDatas,
  formDatas,
}) => {
  const { auth, user } = useAuth();
  const [editTemplateSelectedId, setEditTemplateSelectedId] = useState("");
  const [editedTemplate, setEditedTemplate] = useState({
    author_id: user.id,
    body: "",
    name: "",
  });

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
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this template ?",
      })
    ) {
      try {
        await axiosXano.delete(
          `/progress_notes_templates/${editTemplateSelectedId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        //reload templates :
        const response = await axiosXano.get("/progress_notes_templates", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        setTemplates(
          response.data.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
        );
        setEditTemplateVisible(false);
        setTemplateSelectedId("");
        setFormDatas({ ...formDatas, body: "" });
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to delete template: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const handleSave = async () => {
    //save template
    const templateToPut = { ...editedTemplate };
    templateToPut.date_created = Date.parse(new Date());

    try {
      await axiosXano.put(
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
      const response2 = await axiosXano.get("/progress_notes_templates", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setTemplates(
        response2.data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
      );
      setFormDatas({ ...formDatas, body: editedTemplate.body });
      setTemplateSelectedId(editTemplateSelectedId);
      setEditTemplateVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save template: ${err.message}`, {
        containerId: "B",
      });
    }
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
          readOnly={!editTemplateSelectedId}
        />
      </div>
      <div className="edit-template-btns">
        <button onClick={handleSave} disabled={!editTemplateSelectedId}>
          Save
        </button>
        <button onClick={handleDelete} disabled={!editTemplateSelectedId}>
          Delete
        </button>
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

export default EditTemplate;
