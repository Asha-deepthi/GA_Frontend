import React, { useState } from 'react';

const DemoQuestion = () => {
    const [isRecording, setIsRecording] = useState(false);

    const handleMicClick = () => {
        setIsRecording(prev => !prev);
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
                <header className="flex justify-between items-center h-[44px]  px-8 mb-12">
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
                <main className="flex flex-col items-center text-center px-2">
                    {/* Demo Question Title */}
                    <h2 className="w-[856px] h-[48px] font-extrabold text-[40px] leading-[48px] text-black text-center mb-20">
                        Demo Question
                    </h2>

                    {/* Paragraph */}
                    <p className="w-[894px] h-[102px] font-normal text-[24px] leading-[34px] text-gray-600 text-center mb-12">
                        1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ?
                    </p>

                    {/* Recording Box */}
                    <div
                        className="w-[824px] h-[200px] border border-teal-500/20 rounded-[10px] flex items-center justify-center px-[362px] py-[50px] gap-[10px] mb-12"
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
                    <button className="w-[148px] h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-[40px] px-[40px] py-[10px] transition mt-16 mb-4">
                        Continue
                    </button>

                    {/* Note */}
                    <p className="w-[337px] h-[20px] text-center text-[14px] leading-[20px] font-medium text-gray-500 mt-10 mb-22">
                        Note: Do not refresh the page or you'll lose your data
                    </p>
                </main>

                {/* Webcam and Audio Signals */}
                <div className="absolute bottom-[70px] right-0 w-[241px] h-[100px] flex items-end gap-[25px] z-40 transform translate-x-20">
                    <div className="w-14 h-1 sm:w-12 sm:h-12 rounded-md overflow-hidden flex items-center justify-center bg-white">
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
