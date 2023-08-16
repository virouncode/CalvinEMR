//Librairies
import React from "react";
import axiosXano from "../../api/xano";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const SlotSelect = () => {
  const { auth, setUser, user } = useAuth();
  const handleChange = async (e) => {
    const value = e.target.value;
    try {
      await axiosXano.put(
        `/settings/${user.settings.id}`,
        { ...user.settings, slot_duration: value },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      setUser({
        ...user,
        settings: { ...user.settings, slot_duration: value },
      });
      toast.success("Saved preference", { containerId: "A" });
    } catch (err) {
      toast.success(err.message, {
        containerId: "A",
      });
    }
  };
  return (
    <div className="slot-select">
      <label>Time Slot Duration</label>
      <select
        name="duration"
        value={user.settings.slot_duration}
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
