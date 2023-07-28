import axios from "../api/xano";

export const getPatientRecord = async (tableName, patientId, authToken) => {
  try {
    const response = await axios.get(`${tableName}?patient_id=${patientId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response?.data;
  } catch (err) {}
};

export const putPatientRecord = async (
  tableName,
  recordId,
  authId,
  authToken,
  datas
) => {
  if (
    tableName === "/patients" ||
    (tableName === "/progress_notes" && datas.version_nbr !== 1)
  ) {
    datas.updated_by_id = authId;
    datas.date_updated = Date.parse(new Date());
  } else if (tableName === "/vaccines") {
  } else {
    datas.created_by_id = authId;
    datas.date_created = Date.parse(new Date());
  }
  try {
    return await axios.put(`${tableName}/${recordId}`, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (err) {}
};

export const postPatientRecord = async (
  tableName,
  authId,
  authToken,
  datas
) => {
  if (tableName !== "/progress_notes_log") {
    //if it's the log we don't want to change the date of creation, for attachments this is assured by the bulk add
    datas.created_by_id = authId;
    datas.date_created = Date.parse(new Date());
  }

  try {
    return await axios.post(tableName, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (err) {
    throw err;
  }
};

export const deletePatientRecord = async (tableName, recordId, authToken) => {
  try {
    return await axios.delete(`${tableName}/${recordId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (err) {}
};
