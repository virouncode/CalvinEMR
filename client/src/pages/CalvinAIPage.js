import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import axiosXano from "../api/xano";
import CalvinAIChat from "../components/CalvinAIChat/CalvinAIChat";
import StaffAIChatAgreement from "../components/CalvinAIChat/StaffAIChatAgreement";
import useAuth from "../hooks/useAuth";

const CalvinAIPage = () => {
  const { auth, user } = useAuth();
  const [start, setStart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const abortController = new AbortController();
    const fetchStaffInfos = async () => {
      try {
        const response = await axiosXano.get(`/staff/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        console.log(response.data.ai_consent);
        if (abortController.signal.aborted) return;
        setStart(response.data.ai_consent);
        setIsLoading(false);
      } catch (err) {
        toast.error(`Cant fetch staff ai consent: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchStaffInfos();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, user.id]);
  return (
    <section className="calvinai-section">
      <Helmet>
        <title>CalvinAI Chat</title>
      </Helmet>
      {isLoading ? (
        <CircularProgress />
      ) : start ? (
        <CalvinAIChat />
      ) : (
        <StaffAIChatAgreement setStart={setStart} />
      )}
    </section>
  );
};

export default CalvinAIPage;
