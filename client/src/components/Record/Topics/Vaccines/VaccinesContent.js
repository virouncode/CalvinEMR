import React from "react";
import { useRecord } from "../../../../hooks/useRecord";

const VaccinesContent = ({ patientId, setDatas, datas, patientInfos }) => {
  useRecord("/vaccines", patientId, setDatas);
  return (
    datas && (
      <div className="patient-vaccines-content">
        Open pop-up to see the patient's vaccination table
      </div>
    )
  );
};

export default VaccinesContent;
