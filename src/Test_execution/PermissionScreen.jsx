import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa";
import { useStream } from './StreamContext';  // Your custom context hook

export default function PermissionScreen() {
  const [webcam, setWebcam] = useState(false);
  const [mic, setMic] = useState(false);
  const [screen, setScreen] = useState(false);
  const navigate = useNavigate();
  const { requestWebcamAndMic, setWebcamStream } = useStream();

  const requestPermission = async (type) => {
    try {
      if (type === 'webcam' || type === 'mic') {
        const success = await requestWebcamAndMic();
        if (success) {
          setWebcam(true);
          setMic(true);
        } else {
          setWebcam(false);
          setMic(false);
        }
      } else if (type === 'screen') {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreen(true);
      }
    } catch (err) {
      alert(`Permission for ${type} was denied or error occurred.`);
      if (type === 'webcam' || type === 'mic') {
        setWebcam(false);
        setMic(false);
      } else if (type === 'screen') {
        setScreen(false);
      }
    }
  };

  const toggleSwitch = (type) => {
    if (
      (type === 'webcam' && !webcam) ||
      (type === 'mic' && !mic)
    ) {
      requestPermission('webcam'); // handles both webcam and mic
    } else if (type === 'screen' && !screen) {
      requestPermission('screen');
    } else {
      if (type === 'webcam') {
        setWebcam(false);
        setMic(false);
        setWebcamStream(null); // Stop stream
      } else if (type === 'mic') {
        setMic(false);
        setWebcam(false);
        setWebcamStream(null); // Stop stream
      } else if (type === 'screen') {
        setScreen(false);
      }
    }
  };

  const handleNext = () => {
    if (webcam && mic && screen) {
      navigate('/connectionstrength');
    } else {
      alert('Please grant all permissions before proceeding.');
    }
  };

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col items-center justify-start px-4 relative overflow-hidden font-overpass overflow-x-hidden overflow-y-auto">
      {/* Top Colored Bar */}
      <div className="absolute top-0 left-0 w-full h-[10px] flex">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <header className="absolute top-[50px] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[1250px] h-[44px] flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-[198px] h-[40px] bg-gray-300 md:w-[250px]" />
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2.5 px-4 py-2 bg-[#E0302D0D] border border-[#E0302D] rounded-full text-sm sm:text-base">
            <FaQuestionCircle className="text-[#E0302D] text-[18px]" />
            <span className="font-overpass font-medium leading-6 text-[#E0302D]">FAQs</span>
          </button>
          <div className="h-6 w-[2px] bg-gray-300" />
          <div className="w-[90px] h-[44px] flex items-center justify-between gap-1.5 px-2">
            <img src="/images/profilepic.png" alt="Avatar" className="w-6 h-6 rounded-full" />
            <span className="font-overpass font-medium text-[16px] text-[#1A1A1A] truncate max-w-[60px]">Arjun</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="absolute top-[174px] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[1100px] min-h-[706px] flex flex-col gap-[60px]">
        <div className="flex flex-col gap-2 w-full max-w-[700px] mx-auto text-center px-2 sm:px-4">
          <h1 className="font-overpass font-extrabold text-[28px] sm:text-[32px] md:text-[40px] text-black">Enable Camera and Microphone</h1>
          <p className="font-overpass text-[16px] sm:text-[18px] md:text-[20px] text-gray-500 max-w-[600px] mx-auto">
            To proceed with the interview, we need access to your camera and microphone. Please grant the necessary permissions.
          </p>
        </div>

        <div className="flex flex-col gap-[30px] w-full max-w-[600px] mx-auto">
          <PermissionToggle
            label="Grant permission to WebCam"
            image="images/Webcam.png"
            checked={webcam}
            onChange={() => toggleSwitch('webcam')}
          />
          <PermissionToggle
            label="Grant permission to Microphone"
            image="images/Microphone.png"
            checked={mic}
            onChange={() => toggleSwitch('mic')}
          />
          <PermissionToggle
            label="Grant Permission for Entire Screen Share"
            image="images/Screenshare.png"
            checked={screen}
            onChange={() => toggleSwitch('screen')}
          />
        </div>

        <div className="flex justify-center pb-10">
          <button
            className="w-[117px] h-[44px] px-[40px] py-[10px] rounded-[40px] bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionToggle({ label, image, checked, onChange }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 rounded-xl w-full h-[105px] gap-[10px] pr-[5px] pb-[5px] border-r-4 border-b-4 border-gray-400 bg-gray-50 shadow-lg">
      <div className="flex items-center gap-3">
        <img src={image} alt={label} className="w-10 h-10" />
        <span className="text-gray-700">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-all duration-200"></div>
        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-200 peer-checked:translate-x-full shadow-md"></div>
      </label>
    </div>
  );
}
