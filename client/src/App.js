//Librairies
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Layout from "./components/Presentation/Layout";
import Layout2 from "./components/Presentation/Layout2";
import Layout3 from "./components/Presentation/Layout3";
import RequireAuth from "./components/Presentation/RequireAuth";
import RequireAuthPatient from "./components/Presentation/RequireAuthPatient";
import useAuth from "./hooks/useAuth";
import BillingPage from "./pages/BillingPage";
import CalendarPage from "./pages/CalendarPage";
import CalvinAIPage from "./pages/CalvinAIPage";
import CredentialsPage from "./pages/CredentialsPage";
import DocMailboxPage from "./pages/DocMailboxPage";
import LoginPage from "./pages/LoginPage";
import MessagesPage from "./pages/MessagesPage";
import MissingPage from "./pages/MissingPage";
import MyAccountPage from "./pages/MyAccountPage";
import PatientAccountPage from "./pages/PatientAccountPage";
import PatientAppointmentsPage from "./pages/PatientAppointmentsPage";
import PatientCredentialsPage from "./pages/PatientCredentialsPage";
import PatientMessagesPage from "./pages/PatientMessagesPage";
import PatientRecordPage from "./pages/PatientRecordPage";
import ReferencePage from "./pages/ReferencePage";
import ResetPage from "./pages/ResetPage";
import SearchPatientPage from "./pages/SearchPatientPage";
import SignupPatientPage from "./pages/SignupPatientPage";
import SignupStaffPage from "./pages/SignupStaffPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
// const socket = io("https://fierce-retreat-45158-56541fefe81e.herokuapp.com");

const App = () => {
  const navigate = useNavigate();
  const { setUser, setClinic, setAuth, setSocket } = useAuth();
  useEffect(() => {
    const storageListener = (e) => {
      if (e.key !== "message") return;
      const message = e.newValue;
      if (!message) return;
      if (message === "logout") {
        setUser({});
        setClinic({});
        setAuth({});
        setSocket({});
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
        localStorage.removeItem("clinic");
        navigate("/");
      }
    };
    window.addEventListener("storage", storageListener);
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, [navigate, setAuth, setClinic, setSocket, setUser]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:3000");
    setSocket(socket);
    return () => socket.disconnect();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout2 />}>
        {/* public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="reset-password" element={<ResetPage />}></Route>
        {/* catch all */}
        <Route path="*" element={<MissingPage />} />
      </Route>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        {/* protected routes */}
        <Route element={<RequireAuth allowedAccesses={["Admin", "User"]} />}>
          <Route index element={<CalendarPage />} />
          <Route path="search-patient" element={<SearchPatientPage />} />
          <Route path="patient-record/:id" element={<PatientRecordPage />} />
          <Route path="signup-patient" element={<SignupPatientPage />} />
          <Route path="doc-inbox" element={<DocMailboxPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route
            path="messages/:messageId/:sectionName/:msgType"
            element={<MessagesPage />}
          />
          <Route path="reference" element={<ReferencePage />} />
          <Route path="calvinai" element={<CalvinAIPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="my-account" element={<MyAccountPage />} />
          <Route path="credentials" element={<CredentialsPage />} />
        </Route>
        <Route element={<RequireAuth allowedAccesses={["Admin"]} />}>
          <Route path="signup-staff" element={<SignupStaffPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Layout3 />}>
        {/* protected routes */}
        <Route element={<RequireAuthPatient allowedAccesses={["Patient"]} />}>
          <Route path="patient/messages" element={<PatientMessagesPage />} />
          <Route
            path="patient/appointments"
            element={<PatientAppointmentsPage />}
          />
          <Route path="patient/my-account" element={<PatientAccountPage />} />
          <Route
            path="patient/credentials"
            element={<PatientCredentialsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
