import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDate } from "../../../../utils/formatDates";
import { putPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const VaccineForm = ({
  setFormVisible,
  setEditable,
  scrollPosition,
  name,
  age,
  datas,
  setDatas,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [formDatas, setFormDatas] = useState(datas);
  //STYLE
  const FORM_STYLE = {
    position: "absolute",
    top: (300 + scrollPosition[1]).toString(),
    left: (600 + scrollPosition[0]).toString(),
    transform: "translate(-50%,-50%)",
    background: "#FEFEFE",
    width: "300px",
    height: "100px",
    zIndex: "1000",
    border: "solid 1px black",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  //HANDLERS
  const handleCancel = () => {
    setFormVisible(false);
    setEditable(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await putPatientRecord(
        "/vaccines",
        formDatas.id,
        user.id,
        auth.authToken,
        formDatas
      );
      setDatas(formDatas);
      setFormVisible(false);
      setEditable(true);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error("Unable to save, please contact admin", {
        containerId: "B",
      });
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      [name]: {
        ...formDatas[name],
        [age]: {
          vaccine_date: value,
          date_created: Date.parse(new Date()),
          created_by_id: user.id,
        },
      },
    });
  };
  return (
    <>
      <div style={FORM_STYLE}>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <div className="vaccines-item-cell-form-row1">
            {" "}
            <label>Date of vaccination: </label>
            <input
              type="date"
              value={
                formDatas[name][age].vaccine_date
                  ? toLocalDate(formDatas[name][age].vaccine_date)
                  : toLocalDate(new Date())
              }
              onChange={handleChange}
              required
            />
          </div>
          <div className="vaccines-item-cell-form-row2">
            {" "}
            <input type="submit" value="Save" />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VaccineForm;
