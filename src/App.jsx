import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
/*import { jwtDecode } from "jwt-decode";*/
import SignupPage from "./Test_creation/pages/signup";
import VerifyEmail from "./Test_creation/pages/VerifyEmail";
import LoginPage from "./Test_creation/pages/login";
import JobImportForm from "./Test_creation/pages/importform";
import InterviewDashboard from "./Test_creation/pages/dashboard";
import PrivateRoute from "./Test_creation/components/PrivateRoute";

/*const getStoredTokens = () => {
  const localTokens = localStorage.getItem("authTokens");
  const sessionTokens = sessionStorage.getItem("authTokens");

  return JSON.parse(localTokens || sessionTokens || null);
};

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Run this only once when the app loads
  useEffect(() => {
    const tokens = getStoredTokens();

    if (tokens?.access && isTokenValid(tokens.access)) {
      setIsAuthenticated(true);

      const isRemembered = !!localStorage.getItem("authTokens");
      const isOnPublicRoute = ["/", "/login", "/signup", "/verify-email"].some(
        (path) => location.pathname.startsWith(path)
      );

      if (isRemembered && isOnPublicRoute) {
        navigate("/dashboard", { replace: true });
      }
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("authTokens");
      sessionStorage.removeItem("authTokens");
    }

    setLoading(false);
  }, []); // ✅ Only run once

  // ✅ Optional: Prevent blink with a basic loading screen (or return null if you prefer)
  if (loading) return <div className="text-center p-10">Loading...</div>;*/
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email/:uuid" element={<VerifyEmail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <InterviewDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/importform"
        element={
          <PrivateRoute>
            <JobImportForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default App;
