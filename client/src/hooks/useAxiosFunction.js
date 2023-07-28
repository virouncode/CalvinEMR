import { useState, useEffect } from "react";

export const useAxiosFunction = () => {
  const [response, setResponse] = useState(null);
  const [tempResponse, setTempResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState();

  const axiosFetch = async (configObj) => {
    const { axiosInstance, method, url, authToken, data = {} } = configObj;
    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);
      const res = await axiosInstance[method.toLowerCase()](url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        signal: ctrl.signal,
      });
      setResponse(res.data);
      setTempResponse(res.data);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => controller && controller.abort(); //when the components using the hook unmounts we cancel the request
  }, [controller]);

  return [
    response,
    setResponse,
    error,
    loading,
    axiosFetch,
    tempResponse,
    setTempResponse,
  ]; //returns the states and the axiosFetch function
};
