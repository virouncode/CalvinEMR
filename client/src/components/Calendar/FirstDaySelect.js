//Librairies
import React from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const FirstDaySelect = ({ settings, setSettings }) => {
  const { auth } = useAuth();
  const handleChange = async (e) => {
    const value = e.target.value;
    setSettings({ ...settings, first_day: value });
    try {
      await axios.put(
        `/settings/${settings.id}`,
        { ...settings, first_day: value },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      toast.success("Saved preference", { containerId: "A" });
    } catch (err) {
      toast.success("Unable to change preference, please contact admin", {
        containerId: "A",
      });
    }
  };
  return (
    <div className="day-select">
      <label>First day of the week</label>
      <select
        name="duration"
        value={settings.first_day}
        onChange={handleChange}
      >
        <option value="0">Sunday</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </select>
    </div>
  );
};

export default FirstDaySelect;
