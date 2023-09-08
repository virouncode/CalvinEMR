import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axiosXanoPatient from "../../../api/xanoPatient";
import { useNavigate } from "react-router-dom";

const CredentialsFormPatient = () => {
  const navigate = useNavigate();
  const { auth, user } = useAuth();
  const [credentials, setCredentials] = useState({
    email: auth.email,
    password: "",
    confirmPassword: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.confirmPassword !== credentials.password) {
      setErrMsg("Passwords don't match");
      return;
    }
    try {
      const patients = await axiosXanoPatient.get("/patients", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      if (
        patients.data
          .filter(({ id }) => id !== user.id)
          .find(
            ({ email }) =>
              email.toLowerCase() === credentials.email.toLowerCase()
          )
      ) {
        setErrMsg(
          "There is already an account with this email, please choose another one"
        );
        return;
      }
    } catch (err) {
      setErrMsg(`Error: unable to change credentials: ${err.message}`);
      return;
    }

    try {
      //get patientInfo
      const me = (
        await axiosXanoPatient.get(`/patients/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        })
      ).data;
      me.email = credentials.email;
      me.password = credentials.password;
      axiosXanoPatient.put(`/patients/${user.id}`, me, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setSuccessMsg("Credentials changed succesfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to change credentials: ${err.message}`);
      return;
    }
  };

  return successMsg ? (
    <div className="credentials-success">{successMsg}</div>
  ) : (
    <>
      <form className="credentials-form" onSubmit={handleSubmit}>
        <div className="credentials-form-row">
          <label htmlFor="email">New email</label>
          <input
            id="email"
            type="email"
            onChange={handleChange}
            name="email"
            value={credentials.email}
            autoComplete="false"
          />
        </div>
        <div className="credentials-form-row">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            onChange={handleChange}
            name="password"
            value={credentials.password}
            autoFocus
            autoComplete="false"
          />
        </div>
        <div className="credentials-form-row">
          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            onChange={handleChange}
            name="confirmPassword"
            value={credentials.confirmPassword}
            autoComplete="false"
          />
        </div>
        <div className="credentials-form-row-submit">
          <button type="submit">Submit</button>
        </div>
      </form>
      {errMsg && <div className="credentials-err">{errMsg}</div>}
    </>
  );
};

export default CredentialsFormPatient;
