import { useState, useEffect } from "react";
import { parseToEvents } from "../utils/parseToEvents";
import axios from "../api/xano";

export const useAxiosEvents = () => {
  const [events, setEvents] = useState(null);
  const [remainingStaff, setRemainingStaff] = useState([]);
  const [errorEvents, setErrorEvents] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [controller, setController] = useState(null);

  const axiosFetchEvents = async (
    hostsIds,
    rangeStart,
    rangeEnd,
    authToken,
    staffInfos,
    isSecretary,
    userId
  ) => {
    try {
      setLoadingEvents(true);
      const ctrl = new AbortController();
      setController(ctrl);
      const res = await axios.post(
        "/staff_appointments",
        {
          hosts_ids: hostsIds,
          range_start: rangeStart,
          range_end: rangeEnd,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          signal: ctrl.signal,
        }
      );
      const formattedEvents = parseToEvents(
        res.data,
        staffInfos,
        isSecretary,
        userId
      );
      setEvents(formattedEvents[0]);
      setRemainingStaff(formattedEvents[1]);
    } catch (err) {
      console.log(err.message);
      setErrorEvents(err.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    return () => controller && controller.abort(); //when the components using the hook unmounts we cancel the request
  }, [controller]);

  return [
    events,
    setEvents,
    remainingStaff,
    setRemainingStaff,
    errorEvents,
    loadingEvents,
    axiosFetchEvents,
  ]; //returns the states and the axiosFetch function
};
