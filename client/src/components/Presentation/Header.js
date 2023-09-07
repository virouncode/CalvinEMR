//Librairies
import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Header = () => {
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
              to="/"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="search-patient"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              Patients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="signup-patient"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              New Patient
            </NavLink>
          </li>
          <li>
            <NavLink
              to="signup-staff"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              New Staff Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="results"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              Results
            </NavLink>
          </li>
          <li>
            <NavLink
              to="messages"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              {"Messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="reference"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              Reference
            </NavLink>
          </li>
          <li>
            <NavLink
              to="my-account"
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

export default Header;
