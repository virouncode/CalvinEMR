import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [clinic, setClinic] = useState({});
  const [user, setUser] = useState({});
  return (
    <AuthContext.Provider
      value={{ auth, setAuth, user, setUser, clinic, setClinic }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
