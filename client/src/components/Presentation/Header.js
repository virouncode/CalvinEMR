import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { user, setUser, setAuth, setClinic } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({});
    setUser({});
    setClinic({});
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("clinic");
    localStorage.removeItem("tabCounter");
    localStorage.setItem("message", "logout");
    localStorage.removeItem("message");
  };
  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate("/")}></div>
      <nav className="header__nav">
        <ul>
          <li>
            <NavLink
              to="/"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="search-patient"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Patients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="signup-patient"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              New Patient
            </NavLink>
          </li>
          <li>
            <NavLink
              to="signup-staff"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              New Staff Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="doc-inbox"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Inbox
            </NavLink>
          </li>
          <li>
            <NavLink
              to="messages"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              {"Messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="reference"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Reference
            </NavLink>
          </li>
          <li>
            <NavLink
              to="calvinai"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              CalvinAI
            </NavLink>
          </li>
          <li>
            <NavLink
              to="billing"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Billing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="my-account"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              My Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="login"
              onClick={handleLogout}
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Log out
            </NavLink>
          </li>
        </ul>
      </nav>
      <h1 className="header__title">Electronic Medical Records</h1>
    </header>
  );
};

export default Header;
