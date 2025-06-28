import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FaQuestionCircle } from 'react-icons/fa';
import AuthContext from "../Test_creation/contexts/AuthContext";
import TopHeader from './components/TopHeader';

export default function InstructionScreen({ onNext, onBack }) {
  const { user } = useContext(AuthContext);
  const userName = user?.name || 'Guest';
  const instructions = [
    {
      title: 'AI Monitoring:',
      text: 'This interview is AI-powered, so do not seek third-party help. If detected, the interview will be terminated immediately, and you will not proceed to the next round.',
    },
    {
      title: 'Question Types and Timing:',
      text: 'The interview includes MCQs, audio responses, video responses, and coding tasks, each with dedicated time limits. A demo question will be provided before the actual questions begin.',
    },
    {
      title: 'Submission Finality:',
      text: "Once an answer is submitted, you won't be able to change it. Your responses will be evaluated at the end of the interview.",
    },
  ];
  const navigate = useNavigate();
  // const [userName, setUserName] = useState(null);
  const { testId } = useParams();

  // ✅ Accept button logic
  const handleAccept = async () => {
    const token = sessionStorage.getItem("access_token");

    if (!testId || !token) {
      alert("Missing testId or token");
      return;
    }

    try {
      const userRes = await fetch("http://localhost:8000/api/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!userRes.ok) throw new Error("User fetch failed");
      const user = await userRes.json();

      const candidateId = user.id;

      const testRes = await fetch(
        `http://localhost:8000/api/test-creation/candidate-test-id/?candidate_id=${candidateId}&test_id=${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!testRes.ok) throw new Error("Candidate_Test fetch failed");
      const testData = await testRes.json();

      const candidateTestId = testData.id;

      navigate(`/sectionpage/${testId}/${candidateTestId}`);
    } catch (err) {
      console.error("Error in handleAccept:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="relative w-screen h-screen bg-gray-50 overflow-hidden font-overpass flex flex-col">
      <TopHeader userName={userName} />
      {/* Title & Subtitle */}
      <div className="mx-auto text-center mt-8 max-w-[856px] px-4">
        <h1 className="text-[40px] leading-[48px] font-bold text-gray-900">Interview Instructions</h1>
        <p className="mt-2 text-[20px] leading-[28px] text-gray-900">
          Follow these guidelines to complete your interview successfully. Each question type has a specific time limit.
        </p>
      </div>

      {/* Instruction List */}
      <div className="mt-10 mx-auto w-full max-w-[854px] flex flex-col gap-6 px-4">
        {instructions.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-5"
          >
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
              {idx + 1}
            </div>
            <div className="flex flex-col gap-2 w-full max-w-[660px]">
              <p className="text-[20px] leading-[28px] font-bold text-gray-900">{item.title}</p>
              <p className="text-[16px] leading-[24px] text-gray-900">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-10 mb-6">
        <button
          onClick={handleAccept}
          className="px-10 py-2.5 rounded-full text-white text-[16px] leading-[24px] font-semibold shadow-md hover:shadow-lg transition-all"
          style={{ background: '#00A398' }}
        >
          Next
        </button>
      </div>

      {/* Star Decorative Element */}

    </div>
  );
}
