import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosXano from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toLocalDate } from "../../utils/formatDates";
import { onMessageBilling } from "../../utils/socketHandlers/onMessageBilling";
import BillingFilter from "./BillingFilter";
import BillingForm from "./BillingForm";
import BillingTable from "./BillingTable";

const Billing = () => {
  const { user, auth, socket } = useAuth();
  const [addVisible, setAddVisible] = useState(false);
  const [billings, setBillings] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [filterDatas, setFilterDatas] = useState({
    date_start: toLocalDate(
      Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    ),
    date_end: toLocalDate(
      Date.parse(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      )
    ),
  });

  const handleAdd = () => {
    setAddVisible(true);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchBillings = async () => {
      try {
        let response;
        if (user.title !== "Secretary") {
          response = await axiosXano.get(
            `/billings_for_staff?staff_id=${user.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          );
        } else {
          response = await axiosXano.get(`/billings`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          });
        }
        if (abortController.signal.aborted) return;
        setBillings(
          response.data.sort((a, b) => b.date_created - a.date_created)
        );
      } catch (err) {
        toast.error(`Unable to fetch billings: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchBillings();
    return () => abortController.abort();
  }, [auth.authToken, user.id, user.title]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageBilling(
        message,
        billings,
        setBillings,
        user.id,
        user.title === "Secretary"
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [socket, user.id, user.title, billings]);

  return (
    <div className="billing-table">
      {errMsg && <p className="billing-table-err">{errMsg}</p>}
      <div className="billing-table-btn-container">
        {user.title !== "Secretary" && (
          <button onClick={handleAdd} disabled={addVisible}>
            Add Billing
          </button>
        )}
      </div>
      {addVisible && (
        <BillingForm
          setAddVisible={setAddVisible}
          setBillings={setBillings}
          setErrMsg={setErrMsg}
        />
      )}
      {billings ? (
        <>
          <BillingFilter
            filterDatas={filterDatas}
            setFilterDatas={setFilterDatas}
          />
          <BillingTable
            billings={billings}
            setBillings={setBillings}
            setErrMsg={setErrMsg}
            filterDatas={filterDatas}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Billing;
