"use client"

import { useState, useEffect } from "react"


const Eye = () => <span>👁</span>
const EyeOff = () => <span>👁‍🗨</span>
const Check = () => <span>✅</span>

function SignupPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic here
    console.log("Form submitted:", { email, phone, password })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 bg-teal-700 text-white flex flex-col justify-start items-start px-6 py-10">
        <div className="bg-white text-teal-700 px-4 py-2 rounded-full font-semibold mb-10 ml-2">* GA TEST</div>
        <h1 className="text-3xl font-bold leading-snug ml-2">
          Start your Screening
          <br />
          journey with us!
        </h1>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-2/3 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-1">Sign up with free trial</h2>
          <p className="text-gray-600 mb-6">Empower your experience, sign up for a free account today</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <label className="block mb-1 font-medium" htmlFor="email">
              Work email<span className="text-red-600">*</span>
            </label>
            <div className="relative mb-4">
              <input
                id="email"
                type="email"
                className={'w-full p-2 border rounded ${email ? "bg-blue-100" : ""}'}
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
            <label className="block mb-1 font-medium" htmlFor="phone">
              Phone number<span className="text-red-600">*</span>
            </label>
            <div className="flex mb-4">
              <select className="border rounded-l p-2 bg-blue-100">
                <option>+91</option>
              </select>
              <div className="relative w-full">
                <input
                  id="phone"
                  type="text"
                  className={'w-full p-2 border-t border-b border-r rounded-r ${phone ? "bg-blue-100" : ""}'}
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
            <label className="block mb-1 font-medium" htmlFor="password">
              Password<span className="text-red-600">*</span>
            </label>
            <div className="relative mb-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`w-full p-2 border rounded ${
                  password
                    ? hasLowercase && hasUppercase && hasNumber && hasSpecial && hasMinLength
                      ? "border-green-500"
                      : "border-red-500"
                    : ""
                }`}
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
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Password Conditions */}
            <ul className="text-sm space-y-1 mb-4">
              <li className={hasLowercase ? "text-green-600" : "text-red-600"}>
                {hasLowercase ? "✅" : "❌"} One lowercase character
              </li>
              <li className={hasUppercase ? "text-green-600" : "text-red-600"}>
                {hasUppercase ? "✅" : "❌"} One uppercase character
              </li>
              <li className={hasNumber ? "text-green-600" : "text-red-600"}>{hasNumber ? "✅" : "❌"} One number</li>
              <li className={hasSpecial ? "text-green-600" : "text-red-600"}>
                {hasSpecial ? "✅" : "❌"} One special character
              </li>
              <li className={hasMinLength ? "text-green-600" : "text-red-600"}>
                {hasMinLength ? "✅" : "❌"} 8 characters minimum
              </li>
            </ul>

            {/* Consent */}
            <p className="text-xs text-gray-600 mb-4">
              By registering for an account, you are consenting to our{" "}
              <a href="#" className="text-teal-700 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-teal-700 underline">
                Privacy Policy
              </a>
              .
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 px-4 rounded font-medium hover:bg-teal-800 transition-colors"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="#" className="text-teal-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage

