//Librairies
import React from "react";
import RequireAuth from "./components/Presentation/RequireAuth";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
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
            path="messages/:messageId/:sectionName"
            element={<MessagesPage />}
          />
          <Route path="credentials" element={<CredentialsPage />} />
        </Route>
        <Route element={<RequireAuth allowedAccesses={["Admin"]} />}>
          <Route path="signup-staff" element={<SignupPageStaff />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
