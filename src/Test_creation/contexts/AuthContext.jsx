// src/Test_creation/contexts/AuthContext.jsx
"use client"
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();;
  // Load auth tokens from localStorage on client
  const [authTokens, setAuthTokens] = useState(() =>
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("authTokens")) : null
  );

  // Decode token to get user info including role
  const [user, setUser] = useState(() =>
    typeof window !== "undefined" && authTokens ? jwtDecode(authTokens.access) : null
  );

  // Refresh user state when tokens change
  useEffect(() => {
    if (authTokens) {
      try {
        const decoded = jwtDecode(authTokens.access);
        console.log("✅ Decoded User from JWT:", decoded);
        setUser(decoded);
      } catch (err) {
        console.error("Token decode error", err);
        logoutUser();
      }
    } else {
      setUser(null);
    }
  }, [authTokens]);

  // 🟢 SIGNUP — used by Admins currently
  const signupUser = async (email, phone, password) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/signup/", {
        email,
        phone_number: phone,
        password,
      });

      alert("Signup successful! Please check your email to activate your account.");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please check your input.");
    }
  };

  // 🔵 LOGIN — generic, for both admin and candidate
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      const tokens = res.data;
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      setAuthTokens(tokens);
      setUser(jwtDecode(tokens.access));

      // Redirect based on user role
      const decoded = jwtDecode(tokens.access);
      if (decoded.role === "admin") {
        navigate("/admin/dashboard");
      } else if (decoded.role === "candidate") {
        navigate("/candidate/tutorial");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials.");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login"); // Or "/signup" if you prefer
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // includes decoded role, name, id, etc.
        authTokens,
        signupUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);
export default AuthContext;
