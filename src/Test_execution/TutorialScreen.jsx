import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaQuestionCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



export default function VideoInterviewGuide({ onNext }) {
  const [userName, setUserName] = useState(null);
    const { testId } = useParams();
    const navigate = useNavigate();

   // fetch from your backend
  /*useEffect(() => {
  const id = localStorage.getItem('userId');
  if (!id) return setUserName('Guest');

  fetch(`http://127.0.0.1:8000/api/test-execution/get-user/${id}/`)
    .then(res => res.json())
    .then(profile => setUserName(profile.name))
    .catch(() => setUserName('Guest'));
}, []);

  const handleAccept = () => {
  navigate("/instructionscreen");
    };*/
useEffect(() => {
        const fetchUserData = () => {
            try {
                // --- FIX: Get user details from the access token, not localStorage ---
                const accessToken = sessionStorage.getItem('access_token'); // Or localStorage
                if (!accessToken) {
                    console.error("No access token found.");
                    setUserName('Guest');
                    return;
                }
                
                // Decode the token to get the user's name
                const decodedToken = jwtDecode(accessToken);
                // The name is stored in the 'name' claim we set up in the backend serializer
                setUserName(decodedToken.name || 'Candidate');

            } catch (error) {
                console.error("Error decoding token or fetching user data:", error);
                setUserName('Guest');
            }
        };

        fetchUserData();
    }, []); // This effect runs only once when the component mounts

    // --- FIX: The handleAccept function now includes the testId ---
    const handleAccept = () => {
        if (testId) {
            // Navigate to the instruction screen for the specific test
            navigate(`/Permission/${testId}`);
        } else {
            // This is a safety fallback
            alert("Error: Test ID is missing. Cannot proceed.");
            console.error("testId is missing from URL parameters in TutorialScreen.");
        }
    };
  return (
    <div className="relative w-screen min-h-screen bg-white overflow-y-auto overflow-x-hidden font-overpass">
      {/* Top Colored Bar */}
      <div className="sticky top-0 left-0 w-full flex h-[10px] z-10">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-lime-400" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-20 py-4 mt-[35px]">
        <div className="w-[197.78px] h-[40px] bg-gray-300 " />
        <div className="flex items-center gap-4">
          <button
            className="flex items-center px-5 py-2 border border-[#E0302D] rounded-full bg-[#E0302D0D] gap-2"
          >
            <FaQuestionCircle className="text-[#E0302D] text-lg" />
            <span className="text-[#E0302D] text-base font-medium">FAQs</span>
          </button>
          <div className="h-6 w-[2px] bg-gray-300" />
          <div className="flex items-center gap-2 px-2">
            <img
              src="images/profilepic.png"
              alt="Avatar"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-[#1A1A1A] text-base font-medium">{userName ?? 'Loading...'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
{/* Main Content */}
<div className="w-full min-h-[728px] px-4 sm:px-8 lg:px-0 mx-auto flex flex-col items-center gap-[60px] mt-5 max-w-[856px]">
  {/* Heading and Paragraph */}
  <div className="w-full flex flex-col items-center gap-[10px]">
    <h1 className="text-[32px] sm:text-[36px] md:text-[40px] leading-[44px] md:leading-[48px] font-extrabold text-gray-900 text-center">
      How to Complete Your AI Video Interview
    </h1>
    <p className="font-overpass text-[18px] sm:text-[20px] leading-[28px] font-normal text-gray-600 text-center max-w-[772px]">
      Follow these steps for a smooth interview experience. Make sure to have a quiet space,
      good lighting, and a stable internet connection.
    </p>
  </div>

  {/* Image */}
  <div className="w-full max-w-[768px] h-auto rounded-[10px] overflow-hidden shadow-md">
    <img
      src="/images/video.png"
      alt="AI Interview Guide"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Button */}
  <button
    onClick={handleAccept}
    className="px-11 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-base font-semibold shadow-md"
  >
    Next
  </button>
</div>

      {/* Optional Decorative Star */}
      
    </div>
  );
}

