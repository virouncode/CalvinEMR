import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { linkSchema } from "../../validation/linkValidation";

const LinkForm = ({ setAddVisible, setMyLinks }) => {
  const { user, auth, clinic, setClinic } = useAuth();
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const [errMsg, setErrMsg] = useState("");
  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setNewLink({ ...newLink, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await linkSchema.validate(newLink);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }

    try {
      const userInfos = clinic.staffInfos.find(({ id }) => id === user.id);
      const datasToPut = { ...userInfos, links: [...userInfos.links, newLink] };
      await axiosXano.put(`/staff/${user.id}`, datasToPut, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setAddVisible(false);
      setMyLinks([...userInfos.links, newLink]);
      //update staffInfos
      const response2 = await axiosXano.get("/staff", {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      setClinic({ ...clinic, staffInfos: response2.data });
      localStorage.setItem(
        "clinic",
        JSON.stringify({ ...clinic, staffInfos: response2.data })
      );
      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to save link:${err.message}`);
    }
  };
  const handleCancel = (e) => {
    setAddVisible(false);
  };
  return (
    <form className="reference-form" onSubmit={handleSubmit}>
      {errMsg && <p className="reference-form-err">{errMsg}</p>}
      <div className="reference-form-row">
        <label htmlFor="name">Enter a name</label>
        <input
          type="text"
          value={newLink.name}
          id="name"
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />
      </div>
      <div className="reference-form-row">
        <label htmlFor="url">Enter a URL</label>
        <input
          type="text"
          value={newLink.url}
          id="url"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="reference-form-btns">
        <input type="submit" value="Save" />
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default LinkForm;
