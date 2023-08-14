import React, { useState } from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import { getVaccinationLogo } from "../../../../utils/getVaccinationLogo";
import VaccineForm from "./VaccineForm";
import { confirmAlertPopUp } from "../../../Confirm/ConfirmPopUp";
import useAuth from "../../../../hooks/useAuth";
import { putPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const VaccineCellItemSingle = ({
  age,
  type,
  name,
  vaccineInfos,
  rangeStart,
  rangeEnd,
  datas,
  fetchRecord,
  editable,
  setEditable,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [formVisible, setFormVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState([0, 0]);

  //STYLES
  const INTERVAL_STYLE = {
    color: rangeEnd < new Date() ? "crimson" : "black",
  };

  //HANDLERS
  const handleCheck = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      setFormVisible(true);
      setScrollPosition([
        e.nativeEvent.view.scrollX,
        e.nativeEvent.view.scrollY,
      ]);
      setEditable(false);
    } else {
      if (
        await confirmAlertPopUp({
          content:
            "Do you really want to remove this vaccination ? (vaccination date will be lost",
        })
      ) {
        const newDatas = { ...datas };
        newDatas[name][age] = {
          vaccine_date: null,
          date_created: Date.parse(new Date()),
          created_by_id: user.id,
        };
        try {
          await putPatientRecord(
            "/vaccines",
            datas.id,
            user.id,
            auth.authToken,
            newDatas
          );
          const abortController = new AbortController();
          fetchRecord(abortController);
          toast.success("Saved successfully", { containerId: "B" });
        } catch (err) {
          toast.error(err.message, { containerId: "B" });
        }
      }
    }
  };

  const isChecked = () => {
    return vaccineInfos.vaccine_date ? true : false;
  };

  return (
    <div className="vaccines-item-cell">
      <input
        type="checkbox"
        onChange={handleCheck}
        name={name}
        checked={isChecked()}
        disabled={!editable}
      />
      {vaccineInfos.vaccine_date ? (
        <label className="vaccines-item-cell-checked">
          {toLocalDate(vaccineInfos.vaccine_date)} {getVaccinationLogo(type)}
        </label>
      ) : (
        <label>
          <span style={INTERVAL_STYLE}>
            {age === "grade_7"
              ? `Grade 7 to 12 (til ${toLocalDate(rangeEnd)})`
              : `${toLocalDate(rangeStart)} to ${toLocalDate(rangeEnd)}`}
          </span>{" "}
          {getVaccinationLogo(type)}
        </label>
      )}
      {formVisible && (
        <VaccineForm
          setFormVisible={setFormVisible}
          setEditable={setEditable}
          datas={datas}
          fetchRecord={fetchRecord}
          scrollPosition={scrollPosition}
          name={name}
          age={age}
        />
      )}
    </div>
  );
};

export default VaccineCellItemSingle;
