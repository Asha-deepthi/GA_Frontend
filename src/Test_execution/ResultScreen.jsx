import React, { useState, useEffect } from 'react';
import { FaQuestionCircle } from "react-icons/fa";

const ResultScreen = () => {
    const [userName, setUserName] = useState(null);
   // fetch from your backend
  useEffect(() => {
  const id = localStorage.getItem('userId');
  if (!id) return setUserName('Guest');

  fetch(`http://127.0.0.1:8000/test-execution/get-user/${id}/`)
    .then(res => res.json())
    .then(profile => setUserName(profile.name))
    .catch(() => setUserName('Guest'));
}, []);
    return (
        <div className="w-screen min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-6 font-overpass relative overflow-hidden">
            {/* Top Color Bar */}
            <div className="absolute top-0 left-0 w-full h-[10px] flex z-10">
                <div className="flex-1 bg-red-500" />
                <div className="flex-1 bg-orange-400" />
                <div className="flex-1 bg-yellow-400" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-cyan-500" />
            </div>

            {/* Header */}
            <header
                className="fixed flex items-center justify-between z-40"
                style={{
                    width: '1250px',
                    height: '44px',
                    top: '50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '0 32px',
                    backgroundColor: 'white',
                }}
            >
                {/* Logo */}
                <div
                    className="rounded"
                    style={{
                        width: '144px',
                        height: '24px',
                        background: '#00000033',
                    }}
                />

                {/* Right section */}
                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width: '115px',
                            height: '44px',
                            gap: '10px',
                            padding: '10px 22px 10px 20px',
                        }}
                    >

                        <img
                            src="/images/profilepic.png"
                            alt="Avatar"
                            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                        />
                        <span
                            style={{
                                fontFamily: 'Overpass',
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '24px',
                                color: '#1A1A1A',
                            }}
                        >
                        {userName ?? 'Loading...'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow mt-20">
                {/* Result Card */}
                <div
                    className="w-full max-w-md text-center border-b-4 border-r-4 border-teal-500 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] rounded-xl p-6"
                    style={{
                        width: '625px',
                        height: '230px',
                        background: `linear-gradient(0deg, rgba(0, 163, 152, 0.03), rgba(0, 163, 152, 0.03)), #FFFFFF`,
                    }}
                >
                   <h1 className="font-bold text-[24px] md:text-[28px] text-black mb-2">
    Great Job{ }
    <img 
        src="images/resultpic.png" 
        alt="Celebration" 
        className="inline-block w-6 h-6 md:w-7 md:h-7 ml-2 align-middle" 
    />
</h1>

                    <p className="text-gray-700 text-[14px] md:text-[16px] mb-1">
                        Thank you for completing the interview.
                    </p>
                    <p className="text-black font-medium text-[14px] md:text-[15px] mt-10">
                        Your performance will be reviewed by our team. <br />
                        We will contact you shortly.
                    </p>
                </div>

                <p className="fixed bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-black/100 text-center">
                    For any queries, please reach out to{" "}
                    <a href="mailto:connect@gaproctoredtest.com" className="text-[#00A398]">
                        connect@gaproctoredtest.com
                    </a>
                </p>

            </div>
        </div>
    );
};

export default ResultScreen;
