// src/components/account-verification-complete.jsx
import { useState } from "react";
import { ArrowLeft, Check } from 'lucide-react';

export default function AccountVerificationComplete({ userData, onNext, onBack }) {
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, this would save the data to your backend
    setTimeout(() => {
      onNext({ industry, companySize, role });
      setIsLoading(false);
    }, 1000);
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
              <h2 className="text-xl font-semibold">Account set up</h2>
              <span className="text-lg font-medium">2/5</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full w-full">
              <div className="h-2 bg-[#1d968e] rounded-full w-2/5"></div>
            </div>
          </div>

          {/* Back button */}
          <button className="mb-8" onClick={onBack}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>

          {/* Email verification success */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Email verified successfully</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Tell us about your business</h1>
            <p className="text-gray-600 mb-8">This helps us customize your experience</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="industry" className="block mb-2 font-medium">
                  Industry
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  required
                >
                  <option value="" disabled>
                    Select your industry
                  </option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="companySize" className="block mb-2 font-medium">
                  Company size
                </label>
                <select
                  id="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  required
                >
                  <option value="" disabled>
                    Select company size
                  </option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>

              <div>
                <label htmlFor="role" className="block mb-2 font-medium">
                  Your role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  required
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="executive">Executive/C-Level</option>
                  <option value="manager">Manager</option>
                  <option value="individual">Individual Contributor</option>
                  <option value="consultant">Consultant</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mt-8">
              <button
                type="submit"
                className="bg-[#1d968e] text-white py-3 px-8 rounded-md font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Next"}
              </button>
              <button type="button" className="text-[#1d968e] font-medium">
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}