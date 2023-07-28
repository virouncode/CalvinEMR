//Librairies
import React from "react";
import axios from "../../api/xano";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const SlotSelect = ({ settings, setSettings }) => {
  const { auth } = useAuth();
  const handleChange = async (e) => {
    const value = e.target.value;
    setSettings({ ...settings, slot_duration: value });
    try {
      await axios.put(
        `/settings/${settings.id}`,
        { ...settings, slot_duration: value },
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
    <div className="slot-select">
      <label>Time Slot Duration</label>
      <select
        name="duration"
        value={settings.slot_duration}
        onChange={handleChange}
      >
        <option value="00:05">5 mn</option>
        <option value="00:10">10 mn</option>
        <option value="00:15">15 mn</option>
        <option value="00:20">20 mn</option>
        <option value="00:30">30 mn</option>
        <option value="01:00">1 h</option>
      </select>
    </div>
  );
};

export default SlotSelect;
