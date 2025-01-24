import React, { createContext, useState, useContext } from "react";

// Create Context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the app with context
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  const login = (email, token, role) => {
    setAuthData({ email, token, role });
    localStorage.setItem("authData", JSON.stringify({ email, token, role }));
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
  };

  // On page load, check if user is already logged in (if data exists in localStorage)
  React.useEffect(() => {
    const savedAuthData = localStorage.getItem("authData");
    if (savedAuthData) {
      setAuthData(JSON.parse(savedAuthData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
