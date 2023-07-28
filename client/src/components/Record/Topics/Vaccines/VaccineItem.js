import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import VaccineCell from "./VaccineCell";

const VaccineItem = ({
  vaccineId,
  item,
  dose,
  ages,
  name,
  type,
  description,
  datas,
  setDatas,
  patientInfos,
  editable,
  setEditable,
  setFormVisible,
  setScrollPosition,
  setAlertVisible,
}) => {
  //HOOKS
  const { auth } = useAuth();
  const [itemInfos, setItemInfos] = useState(item);

  return (
    <tr className="vaccines-item">
      <td>
        <div>
          <strong>{name}</strong>
        </div>
        <span style={{ fontSize: "0.7rem" }}>{description}</span>
      </td>
      {vaccineId !== 16 //not a pregnancy vaccine
        ? vaccineId !== 17 //not Influenza vaccine
          ? ages.map((age) => (
              <VaccineCell
                key={age}
                age={age}
                name={name}
                type={type}
                dose={dose}
                vaccineId={vaccineId}
                vaccineInfos={item.hasOwnProperty(`${age}`) ? item[age] : null}
                patientInfos={patientInfos}
                editable={editable}
                setEditable={setEditable}
                setFormVisible={setFormVisible}
                setScrollPosition={setScrollPosition}
                datas={datas}
                setDatas={setDatas}
                setAlertVisible={setAlertVisible}
              />
            ))
          : ages //Influenza vaccine
              .slice(0, ages.indexOf("6_months") + 1)
              .map((age) => (
                <VaccineCell
                  key={age}
                  age={age}
                  name={name}
                  type={type}
                  vaccineId={vaccineId}
                  dose={dose}
                  vaccineInfos={
                    item.hasOwnProperty(`${age}`) ? item[age] : null
                  }
                  patientInfos={patientInfos}
                  editable={editable}
                  setEditable={setEditable}
                  setFormVisible={setFormVisible}
                  setScrollPosition={setScrollPosition}
                  datas={datas}
                  setDatas={setDatas}
                  setAlertVisible={setAlertVisible}
                />
              ))
        : ages //pregnancy vaccine
            .slice(0, ages.indexOf("grade_7") + 1)
            .map((age) => (
              <VaccineCell
                key={age}
                age={age}
                name={name}
                type={type}
                vaccineId={vaccineId}
                dose={dose}
                vaccineInfos={item.hasOwnProperty(`${age}`) ? item[age] : null}
                patientInfos={patientInfos}
                editable={editable}
                setEditable={setEditable}
                setFormVisible={setFormVisible}
                setScrollPosition={setScrollPosition}
                datas={datas}
                setDatas={setDatas}
                setAlertVisible={setAlertVisible}
              />
            ))}
    </tr>
  );
};

export default VaccineItem;
