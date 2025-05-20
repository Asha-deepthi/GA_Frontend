import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaVideo, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useStream } from './StreamContext';

export default function MCQQuestionScreen() {
  const [progress] = useState([true, true, true, false]);
  const navigate = useNavigate();
  const { webcamStream } = useStream();
  const videoRef = useRef(null);

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleBack = () => navigate("/videoquestion");
  const handleSubmit = () => navigate("/codingquestion");

  useEffect(() => {
    fetch("http://localhost:8000/test-execution/demo-questions/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then(data => {
        // Find the MCQ question and extract fields
        const mcqQuestionEntry = data.find(q => q.question_type === "mcq");
        setQuestionData(mcqQuestionEntry);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching MCQ question:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      if (videoRef.current.srcObject !== webcamStream) {
        videoRef.current.srcObject = webcamStream;
        videoRef.current.play().catch(err => console.error("Error playing webcam stream:", err));
      }
    }
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [webcamStream]);

  const toggleOption = (key) => {
    setSelectedOptions(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="relative w-screen h-screen bg-white font-sans overflow-y-auto overflow-x-hidden">
      {/* Top Colored Bar */}
      <div className="flex w-full h-1">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center px-6 md:px-20 py-6">
        <div className="w-44 h-6 bg-gray-300" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-500 bg-red-100 px-4 py-2 rounded-full border border-red-300">
            <FaClock />
            <span>03:00</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <img src="/images/profilepic.png" alt="Profile" className="w-6 h-6 rounded-full" />
            <span className="text-gray-700 font-semibold">Arjun</span>
          </div>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="relative w-full flex items-center px-6 md:px-20 mb-12" style={{ height: 24 }}>
        <button onClick={handleBack} className="absolute left-[110px] text-gray-600 bg-white flex items-center gap-2">
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <div className="flex-1 flex justify-center items-center gap-4">
          {progress.map((done, i) => (
            <div
              key={i}
              className={`h-1 rounded-full ${done ? 'bg-teal-500' : 'bg-teal-200'}`}
              style={{ width: 200 }}
            />
          ))}
        </div>
        <div className="absolute right-[160px] text-gray-700 font-semibold">(03/04)</div>
      </div>

      {/* Title & Text */}
      <div className="text-center px-6 md:px-20 mt-8 mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">MCQ Question</h1>
        {loading ? (
          <p className="text-gray-500">Loading question...</p>
        ) : questionData ? (
          <p className="mt-4 text-base md:text-lg text-gray-700">{questionData.question_text}</p>
        ) : (
          <p className="mt-4 text-base md:text-lg text-red-500">No MCQ question found.</p>
        )}
      </div>

      {/* Options Grid */}
      <div className="px-6 md:px-20 mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {questionData && questionData.options ? (
          Object.entries(questionData.options).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOptions.includes(key)}
                onChange={() => toggleOption(key)}
                className="form-checkbox h-5 w-5 text-teal-500 rounded"
              />
              <span className="text-gray-800">{value}</span>
            </label>
          ))
        ) : (
          <p className="text-gray-500">No options available</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center mb-12">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full"
        >
          Submit & Continue
        </button>
        {/* Note Below Submit */}
        <p className="mt-16 text-center text-sm text-black font-medium">
          Note: Do not refresh the page or you'll lose your data
        </p>
      </div>

      {/* Bottom-Right Live Webcam Feed */}
      <div className="fixed bottom-4 right-4 flex items-end gap-4 z-50">
        <div className="flex flex-col gap-2 items-start justify-end mr-2">
          <div className="flex items-center gap-1 text-gray-700">
            <FaMicrophone />
            <div className="w-1 h-2 bg-gray-300" />
            <div className="w-1 h-3 bg-yellow-500" />
            <div className="w-1 h-4 bg-green-500" />
            <div className="w-1 h-5 bg-green-500" />
          </div>
          <div className="flex items-center gap-1 text-gray-700">
            <FaVideo />
            <div className="w-1 h-2 bg-gray-300" />
            <div className="w-1 h-3 bg-yellow-500" />
            <div className="w-1 h-4 bg-green-500" />
            <div className="w-1 h-5 bg-green-500" />
          </div>
        </div>
        <div className="w-28 h-20 rounded-lg overflow-hidden border border-gray-300 bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
