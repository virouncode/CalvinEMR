//Librairies
import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { useLocation, useNavigate } from "react-router-dom";

const LOGIN_URL = "/auth/login";
const USERINFO_URL = "/auth/me";

const LoginForm = () => {
  const { setAuth, setClinic, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [type, setType] = useState("staff");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleChange = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "staff") {
      try {
        //=============== AUTH =================//
        const response = await axios.post(
          LOGIN_URL,
          JSON.stringify({ email, password }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const authToken = response?.data?.authToken;
        setAuth({ email, password, authToken });

        //================ USER ===================//
        const response2 = await axios.get(USERINFO_URL, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const accessLevel = response2?.data?.access_level;
        const id = response2?.data?.id;
        const name = response2?.data?.full_name;
        const title = response2?.data?.title;
        const sign = response2?.data?.sign;
        const licence_nbr = response2?.data?.licence_nbr;
        //Get user settings
        const response3 = await axios.get(`/settings?staff_id=${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const settings = response3?.data;
        // Get user unread messages
        const response6 = await axios.get(`/messages?staff_id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const unreadMessagesNbr = response6.data.length
          ? response6.data.reduce((accumulator, currentValue) => {
              if (
                !currentValue.read_by_ids.includes(id) &&
                currentValue.to_ids.includes(id)
              ) {
                return accumulator + 1;
              } else return accumulator;
            }, 0)
          : 0;

        setUser({
          accessLevel,
          id,
          name,
          title,
          sign,
          licence_nbr,
          settings,
          unreadMessagesNbr,
        });

        //================== CLINIC ===================//
        const response4 = await axios.get("/staff", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const staffInfos = response4.data;
        const response5 = await axios.get("/patients", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const patientsInfos = response5.data;
        setClinic({ staffInfos, patientsInfos });
        //=====================================//

        setEmail("");
        setPassword("");
        navigate(from, { replace: true });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("no server response");
        } else if (err.response?.response?.status === 400) {
          setErrMsg("missing email or password");
        } else if (err.response?.response?.status === 401) {
          setErrMsg("unhauthorized");
        } else {
          setErrMsg("login failed, please try again");
        }
        errRef.current.focus();
      }
    } else {
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <p className="login-title">Welcome to Alpha EMR</p>
        <p
          ref={errRef}
          className={errMsg ? "login-errmsg" : "login-offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-row-radio">
            <div className="login-form-row-radio-item">
              <input
                type="radio"
                id="staff"
                name="type"
                value="staff"
                checked={type === "staff"}
                onChange={handleChange}
              />
              <label htmlFor="staff">Staff</label>
            </div>
            <div className="login-form-row-radio-item">
              <input
                type="radio"
                id="patient"
                name="type"
                value="patient"
                checked={type === "patient"}
                onChange={handleChange}
              />
              <label htmlFor="patient">Patient</label>
            </div>
          </div>
          <div className="login-form-row">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="login-form-row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              autoComplete="off"
            />
          </div>
          <button>Sign In</button>
        </form>

        <p className="login-refresh">
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>
            I forgot my password
          </span>
        </p>
      </div>
    </div>
  );
};
export default LoginForm;
