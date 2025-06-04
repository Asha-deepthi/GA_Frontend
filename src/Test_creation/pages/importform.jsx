import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function JobImportForm() {
const navigate = useNavigate();
const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  const accessToken =
    sessionStorage.getItem("access_token") || localStorage.getItem("access_token");

  if (!accessToken) {
    alert("You are not logged in.");
    navigate("/login");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/test-creation/tests/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        start_time: new Date().toISOString(),
        duration_minutes: 60,
        total_marks: 100,
        allow_navigation: true,
        show_question_list: true,
        negative_marking: false,
        navigation_type: "free",
      }),
    });

    if (res.ok) {
      alert("Test created successfully!");
      const data = await res.json();
      console.log("Test created:", data);
      navigate("/interviewquestions", { state: { testId: data.id } });
    } else {
      const errorData = await res.json();
      console.error("Error:", errorData);
      alert("Test creation failed. Check console.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Check console.");
  }
};

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 w-full">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-12">
            {/* Logo placeholder */}
            <div className="w-[100px] h-[35px] bg-gray-400"></div>
            
            {/* Navigation tabs */}
             <nav className="flex space-x-8">
            <button
                onClick={() => navigate('/dashboard')}
                className="text-black px-2 py-1"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/evaluations')}
                className="text-black px-2 py-1"
              >
                Evaluations
              </button>
              <button
                className="text-[#00a398] px-2 py-1 border-b-2 border-[#00a398]"
              >
                Positions
              </button>
            </nav>
          </div>
          
          {/* User profile */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
              <img src="/placeholder.svg?height=32&width=32" alt="User" />
            </div>
            <span>Arjun</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl px-4 py-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#00a398] text-white flex items-center justify-center text-sm mb-2">
                  1
                </div>
                <span className="text-[#00a398] text-sm font-medium">Import a job</span>
              </div>
              
              {/* Line between steps */}
              <div className="h-[1px] bg-gray-300 flex-1 mx-2"></div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm mb-2">
                  2
                </div>
                <span className="text-gray-500 text-sm text-center">Set interview<br />questions</span>
              </div>
              
              {/* Line between steps */}
              <div className="h-[1px] bg-gray-300 flex-1 mx-2"></div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm mb-2">
                  3
                </div>
                <span className="text-gray-500 text-sm">Import candidates</span>
              </div>
              
              {/* Line between steps */}
              <div className="h-[1px] bg-gray-300 flex-1 mx-2"></div>
              
              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm mb-2">
                  4
                </div>
                <span className="text-gray-500 text-sm text-center">Send interview<br />invitation</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            {/* Info box */}
            <div className="bg-[#fff9e6] border border-[#f8cd1d] p-4 rounded mb-8 text-[#101010]">
              <p>
                Please provide the job information or recruitment link, AI will generate the interview questions for you
              </p>
            </div>

            <div className="space-y-6">
              {/* Import from options */}
              <div>
                <label className="block mb-2 font-medium">
                  Import from <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  {/* Job content radio */}
                  <label className="flex items-center space-x-2">
                    <div className="relative flex items-center">
                      <input type="radio" name="import-type" className="sr-only" defaultChecked />
                      <div className="h-5 w-5 rounded-full border border-[#00a398] flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-[#00a398]"></div>
                      </div>
                    </div>
                    <span>Job content</span>
                  </label>
                  
                  {/* Job link radio */}
                  <label className="flex items-center space-x-2">
                    <div className="relative flex items-center">
                      <input type="radio" name="import-type" className="sr-only" />
                      <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-transparent"></div>
                      </div>
                    </div>
                    <span>Job link</span>
                  </label>
                </div>
              </div>

              {/* Job title field */}
              <div>
                <label className="block mb-2 font-medium">
                  test name <span className="text-red-500">*</span>
                </label>
                <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-[#00a398]"
/>
              </div>

              {/* Job description field */}
              <div>
                <label className="block mb-2 font-medium">
                  test description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2.5 h-40 focus:outline-none focus:ring-1 focus:ring-[#00a398]"
                  ></textarea>
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">0/1000</div>
                </div>
              </div>

              {/* Confirm button */}
              <div className="flex justify-center mt-8">
                <button
                   onClick={handleSubmit}
                    className="bg-[#00a398] hover:bg-[#007580] text-white px-12 py-2.5 rounded"
                    >
                    Confirm
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}