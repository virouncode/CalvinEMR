import axiosXano from "../api/xano";
import axiosXanoPatient from "../api/xanoPatient";
import { createChartNbr } from "../utils/createChartNbr";

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
  socket = null,
  topic = null,
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
    await axiosXano.put(`${tableName}/${recordId}`, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
    if (socket && topic) {
      socket.emit("message", {
        route: topic,
        action: "update",
        content: { id: recordId, data: datas },
      });
    }
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const postPatientRecord = async (
  tableName,
  authId,
  authToken,
  datas,
  socket = null,
  topic = null,
  abortController = null
) => {
  if (tableName !== "/progress_notes_log") {
    //if it's the log we don't want to change the date of creation, for attachments this is assured by the bulk add
    datas.created_by_id = authId;
    datas.date_created = Date.now();
  }

  try {
    const response = await axiosXano.post(tableName, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
    if (socket && topic) {
      if (topic === "PATIENTS") {
        datas.chart_nbr = createChartNbr(
          datas.date_of_birth,
          datas.gender_identification,
          response.data.id
        );
        socket.emit("message", {
          route: topic,
          action: "create",
          content: { data: { id: response.data.id, ...datas } },
        });
      } else {
        socket.emit("message", {
          route: topic,
          action: "create",
          content: { data: { id: response.data.id, ...datas } },
        });
      }
    }
    return response;
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
  socket,
  topic,
  abortController = null
) => {
  try {
    await axiosXano.delete(`${tableName}/${recordId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });

    socket.emit("message", {
      route: topic,
      action: "delete",
      content: { id: recordId },
    });
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

// message = { route: , content : { id : id du record }, action: “delete” }
// message = { route:  ,content : { id : id du record, data : datas à updater }, action: “update” }
// message = { route: ,content : { data : datas à crée }, action: “create” }
