import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DemoQuestion = () => {
    const [isRecording, setIsRecording] = useState(false);

    const handleMicClick = () => {
        setIsRecording(prev => !prev);
    };
    const navigate = useNavigate();
      const handleAccept = () => {
      navigate("/audioquestion");
        };

    return (
        <div className="w-screen min-h-screen bg-white font-overpass relative overflow-x-hidden overflow-y-auto">
            {/* Top Color Bar */}
            <div className="top-0 left-0 w-full h-[10px] flex z-50">
                <div className="flex-1 bg-red-500" />
                <div className="flex-1 bg-orange-400" />
                <div className="flex-1 bg-yellow-400" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-cyan-500" />
            </div>

            {/* Container */}
            <div className="relative max-w-[1250px] mx-auto px-4 pt-[70px] pb-12">
                {/* Header */}
                <header className="flex justify-between items-center h-[44px] px-8 mb-12">
                    <div className="w-[197.78px] h-[40px] bg-gray-300" />
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/profilepic.png"
                            alt="Avatar"
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-base font-medium text-gray-900">Arjun</span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex flex-col items-center text-center px-4">
                    {/* Demo Question Title */}
                    <h2 className="w-full max-w-[856px] font-extrabold text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-[40px] md:leading-[44px] lg:leading-[48px] text-black text-center mb-10">
                        Demo Question
                    </h2>

                    {/* Paragraph */}
                    <p className="w-full max-w-[894px] font-normal text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-[30px] md:leading-[32px] lg:leading-[34px] text-gray-600 text-center mb-12">
                        1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?
                    </p>

                    {/* Recording Box */}
                    <div
                        className="w-full max-w-[824px] h-[200px] border border-teal-500/20 rounded-[10px] flex items-center justify-center px-8 sm:px-24 md:px-[200px] lg:px-[362px] py-[50px] gap-[10px] mb-12"
                        style={{
                            background: `linear-gradient(0deg, rgba(0, 163, 152, 0.03), rgba(0, 163, 152, 0.03)), #FFFFFF`
                        }}
                    >
                        <button
                            onClick={handleMicClick}
                            className={`w-17 h-17 rounded-full p-1 flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-transparent'
                                } shadow-md transition duration-300`}
                        >
                            <img
                                src="/images/Audio Recording.png"
                                alt="Mic Icon"
                                className="w-full h-full object-contain"
                            />
                        </button>
                    </div>

                    {/* Continue Button */}
                    <button onClick={handleAccept} className="w-[148px] h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-[40px] px-[40px] py-[10px] transition mt-16 mb-4">
                        Continue
                    </button>
                </main>
            </div>

            {/* Note + Webcam Wrapper at bottom */}
<div className="bottom-4 left-0 w-full z-50 pointer-events-none">
    {/* Centered Note */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <p className="text-[14px] leading-[20px] font-medium text-gray-500 text-center">
            Note: Do not refresh the page or you'll lose your data
        </p>
    </div>

    {/* Bottom-right Webcam & Signal */}
    <div className="absolute bottom-0 right-4 flex items-end gap-[20px] pointer-events-auto">
        <div className="w-14 h-14 rounded-md overflow-hidden flex items-center justify-center bg-white">
            <img
                src="/images/signal.png"
                alt="Voice Signal"
                className="w-full h-full object-contain"
            />
        </div>
        <div className="w-[150px] h-[100px] rounded-md bg-gray-200 border border-gray-400 overflow-hidden">
            <img
                src="/images/Webcam pic.png"
                alt="Webcam"
                className="w-full h-full object-cover"
            />
        </div>
    </div>
</div>

        </div>
    );
};

export default DemoQuestion;
