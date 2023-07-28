//Librairies
import React, { useEffect } from "react";
import { useRecord } from "../../../../hooks/useRecord";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
//Components

const RemindersContent = ({ patientId, datas, setDatas }) => {
  useRecord("/reminders", patientId, setDatas);
  useEffect(() => {
    if (datas) {
      datas.forEach((reminder) => {
        if (reminder.active)
          toast.info(reminder.reminder, { autoClose: 3000, containerId: "A" });
      });
    }
  }, [datas]);

  return datas ? (
    <div className="patient-reminders-content">
      {datas.length >= 1 ? (
        <ul>
          {datas.filter((reminder) => reminder.active).length >= 1
            ? datas
                .filter((reminder) => reminder.active)
                .sort(
                  (a, b) => new Date(b.date_created) - new Date(a.date_created)
                )
                .map((reminder) => (
                  <li key={reminder.id}>- {reminder.reminder}</li>
                ))
            : "No active reminder"}
        </ul>
      ) : (
        "No reminders"
      )}
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default RemindersContent;
