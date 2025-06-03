// src/Test_creation/contexts/AuthContext.jsx
"use client"
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [authTokens, setAuthTokens] = useState(() =>
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("authTokens")) : null
  );
  const [user, setUser] = useState(() =>
    typeof window !== "undefined" && authTokens ? jwtDecode(authTokens.access) : null
  );

const signupUser = async (email, phone, password) => {
  try {
    await axios.post("http://127.0.0.1:8000/api/signup/", {
      email,
      phone_number: phone,
      password,
    });

    alert("Signup successful! Please check your email to activate your account.");

    router.push("/login");
  } catch (error) {
    console.error("Signup failed:", error);
    alert("Signup failed. Please check your input.");
  }
};
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    router.push("/signup");
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, signupUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
