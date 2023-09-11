import React from "react";
import { getVaccinationInterval } from "../../../../utils/getVaccinationInterval";
import VaccineCellItemSingle from "./VaccineCellItemSingle";
import VaccineCellItemDouble from "./VaccineCellItemDouble";
import VaccineCellItemMultiple from "./VaccineCellItemMultiple";

const VaccineCell = ({
  age,
  name,
  type,
  vaccineId,
  dose,
  vaccineInfos,
  patientInfos,
  editable,
  setEditable,
  datas,
  fetchRecord,
  setErrMsgPost,
}) => {
  return vaccineInfos ? (
    <td colSpan={vaccineId === 16 ? "5" : vaccineId === 17 ? "10" : "0"}>
      {dose === "single" ? ( //single dose
        <VaccineCellItemSingle
          age={age}
          name={name}
          type={type}
          vaccineInfos={vaccineInfos}
          rangeStart={
            getVaccinationInterval(age, patientInfos.date_of_birth, name)
              .rangeStart
          }
          rangeEnd={
            getVaccinationInterval(age, patientInfos.date_of_birth, name)
              .rangeEnd
          }
          datas={datas}
          fetchRecord={fetchRecord}
          editable={editable}
          setEditable={setEditable}
          setErrMsgPost={setErrMsgPost}
        />
      ) : //double dose
      dose === "double" ? (
        <VaccineCellItemDouble
          age={age}
          name={name}
          type={type}
          vaccineInfos={vaccineInfos}
          patientInfos={patientInfos}
          datas={datas}
          fetchRecord={fetchRecord}
          editable={editable}
          setEditable={setEditable}
          setErrMsgPost={setErrMsgPost}
        />
      ) : (
        <VaccineCellItemMultiple
          age={age}
          name={name}
          type={type}
          vaccineInfos={vaccineInfos}
          patientInfos={patientInfos}
          datas={datas}
          fetchRecord={fetchRecord}
          editable={editable}
          setEditable={setEditable}
          setErrMsgPost={setErrMsgPost}
        />
      )}
    </td>
  ) : (
    <td className="vaccines-item-empty"></td> //not for this age
  );
};
export default VaccineCell;
