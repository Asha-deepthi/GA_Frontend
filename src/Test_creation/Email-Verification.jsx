// src/components/email-verification.jsx
import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function EmailVerification({ email, onVerificationComplete, onBack }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // In a real app, this would call your verification API
    // For demo purposes, we'll simulate a successful verification after a delay
    setTimeout(() => {
      // Check if code is valid (this is just for demo - any 6 digit code works)
      if (verificationCode.length === 6) {
        onVerificationComplete();
      } else {
        setError("Invalid verification code. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    setCanResend(false);
    setCountdown(30);

    // In a real app, this would call your API to resend the code
    // For demo purposes, we'll just show a success message
    alert(`Verification code resent to ${email}`);
  };

  return (
    <>
      {/* Left sidebar */}
      <div className="bg-[#1d968e] flex flex-col justify-center items-start p-8 md:p-16 md:w-1/2 relative overflow-hidden">
        <div className="relative z-10">
          <div className="bg-white rounded-full py-4 px-6 inline-flex items-center mb-12">
            <span className="text-[#1d968e] mr-2 text-2xl">*</span>
            <span className="text-gray-400 text-2xl font-bold tracking-wider">GA TEST</span>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
            Start your Screening journey with us!
          </h1>
        </div>

        {/* Decorative dots pattern */}
        <div className="absolute top-0 right-0 p-4 grid grid-cols-4 gap-4 opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-white"></div>
          ))}
        </div>

        {/* Bottom dots pattern */}
        <div className="absolute bottom-0 left-0 p-8 grid grid-cols-4 gap-6 opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-white"></div>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="bg-white p-8 md:p-16 flex flex-col md:w-1/2">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Email verification</h2>
            </div>
          </div>

          {/* Back button */}
          <button className="mb-8" onClick={onBack}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>

          {/* Form */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Verify your email</h1>
            <p className="text-gray-600 mb-8">
              We've sent a verification code to <strong>{email}</strong>. Please enter the code below to verify your
              email address.
            </p>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">{error}</div>}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="code" className="block mb-2 font-medium">
                  Verification code
                </label>
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full p-3 border border-gray-300 rounded-md text-center text-2xl tracking-wider"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1d968e] text-white py-3 px-8 rounded-md font-medium flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          </div>

          {/* Resend code */}
          <div className="text-center">
            <p className="text-gray-600 mb-2">Didn't receive a code?</p>
            <button
              onClick={handleResendCode}
              className={`flex items-center justify-center mx-auto ${canResend ? "text-[#1d968e]" : "text-gray-400"} font-medium`}
              disabled={!canResend}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {canResend ? "Resend code" : `Resend code in ${countdown}s`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}