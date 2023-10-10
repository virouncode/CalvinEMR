//Librairies
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PatientHeader = () => {
  const { user, setUser, setAuth, setClinic } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({});
    setUser({});
    setClinic({});
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("clinic");
    localStorage.setItem("message", "logout");
    localStorage.removeItem("message");
  };
  return (
    <header className="header header--patient">
      <div className="logo" onClick={() => navigate("/patient/messages")}></div>
      <nav className="navigation navigation--patient">
        <ul>
          <li>
            <NavLink
              to="patient/messages"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              {"Messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="patient/appointments"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="patient/my-account"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              My Account
            </NavLink>
          </li>
          <li>
            <NavLink to="login" onClick={handleLogout}>
              Log out
            </NavLink>
          </li>
        </ul>
      </nav>
      <h1>Electronic Medical Records</h1>
    </header>
  );
};

export default PatientHeader;
