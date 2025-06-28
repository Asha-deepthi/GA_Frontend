import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import AuthContext from "../Test_creation/contexts/AuthContext"; // Adjust path as needed
import TopHeader from './components/TopHeader'; // Adjust path if in a different folder

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userName = user?.name || 'Guest';
    const { testId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    /*const handleAccept = () => {
        // --- FIX 3: Include the testId when navigating to the next page ---
        if (testId) {
            navigate(`/tutorialscreen/${testId}`);
        } else {
            // This is a safety check in case the URL is wrong
            alert("Error: Test ID is missing. Cannot proceed.");
            console.error("testId is missing from URL parameters in WelcomeScreen.");
        }
    };*/

const handleAccept = async () => {
        setIsLoading(true);
        setErrorMessage('');
        const accessToken = sessionStorage.getItem("access_token");

        if (!testId) {
            setErrorMessage("Error: Test ID is missing. Cannot proceed.");
            setIsLoading(false);
            return;
        }

        try {
            // Call the new "gatekeeper" endpoint you just created
            const response = await fetch('http://localhost:8000/api/test-creation/validate-attempt/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ test_id: testId }) // Send the test_id
            });

            const data = await response.json();

            if (!response.ok) {
                // The gatekeeper said NO (expired, completed, etc.)
                // The error message comes directly from your backend.
                throw new Error(data.error);
            }

            // The gatekeeper said YES. Proceed exactly as before.
            navigate(`/tutorialscreen/${testId}`);

        } catch (err) {
            // Display any error message (e.g., "Your access to this test expired...")
            setErrorMessage(err.message);
            setIsLoading(false);
        }
    };
  return (
    <div className="relative w-screen h-screen bg-gray-50 overflow-hidden font-overpass flex flex-col">
      <TopHeader userName={userName} />
      {/* Main Content */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 md:px-0 max-w-[456px] overflow-hidden">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-black font-extrabold text-[40px] leading-[48px] flex items-center gap-2">
            <span>Welcome</span>
            <img
              src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/waving-hand-light-skin-tone.png"
              alt="hand"
              className="w-8 h-8"
            />
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-black/70 mt-1">
            Thank you for joining our interview invitation.
          </p>
        </div>

<div className="mt-20 mb-10 w-full min-h-[340px] p-6 rounded-xl border border-r-4 border-b-4 border-teal-500 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] bg-teal-50 bg-opacity-[0.97] flex flex-col justify-between">
                    <div>
                        <h2 className="text-black font-bold text-[28px] leading-[36px] mb-2">
                            Accept Your Interview
                        </h2>
                        <p className="text-gray-500 text-base leading-6">
                            Please confirm your availability to proceed with the interview or choose to reschedule.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={handleAccept} 
                            disabled={isLoading} // --- Disable button while loading
                            className="bg-[#00A398] text-white px-6 py-2 rounded-3xl font-bold text-[16px] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Accept'}
                        </button>
                    </div>
                </div>

                {/* --- 3. This is where the error message will be displayed --- */}
                {errorMessage && (
                    <div className="w-full max-w-[456px] p-4 mb-20 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <p className="font-bold">Access Denied</p>
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomeScreen;
