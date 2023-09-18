//Librairies
import React, { useEffect } from "react";
import RequireAuth from "./components/Presentation/RequireAuth";
import { Routes, Route, useNavigate } from "react-router-dom";
//Pages Components
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
import SearchPatientPage from "./pages/SearchPatientPage";
import PatientRecordPage from "./pages/PatientRecordPage";
import Layout from "./components/Presentation/Layout";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MissingPage from "./pages/MissingPage";
import Layout2 from "./components/Presentation/Layout2";
import SignupPageStaff from "./pages/SignupPageStaff";
import SignupPagePatient from "./pages/SignupPagePatient";
import MyAccountPage from "./pages/MyAccountPage";
import MessagesPage from "./pages/MessagesPage";
import CredentialsPage from "./pages/CredentialsPage";
import Layout3 from "./components/Presentation/Layout3";
import PatientMessagesPage from "./pages/PatientMessagesPage";
import PatientAccountPage from "./pages/PatientAccountPage";
import PatientAppointmentsPage from "./pages/PatientAppointmentsPage";
import RequireAuthPatient from "./components/Presentation/RequireAuthPatient";
import PatientCredentialsPage from "./pages/PatientCredentialsPage";
import useAuth from "./hooks/useAuth";

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
          <Route
            path="messages/:messageId/:sectionName/:msgType"
            element={<MessagesPage />}
          />
          <Route path="credentials" element={<CredentialsPage />} />
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
