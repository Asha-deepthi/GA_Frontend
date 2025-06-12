import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";// LoginPage.jsx (CORRECTED)
import { jwtDecode } from "jwt-decode"; // You'll need to `npm install jwt-decode
import loginimage from "../../assets/loginimage.jpg";

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "", // changed from email_or_phone
    password: "",
  });

/*const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login/", {
        identifier: formData.identifier,  // ✅ match backend key
        password: formData.password,
        remember_me: rememberMe,
      });
      alert('Login successful!');
      // ✅ Use sessionStorage or localStorage depending on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("access_token", res.data.access);
      storage.setItem("refresh_token", res.data.refresh);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };*/

   const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Your axios call is fine
      const res = await axios.post("http://localhost:8000/api/login/", { // Using your correct login URL
        identifier: formData.identifier,
        password: formData.password,
      });
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("access_token", res.data.access);
      storage.setItem("refresh_token", res.data.refresh);

      // --- NEW SMART REDIRECT LOGIC ---
      const decodedToken = jwtDecode(res.data.access);
      
      if (decodedToken.role === 'ADMIN') {
        navigate("/dashboard", { replace: true });
      } else { // User is a CANDIDATE
        const queryParams = new URLSearchParams(location.search);
        const testId = queryParams.get('testId');
        
        if (testId) {
          // A candidate followed an invitation link, send them to the welcome page
          navigate(`/welcome/${testId}`, { replace: true });
        } else {
          // A candidate is logging in directly, without an invitation link
          // You might create a generic dashboard for them later
          alert("Login successful. No specific test was linked.");
          navigate("/candidate-dashboard", { replace: true }); // Example future route
        }
      }

    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden bg-white">
        
        {/* Left Panel with Image */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <img
            src={loginimage} // Use the correctly imported variable
            alt="A person working on a laptop at an outdoor cafe"
            className="w-full h-full object-cover"
          />
          <p
            style={{ writingMode: 'vertical-lr' }}
            className="absolute top-4 left-4 text-xs text-white opacity-60 tracking-wider"
          >
            Copyrights © 2025gradproctoredtest
          </p>
        </div>

        {/* Right Panel with Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold mb-1 text-gray-800">Sign in to your account</h2>
            <p className="text-gray-600 mb-8">
              Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleLogin}>
              {/* Email or Phone */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Email or Phone<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter email or phone number"
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between mb-6 text-sm">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <a href="#" className="text-teal-600 hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-semibold text-base"
              >
                Sign In
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-teal-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;