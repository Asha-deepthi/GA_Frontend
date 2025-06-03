/*frontend/src/Test_creation/components/PrivateRoute.jsx*/
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token =
    localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

/*import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children, isAuthenticated }) => {
  const localTokens = JSON.parse(localStorage.getItem("authTokens"));
  const sessionTokens = JSON.parse(sessionStorage.getItem("authTokens"));
  const token = localTokens?.access || sessionTokens?.access;

  if (token && isTokenValid(token) && isAuthenticated) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;*/
