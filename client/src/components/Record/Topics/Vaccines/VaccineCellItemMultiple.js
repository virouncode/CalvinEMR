import React, { useState } from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import VaccineFormMultiple from "./VaccineFormMultiple";
import VaccineHistory from "./VaccineHistory";

const VaccineCellItemMultiple = ({
  age,
  name,
  type,
  datas,
  fetchRecord,
  editable,
  setEditable,
  vaccineInfos,
  patientInfos,
  setErrMsgPost,
}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState([0, 0]);

  const handleAddClick = (e) => {
    setErrMsgPost("");
    setScrollPosition([e.nativeEvent.view.scrollX, e.nativeEvent.view.scrollY]);
    setFormVisible((v) => !v);
    setEditable(false);
  };

  const handleHistoryClick = () => {
    setErrMsgPost("");
    setHistoryVisible((v) => !v);
  };

  return (
    <div className="vaccines-item-cell">
      {name === "Inf" ? (
        <label>
          Every year in the fall{" "}
          {vaccineInfos.length
            ? `(last : ${toLocalDate(
                vaccineInfos
                  .sort((a, b) => a.vaccine_date - b.vaccine_date)
                  .slice(-1)[0].vaccine_date
              )})`
            : ""}{" "}
        </label>
      ) : name === "Tdap_pregnancy" ? (
        <label>
          One dose in every pregnancy, ideally between 27-32 weeks of gestation{" "}
          {vaccineInfos.length
            ? `(last : ${toLocalDate(
                vaccineInfos
                  .sort((a, b) => a.vaccine_date - b.vaccine_date)
                  .slice(-1)[0].vaccine_date
              )})`
            : ""}{" "}
        </label>
      ) : (
        <label>
          Every ten years <br />{" "}
          {vaccineInfos.length
            ? `(last : ${toLocalDate(
                vaccineInfos
                  .sort((a, b) => a.vaccine_date - b.vaccine_date)
                  .slice(-1)[0].vaccine_date
              )})`
            : ""}{" "}
        </label>
      )}
      <button
        type="button"
        onClick={handleAddClick}
        className="vaccines-item-cell-multiple-btn"
        disabled={!editable}
      >
        {"+"}
      </button>
      <button
        type="button"
        onClick={handleHistoryClick}
        className="vaccines-item-cell-multiple-btn"
        disabled={!editable}
      >
        {"..."}
      </button>
      {formVisible && (
        <VaccineFormMultiple
          setFormVisible={setFormVisible}
          setEditable={setEditable}
          scrollPosition={scrollPosition}
          name={name}
          age={age}
          datas={datas}
          fetchRecord={fetchRecord}
          setErrMsgPost={setErrMsgPost}
        />
      )}
      {historyVisible && (
        <div style={{ position: "relative" }}>
          <VaccineHistory vaccineInfos={vaccineInfos} name={name} />
        </div>
      )}
    </div>
  );
};

export default VaccineCellItemMultiple;
