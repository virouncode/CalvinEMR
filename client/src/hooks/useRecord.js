import { useEffect } from "react";
import axios from "../api/xano";
import useAuth from "./useAuth";

export const useRecord = (
  tableName,
  patientId,
  setStateFunction,
  setFormDatas = null //for social history
) => {
  const { auth } = useAuth();
  useEffect(() => {
    const abortController = new AbortController();
    const fetchRecord = async () => {
      try {
        const response = await axios.get(
          `${tableName}?patient_id=${patientId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        setStateFunction(response.data);
        if (setFormDatas) {
          setFormDatas(response.data[0]);
        }
      } catch (err) {
        //don't do anything here because the error will come from destructuring undefined object after aborting
      }
    };
    fetchRecord();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, patientId, setFormDatas, setStateFunction, tableName]);
};
