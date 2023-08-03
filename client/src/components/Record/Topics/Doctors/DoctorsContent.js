//Librairies
//Librairies
import React from "react";
import { useRecord } from "../../../../hooks/useRecord";

const DoctorsContent = ({ patientId, datas, setDatas }) => {
  useRecord("/family_doctors", patientId, setDatas);
  return (
    datas && (
      <div className="patient-doctors-content">
        {datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((doctor) => (
                <li key={doctor.id}>
                  - <strong>{doctor.name}</strong>, {doctor.speciality},{" "}
                  {doctor.city}, {doctor.phone}
                </li>
              ))}
          </ul>
        ) : (
          "No family doctors/specialists"
        )}
      </div>
    )
  );
};

export default DoctorsContent;
