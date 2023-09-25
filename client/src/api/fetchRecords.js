import axiosXano from "../api/xano";
import axiosXanoPatient from "../api/xanoPatient";

export const getPatientRecord = async (
  tableName,
  patientId,
  authToken,
  abortController = null
) => {
  try {
    const response = await axiosXano.get(
      `${tableName}?patient_id=${patientId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        ...(abortController && { signal: abortController.signal }),
      }
    );
    return response?.data;
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const putPatientRecord = async (
  tableName,
  recordId,
  authId,
  authToken,
  datas,
  abortController = null
) => {
  if (
    tableName === "/patients" ||
    (tableName === "/progress_notes" && datas.version_nbr !== 1)
  ) {
    datas.updated_by_id = authId;
    datas.date_updated = Date.now();
  } else if (tableName === "/vaccines") {
  } else {
    datas.created_by_id = authId;
    datas.date_created = Date.now();
  }
  try {
    return await axiosXano.put(`${tableName}/${recordId}`, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const postPatientRecord = async (
  tableName,
  authId,
  authToken,
  datas,
  abortController = null
) => {
  if (tableName !== "/progress_notes_log") {
    //if it's the log we don't want to change the date of creation, for attachments this is assured by the bulk add
    datas.created_by_id = authId;
    datas.date_created = Date.now();
  }

  try {
    return await axiosXano.post(tableName, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const postPatientRecordPatient = async (
  tableName,
  authId,
  authToken,
  datas,
  abortController = null
) => {
  if (tableName !== "/progress_notes_log") {
    //if it's the log we don't want to change the date of creation, for attachments this is assured by the bulk add
    datas.created_by_id = authId;
    datas.date_created = Date.now();
  }

  try {
    return await axiosXanoPatient.post(tableName, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const deletePatientRecord = async (
  tableName,
  recordId,
  authToken,
  abortController = null
) => {
  try {
    return await axiosXano.delete(`${tableName}/${recordId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};
