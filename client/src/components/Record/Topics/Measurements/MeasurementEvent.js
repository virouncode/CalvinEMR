//Librairies
import React, { useState } from "react";
import { toast } from "react-toastify";

//Components
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";

//Utils
import { toLocalDate } from "../../../../utils/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
  cmToFeet,
  feetToCm,
  kgToLbs,
  lbsToKg,
} from "../../../../utils/measurements";
import useAuth from "../../../../hooks/useAuth";
import {
  deletePatientRecord,
  getPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import formatName from "../../../../utils/formatName";

const MeasurementEvent = ({ event, setDatas, editCounter, setErrMsgPost }) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [eventInfos, setEventInfos] = useState(event);

  //HANDLERS
  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost(false);
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlertPopUp({
        content: "Do you really want to delete this item ?",
      })
    ) {
      await deletePatientRecord("/measurements", event.id, auth.authToken);
      setDatas(
        await getPatientRecord(
          "/measurements",
          event.patient_id,
          auth.authToken
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = { ...eventInfos };
    if (
      !formDatas.height_cm &&
      !formDatas.weight_kg &&
      !formDatas.blood_pressure_diastolic &&
      !formDatas.blood_pressure_systolic &&
      !formDatas.waist_circumference
    ) {
      setErrMsgPost(true);
      return;
    }
    try {
      await putPatientRecord(
        "/measurements",
        event.id,
        user.id,
        auth.authToken,
        formDatas
      );
      setDatas(
        await getPatientRecord(
          "/measurements",
          event.patient_id,
          auth.authToken
        )
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", { containerId: "B" });
    }
  };

  const handleChange = async (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    const value = e.target.value;
    setEventInfos({ ...eventInfos, [name]: value });

    switch (name) {
      case "height_cm": {
        const heightFeet = cmToFeet(value);
        if (eventInfos.weight_kg) {
          const bmi = bodyMassIndex(value, eventInfos.weight_kg);
          const bsa = bodySurfaceArea(value, eventInfos.weight_kg);
          setEventInfos({
            ...eventInfos,
            height_cm: value,
            height_feet: heightFeet,
            body_mass_index: bmi,
            body_surface_area: bsa,
          });
        } else {
          setEventInfos({
            ...eventInfos,
            height_cm: value,
            height_feet: heightFeet,
          });
        }
        break;
      }
      case "height_feet": {
        const heightCm = feetToCm(value);
        if (eventInfos.weight_kg) {
          const bmi = bodyMassIndex(heightCm, eventInfos.weight_kg);
          const bsa = bodySurfaceArea(heightCm, eventInfos.weight_kg);
          setEventInfos({
            ...eventInfos,
            height_cm: heightCm,
            height_feet: value,
            body_mass_index: bmi,
            body_surface_area: bsa,
          });
        } else {
          setEventInfos({
            ...eventInfos,
            height_cm: heightCm,
            height_feet: value,
          });
        }
        break;
      }
      case "weight_kg": {
        const weightLbs = kgToLbs(value);
        if (eventInfos.height_cm) {
          const bmi = bodyMassIndex(eventInfos.height_cm, value);
          const bsa = bodySurfaceArea(eventInfos.height_cm, value);
          setEventInfos({
            ...eventInfos,
            weight_kg: value,
            weight_lbs: weightLbs,
            body_mass_index: bmi,
            body_surface_area: bsa,
          });
        } else {
          setEventInfos({
            ...eventInfos,
            weight_kg: value,
            weight_lbs: weightLbs,
          });
        }
        break;
      }
      case "weight_lbs": {
        const weightKg = lbsToKg(value);
        if (eventInfos.height_cm) {
          const bmi = bodyMassIndex(eventInfos.height_cm, weightKg);
          const bsa = bodySurfaceArea(eventInfos.height_cm, weightKg);
          setEventInfos({
            ...eventInfos,
            weight_kg: weightKg,
            weight_lbs: value,
            body_mass_index: bmi,
            body_surface_area: bsa,
          });
        } else {
          setEventInfos({
            ...eventInfos,
            weight_kg: weightKg,
            weight_lbs: value,
          });
        }
        break;
      }
      default: {
        setEventInfos({ ...eventInfos, [name]: value });
        break;
      }
    }
  };

  return (
    eventInfos && (
      <tr className="measurements-event">
        <td>
          {editVisible ? (
            <input
              type="text"
              name="height_cm"
              value={eventInfos.height_cm || ""} //if 0 then ""
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.height_cm || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="height_feet"
              value={eventInfos.height_feet || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.height_feet || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="weight_kg"
              value={eventInfos.weight_kg || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.weight_kg || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="weight_lbs"
              value={eventInfos.weight_lbs || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.weight_lbs || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="waist_circumference"
              value={eventInfos.waist_circumference || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.waist_circumference || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              readOnly
              value={eventInfos.body_mass_index || ""}
              autoComplete="off"
            />
          ) : (
            eventInfos.body_mass_index || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              readOnly
              value={eventInfos.body_surface_area || ""}
              autoComplete="off"
            />
          ) : (
            eventInfos.body_surface_area || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="blood_pressure_systolic"
              value={eventInfos.blood_pressure_systolic || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.blood_pressure_systolic || ""
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="blood_pressure_diastolic"
              value={eventInfos.blood_pressure_diastolic || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.blood_pressure_diastolic || ""
          )}
        </td>
        <td>
          <em>{formatName(eventInfos.created_by_name.full_name)}</em>{" "}
        </td>
        <td>
          <em>{toLocalDate(eventInfos.date_created)}</em>
        </td>
        <td>
          <div className="measurements-event-btn-container">
            {!editVisible ? (
              <button onClick={handleEditClick}>Edit</button>
            ) : (
              <input type="submit" value="Save" onClick={handleSubmit} />
            )}
            <button onClick={handleDeleteClick}>Delete</button>
          </div>
        </td>
      </tr>
    )
  );
};

export default MeasurementEvent;
