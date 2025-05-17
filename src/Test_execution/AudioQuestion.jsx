import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa';

const AudioQuestion = () => {
    const [isRecording, setIsRecording] = useState(false);

    const handleMicClick = () => {
        setIsRecording(prev => !prev);
    };

    return (
        <div className="w-screen min-h-screen bg-white font-overpass relative overflow-x-hidden overflow-y-auto">
            {/* Top Color Bar */}
            <div className="fixed top-0 left-0 w-full h-[10px] flex z-50">
                <div className="flex-1 bg-red-500" />
                <div className="flex-1 bg-orange-400" />
                <div className="flex-1 bg-yellow-400" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-cyan-500" />
            </div>

            {/* Header (absolute) */}
            <header
                className="absolute top-[50px] left-1/2 z-40 flex items-center justify-between px-8"
                style={{
                    width: '1250px',
                    height: '44px',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                }}
            >
                {/* Logo */}
                <div className="w-[144px] h-[24px] bg-black/20 rounded" />

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width: '115px',
                            height: '44px',
                            gap: '10px',
                            padding: '10px 22px 10px 20px',
                            background: '#FFEAEA',
                            border: '1px solid #E0302D',
                            borderRadius: '70px',
                        }}
                    >
                        <FaClock style={{ color: '#E0302D', fontSize: '18px' }} />
                        <span
                            style={{
                                fontFamily: 'Overpass',
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '24px',
                                color: '#E0302D',
                            }}
                        >
                            05:00
                        </span>
                    </div>

                    <div className="h-6 w-[2px] bg-gray-300" />

                    <div
                        style={{
                            width: '90px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                            padding: '8px',
                        }}
                    >
                        <img
                            src="/images/profilepic.png"
                            alt="Avatar"
                            className="w-6 h-6 rounded-full"
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
                            Arjun
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <div className="relative max-w-[1250px] mx-auto px-4 pb-10 pt-[130px] flex flex-col items-center text-center">
                {/* ✅ Moved Progress Bar Here */}
                <div
                    className="flex items-center justify-between mb-10"
                    style={{
                        width: '1036px',
                        gap: '155px',
                    }}
                >
                    <button
                        className="text-sm font-medium border border-white bg-white text-black px-4 py-2 rounded-full"
                    >
                        &larr; Back
                    </button>

                    <div className="flex gap-2 items-center">
                        <div
                            className="w-32 h-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: 'rgba(0, 163, 152, 0.4)' }}
                        />
                        <div
                            className="w-32 h-1 rounded-full"
                            style={{ background: 'rgba(0, 163, 152, 0.10)' }}
                        />
                        <div
                            className="w-32 h-1 rounded-full"
                            style={{ background: 'rgba(0, 163, 152, 0.10)' }}
                        />
                        <div
                            className="w-32 h-1 rounded-full"
                            style={{ background: 'rgba(0, 163, 152, 0.10)' }}
                        />
                    </div>

                    <span className="text-sm font-medium text-black ml-8">(01/04)</span>
                </div>

                {/* Question Section */}
                <h2 className="text-[40px] font-extrabold text-black mb-6">
                    Audio Question
                </h2>

                <p className="text-xl text-gray-600 max-w-[900px] mb-12 leading-relaxed">
                    1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ?
                </p>

                {/* Recording Box */}
                <div
                    className="w-full max-w-[824px] h-[200px] border border-teal-500/20 rounded-[10px] flex items-center justify-center px-4 sm:px-[362px] mb-14"
                    style={{
                        background: `linear-gradient(0deg, rgba(0, 163, 152, 0.03), rgba(0, 163, 152, 0.03)), #FFFFFF`
                    }}
                >
                    <button
                        onClick={handleMicClick}
                        className={`w-18 h-18 rounded-full p-1 flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-transparent'
                            } shadow-md transition duration-300`}
                    >
                        <img
                            src="/images/Audio Recording.png"
                            alt="Mic Icon"
                            className="w-full h-full object-contain"
                        />
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    className="w-[218px] h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition flex items-center justify-center mb-8"
                >
                    Submit & Continue
                </button>

                {/* Note */}
                <p className="text-xs text-gray-500 mt-10 mb-22">
                    Note: Do not refresh the page or you'll lose your data
                </p>
            </div>

            {/* Bottom-right media box with voice signal and webcam */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 z-40">
                {/* Voice Signal Image */}
                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-white">
                    <img
                        src="/images/signal.png"
                        alt="Voice Signal"
                        className="w-full h-full object-contain"
                    />
                </div>

                <div
                    className="w-[150px] h-[100px] rounded-md bg-gray-200 border border-gray-400 overflow-hidden"
                >
                    <img
                        src="/images/Webcam pic.png"
                        alt="Webcam"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioQuestion;
