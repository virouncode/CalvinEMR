//Librairies
import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PatientHeader = () => {
  const { user, setUser, setAuth, setClinic } = useAuth();
  const handleLogout = () => {
    setAuth({});
    setUser({});
    setClinic({});
  };
  return (
    <header className="header">
      <div className="logo"></div>
      <nav className="navigation">
        <ul>
          <li>
            <NavLink
              to="patient"
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
