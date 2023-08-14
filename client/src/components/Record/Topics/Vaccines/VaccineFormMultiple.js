import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDate } from "../../../../utils/formatDates";
import { putPatientRecord } from "../../../../api/fetchRecords";
import { toast } from "react-toastify";

const VaccineFormMultiple = ({
  setFormVisible,
  setEditable,
  scrollPosition,
  name,
  age,
  datas,
  fetchRecord,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [formDatas, setFormDatas] = useState(datas);
  useEffect(() => {
    formDatas[name][age].push({
      vaccine_date: "",
      date_created: null,
      created_by_id: user.id,
    }); // eslint-disable-next-line
  }, []);

  //STYLE
  const FORM_STYLE = {
    position: "absolute",
    top: (300 - 50 + scrollPosition[1]).toString(),
    left: (600 - 150 + scrollPosition[0]).toString(),
    background: "#FEFEFE",
    width: "300px",
    height: "100px",
    zIndex: "1000",
    border: "solid 1px black",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Arial",
  };

  //HANDLERS
  const handleCancel = () => {
    setFormVisible(false);
    setEditable(true);
    const array = formDatas[name][age];
    array.pop();
    setFormDatas({
      ...formDatas,
      [name]: {
        ...formDatas[name],
        [age]: array,
      },
    });
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
      const abortController = new AbortController();
      fetchRecord(abortController);
      setFormVisible(false);
      setEditable(true);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(err.message, {
        containerId: "B",
      });
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const array = formDatas[name][age];
    array[array.length - 1] = {
      vaccine_date: Date.parse(value),
      date_created: Date.parse(new Date()),
      created_by_id: user.id,
    };
    setFormDatas({
      ...formDatas,
      [name]: {
        ...formDatas[name],
        [age]: array,
      },
    });
  };
  return (
    <div style={FORM_STYLE}>
      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <div className="vaccines-item-cell-form-row1">
          {" "}
          <label>Date of vaccination: </label>
          <input
            type="date"
            value={
              formDatas[name][age]?.slice(-1)[0]?.vaccine_date
                ? toLocalDate(formDatas[name][age].slice(-1)[0].vaccine_date)
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
  );
};

export default VaccineFormMultiple;
