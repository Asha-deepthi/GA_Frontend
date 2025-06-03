import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-1/2 bg-teal-700 text-white flex flex-col justify-center items-center p-10">
        <div className="bg-white text-teal-700 font-semibold py-1 px-3 rounded-full mb-6">
          * GA TEST
        </div>
        <h1 className="text-3xl font-bold text-center">
          Welcome back to <br /> your Screening journey!
        </h1>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white flex items-center justify-start px-16">
        <div className="max-w-md w-full p-8 ml-auto">
          <h2 className="text-2xl font-bold mb-1">Sign in to your account</h2>
          <p className="text-gray-600 mb-6">Welcome back! Please enter your details</p>

          <form>
            {/* Email or Phone */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email or Phone<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter email or phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-teal-700 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-800 transition"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-teal-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
