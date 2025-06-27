import React, { useEffect, useState } from "react"; 
import { EyeIcon, EyeOffIcon, CustomEye, CustomEyeOff } from "../components/icons";
import { Check } from "lucide-react";
import { GmailLogo } from "../components/icons"; 
import { OutlookLogo } from "../components/icons";
import 'uuid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import BASE_URL from "../../config";

export function SignupPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();
  // Password validation states
  const [hasLowercase, setHasLowercase] = useState(false)
  const [hasUppercase, setHasUppercase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecial, setHasSpecial] = useState(false)
  const [hasMinLength, setHasMinLength] = useState(false)
  
  // Validate email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(email))
  }, [email])

  // Validate phone
  useEffect(() => {
    const phoneRegex = /^\d{10}$/
    setIsPhoneValid(phoneRegex.test(phone))
  }, [phone])

  // Validate password
  useEffect(() => {
    setHasLowercase(/[a-z]/.test(password))
    setHasUppercase(/[A-Z]/.test(password))
    setHasNumber(/[0-9]/.test(password))
    setHasSpecial(/[!@#$%^&*(),.?":{}|<>]/.test(password))
    setHasMinLength(password.length >= 8)
  }, [password])

  // Check if all form fields are valid
  const isFormValid = () => {
    return isEmailValid && isPhoneValid && hasLowercase && hasUppercase && hasNumber && hasSpecial && hasMinLength
  }
  // Handle form submission
  const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const validatePhone = (phone) => {
  // Checks if phone is exactly 10 digits (only numbers)
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};
const isPasswordValid = (password) => {
  // Example: Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  return passwordRegex.test(password);
};
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validateEmail(email)) {
    setError("Please enter a valid email.");
    return;
  }
  if (!validatePhone(phone)) {
    setError("Please enter a valid 10-digit phone number.");
    return;
  }
  if (!isPasswordValid(password)) {
    setError(
      "Password must be 8+ characters, with uppercase, lowercase, number, and special character."
    );
    return;
  }

  setIsLoading(true);

  try {
    // Signup API call
    const signupResponse = await fetch(
      `${BASE_URL}/signup/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phone, password }),
      }
    );

    const signupData = await signupResponse.json();

    if (!signupResponse.ok) {
      let backendError = signupData.detail || JSON.stringify(signupData);
      setError(`Signup failed: ${backendError}`);
    }else {
        setIsSubmitted(true);
      }
    }
  catch (err) {
    setError("Network error: " + err.message);
  } finally {
    setIsLoading(false);
  }
};
  // Reset form and go back to signup
  const handleResetForm = () => {
    setIsSubmitted(false)
    setEmail('');
    navigate("/signup");
  }

  // Get email provider domain
  const getEmailProvider = () => {
    if (!email) return null
    const domain = email.split("@")[1]?.toLowerCase()

    if (domain?.includes("gmail")) return "gmail"
    if (domain?.includes("outlook") || domain?.includes("hotmail") || domain?.includes("live")) return "outlook"
    return null
  }

  // Get appropriate email link based on provider
  const getEmailLink = () => {
    const provider = getEmailProvider()

    if (provider === "gmail") {
      return "https://mail.google.com/mail/u/0/#search/from%3AGA+TEST"
    } else if (provider === "outlook") {
      return "https://outlook.live.com/mail/0/inbox"
    }

    // Default links if we can't determine the provider
    return {
      gmail: "https://mail.google.com",
      outlook: "https://outlook.live.com/mail/0/inbox",
    }
  }

  // Email verification page
    const emailLinks = getEmailLink()

return (
  <div className="h-screen flex flex-col md:flex-row overflow-hidden">
     <div key={location.key} className="h-screen flex flex-col md:flex-row overflow-hidden"></div>
    { isSubmitted ? (
      <>
        {/* Left Panel (Email Sent) */}
        <div className="w-full md:w-1/3 bg-teal-700 text-white flex flex-col justify-center items-start px-6 relative overflow-hidden h-screen">
          {/* Background dots pattern */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="grid grid-cols-4 gap-8 p-4">
              {Array(16).fill(0).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-teal-600 opacity-40" />
              ))}
            </div>
          </div>

          {/* Right side dots pattern */}
          <div className="absolute top-0 right-0">
            <div className="grid grid-cols-3 gap-3 p-2">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-teal-600 opacity-40" />
              ))}
            </div>
          </div>

          <div className="bg-white px-6 py-4 rounded-full mb-10 ml-2 z-10 flex items-center">
            <span className="text-gray-400 font-medium tracking-wider ml-2 text-2xl" style={{ color: "teal" }}>GA TEST</span>
          </div>
          <h1 className="text-3xl font-bold leading-snug ml-2 z-10 w-full pr-4">
            Start your Screening journey with us!
          </h1>
        </div>

        {/* Right Panel - Email Verification */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center p-6 h-screen overflow-hidden">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold mb-1">Check your email</h2>
            <p className="text-gray-600 mb-8">
              We've sent an email to: <span className="font-medium">{email || "Venturecapitals@gmail.com"}</span> with a link to activate your account
            </p>

            <div className="flex items-center space-x-6 mb-32">
              <div className="flex items-center">
                <GmailLogo />
                <a
                  href={typeof emailLinks === "object" ? emailLinks.gmail : emailLinks}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 ml-2"
                >
                  Open Gmail
                </a>
              </div>
              <div className="flex items-center">
                <OutlookLogo />
                <a
                  href={typeof emailLinks === "object" ? emailLinks.outlook : "https://outlook.live.com/mail/0/inbox"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 ml-2"
                >
                  Open Outlook
                </a>
              </div>
            </div>
<div>
  <p className="font-medium mb-2">Didn't get an email? Check your spam folder!</p>
  <Link
  to="/signup"
  onClick={handleResetForm}
  className="text-teal-700 hover:underline"
>
  Re-enter your email and try again
</Link>
</div>
          </div>
        </div>
      </>
    ) : (
      <>
        {/* Left Panel (Signup) */}
        <div className="w-full md:w-1/3 bg-teal-700 text-white flex flex-col justify-center items-start px-6 relative overflow-hidden h-screen">
          <div className="absolute bottom-0 left-0 right-0">
            <div className="grid grid-cols-4 gap-8 p-4">
              {Array(16).fill(0).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-teal-600 opacity-40" />
              ))}
            </div>
          </div>

          <div className="absolute top-0 right-0">
            <div className="grid grid-cols-3 gap-3 p-2">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-teal-600 opacity-40" />
              ))}
            </div>
          </div>

          <div className="bg-white px-6 py-4 rounded-full mb-10 ml-2 z-10 flex items-center">
            <span className="text-teal-700 text-2xl font-medium tracking-wider ml-2">GA TEST</span>
          </div>
          <h1 className="text-3xl font-bold leading-snug ml-2 z-10 w-full pr-4">
            Start your Screening journey with us!
          </h1>
        </div>

        {/* Right Panel (Signup Form) */}
        <div className="w-full md:w-2/3 bg-gray-100 flex items-center justify-center px-6 h-screen overflow-hidden">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign up with free trial</h2>
              <p className="text-gray-600 text-sm">
                Empower your experience, sign up for a free account today
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <label className="block mb-1 font-medium text-left text-gray-600" htmlFor="email">
                Work Email<span className="text-red-600">*</span>
              </label>
              <div className="relative mb-6">
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border rounded bg-white text-black placeholder-gray-400"
                  placeholder="ex. email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {isEmailValid && email && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                    <Check />
                  </span>
                )}
              </div>

              {/* Phone */}
              <label className="block mb-2 font-medium text-gray-600" htmlFor="phone">
                Phone Number<span className="text-red-600">*</span>
              </label>
              <div className="flex mb-6">
                <select className="w-20 border rounded-l p-2 bg-blue-100">
                  <option>+91</option>
                </select>
                <div className="relative w-full">
                  <input
                    id="phone"
                    type="text"
                    className="w-full p-2 border rounded bg-white text-black placeholder-gray-400"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  {isPhoneValid && phone && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                      <Check />
                    </span>
                  )}
                </div>
              </div>

              {/* Password */}
              <label className="block mb-2 font-medium text-gray-600" htmlFor="password">
                Password<span className="text-red-600">*</span>
              </label>
              <div className="relative mb-6">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 border rounded bg-white text-black placeholder-gray-400"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Password Rules */}
              <ul className="text-sm space-y-1 mb-3">
                <li className={hasLowercase ? "text-green-600" : "text-red-600"}>
                  {hasLowercase ? "✅" : "❌"} One lowercase character
                </li>
                <li className={hasUppercase ? "text-green-600" : "text-red-600"}>
                  {hasUppercase ? "✅" : "❌"} One uppercase character
                </li>
                <li className={hasNumber ? "text-green-600" : "text-red-600"}>
                  {hasNumber ? "✅" : "❌"} One number
                </li>
                <li className={hasSpecial ? "text-green-600" : "text-red-600"}>
                  {hasSpecial ? "✅" : "❌"} One special character
                </li>
                <li className={hasMinLength ? "text-green-600" : "text-red-600"}>
                  {hasMinLength ? "✅" : "❌"} 8 characters minimum
                </li>
              </ul>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              {/* Consent */}
              <p className="text-xs text-gray-600 mb-4">
                By registering for an account, you are consenting to our{" "}
                <a href="#" className="text-teal-700 underline">Terms of Service</a> and{" "}
                <a href="#" className="text-teal-700 underline">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                className="w-full bg-teal-700 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors"
              >
                Sign Up
              </button>
            </form>
             <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login
          </Link>
        </p>
          </div>
        </div>
      </>
    )}
  </div>
);
}
export default SignupPage;