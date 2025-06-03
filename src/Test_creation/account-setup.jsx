"use client"

import { useState } from "react"

// Teal asterisk component
const TealAsterisk = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 0C8.55228 0 9 0.447715 9 1V5.58579L12.2929 2.29289C12.6834 1.90237 13.3166 1.90237 13.7071 2.29289C14.0976 2.68342 14.0976 3.31658 13.7071 3.70711L10.4142 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H10.4142L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L9 10.4142V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V10.4142L3.70711 13.7071C3.31658 14.0976 2.68342 14.0976 2.29289 13.7071C1.90237 13.3166 1.90237 12.6834 2.29289 12.2929L5.58579 9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H5.58579L2.29289 3.70711C1.90237 3.31658 1.90237 2.68342 2.29289 2.29289C2.68342 1.90237 3.31658 1.90237 3.70711 2.29289L7 5.58579V1C7 0.447715 7.44772 0 8 0Z"
      fill="#0D9488"
    />
  </svg>
)

// Back arrow component
const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 19L8 12L15 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function AccountSetup() {
  const [firstName, setFirstName] = useState("Arjun")
  const [lastName, setLastName] = useState("Pation")
  const [businessName, setBusinessName] = useState("Digital Marketing")

  const handleNext = () => {
    console.log("Next clicked", { firstName, lastName, businessName })
    // Handle navigation to next step
  }

  const handleSkip = () => {
    console.log("Skip clicked")
    // Handle skip functionality
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 bg-teal-600 text-white flex flex-col justify-start items-start px-6 py-10 relative overflow-hidden">
        {/* Background dots pattern - positioned at the bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="grid grid-cols-4 gap-8 p-4">
            {Array(16)
              .fill(0)
              .map((_, i) => (
                <div key={`bottom-${i}`} className="w-4 h-4 rounded-full bg-teal-500 opacity-40"></div>
              ))}
          </div>
        </div>

        {/* Right side dots pattern */}
        <div className="absolute top-0 right-0">
          <div className="grid grid-cols-3 gap-3 p-2">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <div key={`right-${i}`} className="w-3 h-3 rounded-full bg-teal-500 opacity-40"></div>
              ))}
          </div>
        </div>

        <div className="bg-white px-6 py-3 rounded-full mb-10 ml-2 z-10 flex items-center">
          <TealAsterisk />
          <span className="text-gray-400 font-medium tracking-wider ml-2 text-xl">GA TEST</span>
        </div>
        <h1 className="text-3xl font-bold leading-snug ml-2 z-10 w-full pr-4">Start your Screening journey with us!</h1>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-2/3 flex flex-col items-start p-6 pt-10">
        <div className="max-w-md w-full mx-auto">
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className="w-full">
              <div className="relative pt-1">
                <div className="flex items-center justify-between">
                  <div></div>
                  <div className="text-right">
                    <span className="text-sm font-semibold inline-block text-gray-800">1/5</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: "20%" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Back button */}
          <button className="mb-6 flex items-center text-gray-700">
            <BackArrow />
          </button>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Tell us a bit about you</h2>
            <p className="text-gray-600">That will help us better account setup for you</p>
          </div>

          {/* Form fields */}
          <form className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-1 text-sm font-medium" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-1 text-sm font-medium" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="businessName">
                Business name
              </label>
              <input
                id="businessName"
                type="text"
                className="w-full p-2 border rounded"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="bg-teal-500 text-white py-2 px-6 rounded-full font-medium hover:bg-teal-600 transition-colors"
              >
                Next
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccountSetup
