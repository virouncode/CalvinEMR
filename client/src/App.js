//Librairies
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import RequireAuth from "./components/Presentation/RequireAuth";
//Pages Components
import Layout from "./components/Presentation/Layout";
import Layout2 from "./components/Presentation/Layout2";
import Layout3 from "./components/Presentation/Layout3";
import RequireAuthPatient from "./components/Presentation/RequireAuthPatient";
import useAuth from "./hooks/useAuth";
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
import ResetPage from "./pages/ResetPage";
import SearchPatientPage from "./pages/SearchPatientPage";
import SignupPagePatient from "./pages/SignupPagePatient";
import SignupPageStaff from "./pages/SignupPageStaff";
import UnauthorizedPage from "./pages/UnauthorizedPage";

const App = () => {
  const navigate = useNavigate();
  const { setUser, setClinic, setAuth } = useAuth();
  useEffect(() => {
    const storageListener = (e) => {
      if (e.key !== "message") return;
      const message = e.newValue;
      if (!message) return;
      if (message === "logout") {
        setUser({});
        setClinic({});
        setAuth({});
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
  }, [navigate, setAuth, setClinic, setUser]);

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
          <Route path="signup-patient" element={<SignupPagePatient />} />
          <Route path="my-account" element={<MyAccountPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="doc-inbox" element={<DocMailboxPage />} />
          <Route
            path="messages/:messageId/:sectionName/:msgType"
            element={<MessagesPage />}
          />
          <Route path="credentials" element={<CredentialsPage />} />
          <Route path="calvinai" element={<CalvinAIPage />} />
        </Route>
        <Route element={<RequireAuth allowedAccesses={["Admin"]} />}>
          <Route path="signup-staff" element={<SignupPageStaff />} />
        </Route>
      </Route>
      <Route path="/" element={<Layout3 />}>
        {/* public routes */}
        <Route path="patient/unauthorized" element={<UnauthorizedPage />} />
        {/* protected routes */}
        <Route element={<RequireAuthPatient allowedAccesses={["Patient"]} />}>
          <Route path="patient/messages" element={<PatientMessagesPage />} />
          <Route path="patient/my-account" element={<PatientAccountPage />} />
          <Route
            path="patient/appointments"
            element={<PatientAppointmentsPage />}
          />
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
