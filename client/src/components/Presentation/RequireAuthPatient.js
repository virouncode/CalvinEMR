import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuthPatient = ({ allowedAccesses }) => {
  const { auth, user } = useAuth();
  const location = useLocation();

  return allowedAccesses.includes(user.accessLevel) ? (
    <Outlet />
  ) : auth?.email ? (
    <Navigate to="/patient/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuthPatient;
