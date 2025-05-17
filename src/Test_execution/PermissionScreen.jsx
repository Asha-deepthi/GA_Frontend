import { useState } from 'react';
import { FaQuestionCircle } from "react-icons/fa";

export default function PermissionScreen() {
    const [webcam, setWebcam] = useState(false);
    const [mic, setMic] = useState(false);
    const [screen, setScreen] = useState(false);

    const requestPermission = async (type) => {
        try {
            if (type === 'webcam') {
                await navigator.mediaDevices.getUserMedia({ video: true });
                setWebcam(true);
            } else if (type === 'mic') {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setMic(true);
            } else if (type === 'screen') {
                await navigator.mediaDevices.getDisplayMedia({ video: true });
                setScreen(true);
            }
        } catch (err) {
            alert(`Permission for ${type} was denied.`);
        }
    };

    const toggleSwitch = (type) => {
        if (
            (type === 'webcam' && !webcam) ||
            (type === 'mic' && !mic) ||
            (type === 'screen' && !screen)
        ) {
            requestPermission(type);
        } else {
            if (type === 'webcam') setWebcam(false);
            if (type === 'mic') setMic(false);
            if (type === 'screen') setScreen(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden font-overpass">
            {/* Top Colored Bar */}
            <div className="absolute top-0 left-0 w-full h-[10px] flex">
                <div className="flex-1 bg-red-500" />
                <div className="flex-1 bg-orange-400" />
                <div className="flex-1 bg-yellow-400" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-cyan-500" />
            </div>

            <header
                className="flex items-center justify-between px-8 py-4 absolute"
                style={{ top: "50px", left: "95px", width: "1250px" }}
            >
                <div className="w-32 h-6 rounded" style={{ background: '#00000033' }} />

                <div className="flex items-center gap-4">
                    {/* FAQ Button */}
                    <button
                        className="flex items-center"
                        style={{
                            width: '107px',
                            height: '44px',
                            gap: '10px',
                            padding: '10px 22px 10px 20px',
                            background: '#E0302D0D',
                            border: '1px solid #E0302D',
                            borderRadius: '70px',
                        }}
                    >
                        <FaQuestionCircle
                            style={{
                                fontFamily: 'Font Awesome 6 Free',
                                fontWeight: 400,
                                fontSize: '18px',
                                lineHeight: '24px',
                                color: '#E0302D',
                            }}
                        />
                        <span
                            style={{
                                fontFamily: 'Overpass',
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '24px',
                                textAlign: 'center',
                                color: '#E0302D',
                            }}
                        >
                            FAQs
                        </span>
                    </button>

                    {/* Divider Line */}
                    <div className="h-6 w-[2px] bg-gray-300" />

                    {/* Profile Pic + Name */}
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
                            Arjun
                        </span>
                    </div>
                </div>
            </header>


            {/* Header */}
            <div className="mt-10 text-center">
                <h1 className="text-3xl font-bold mb-2 text-black">Enable Camera and Microphone</h1>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    To proceed with the interview, we need access to your camera and microphone. Please grant the necessary permissions.
                </p>
            </div>

            {/* Permissions */}
            <div className="mt-10 space-y-6">
                {/* Webcam */}
                <div className="flex items-center justify-between px-6 py-4 rounded-xl w-[450px] border-r-4 border-b-4 border-gray-400 shadow-lg min-h-[90px]">
                    <div className="flex items-center gap-3">
                        <img src="images/Webcam.png" alt="Webcam" className="w-10 h-10" />
                        <span className="text-gray-700">Grant permission to WebCam</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={webcam}
                            onChange={() => toggleSwitch('webcam')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-200"></div>
                        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-200 peer-checked:translate-x-full shadow-md"></div>
                    </label>
                </div>

                {/* Microphone */}
                <div className="flex items-center justify-between px-6 py-4 rounded-xl w-[450px] border-r-4 border-b-4 border-gray-400 shadow-lg min-h-[90px]">
                    <div className="flex items-center gap-3">
                        <img src="images/Microphone.png" alt="Microphone" className="w-10 h-10" />
                        <span className="text-gray-700">Grant permission to Microphone</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={mic}
                            onChange={() => toggleSwitch('mic')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-200"></div>
                        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-200 peer-checked:translate-x-full shadow-md"></div>
                    </label>
                </div>

                {/* Screen Share */}
                <div className="flex items-center justify-between px-6 py-4 rounded-xl w-[450px] border-r-4 border-b-4 border-gray-400 shadow-lg min-h-[90px]">
                    <div className="flex items-center gap-3">
                        <img src="images/Screenshare.png" alt="Screen Share" className="w-10 h-10" />
                        <span className="text-gray-700">Grant Permission for Entire Screen Share</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={screen}
                            onChange={() => toggleSwitch('screen')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-200"></div>
                        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-200 peer-checked:translate-x-full shadow-md"></div>
                    </label>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full shadow-md transition-colors duration-300"
                    onClick={() => alert('Next clicked!')}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
