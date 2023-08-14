//Librairies
import React from "react";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const FirstDaySelect = () => {
  const { auth, user, setUser } = useAuth();
  const handleChange = async (e) => {
    const value = e.target.value;
    try {
      await axiosXano.put(
        `/settings/${user.settings.id}`,
        { ...user.settings, first_day: value },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      setUser({
        ...user,
        settings: { ...user.settings, first_day: value },
      });
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
        value={user.settings.first_day}
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
