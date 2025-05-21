import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStream } from './StreamContext';
import { FaMicrophone, FaVideo } from 'react-icons/fa';

const DemoQuestion = () => {
  const { webcamStream } = useStream();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [micStrength, setMicStrength] = useState(0);
  const [videoStrength, setVideoStrength] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleMicClick = () => {
    setIsRecording((prev) => !prev);
    // Optionally add real recording logic
  };

  const handleAccept = () => {
    navigate('/audioquestion');
  };

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      let active = true;
      if (videoRef.current.srcObject !== webcamStream) {
        videoRef.current.srcObject = webcamStream;
      }
      videoRef.current
        .play()
        .catch((err) => {
          if (active) console.error('Error playing video:', err);
        });
      return () => {
        active = false;
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
    }
  }, [webcamStream]);

  useEffect(() => {
    if (!webcamStream) return;

    // MIC STRENGTH ANALYSER ONLY IF AUDIO TRACKS EXIST
    const audioTracks = webcamStream.getAudioTracks();
    let audioContext, micSource, analyser, dataArray, micAnimationFrameId;

    if (audioTracks.length > 0) {
      audioContext = new AudioContext();
      micSource = audioContext.createMediaStreamSource(webcamStream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      micSource.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMicStrength = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicStrength(avg);
        micAnimationFrameId = requestAnimationFrame(updateMicStrength);
      };
      updateMicStrength();
    } else {
      setMicStrength(0);
    }

    // VIDEO STRENGTH ANALYSER
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let videoAnimationFrameId;

    const updateVideoStrength = () => {
      const video = videoRef.current;
      if (!video || video.readyState !== 4) {
        // Not enough video data yet, try again next frame
        videoAnimationFrameId = requestAnimationFrame(updateVideoStrength);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const length = frame.data.length;

      let totalBrightness = 0;
      for (let i = 0; i < length; i += 4) {
        const r = frame.data[i];
        const g = frame.data[i + 1];
        const b = frame.data[i + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
      }

      const avgBrightness = totalBrightness / (length / 4);
      setVideoStrength(avgBrightness);
      videoAnimationFrameId = requestAnimationFrame(updateVideoStrength);
    };
    updateVideoStrength();

    return () => {
      if (audioTracks.length > 0) {
        cancelAnimationFrame(micAnimationFrameId);
        audioContext.close();
      }
      cancelAnimationFrame(videoAnimationFrameId);
    };
  }, [webcamStream]);

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

      <div className="relative max-w-[1250px] mx-auto px-4 pt-[70px] pb-12">
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

        <main className="flex flex-col items-center text-center px-4">
          <h2 className="w-full max-w-[856px] font-extrabold text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-[40px] md:leading-[44px] lg:leading-[48px] text-black text-center mb-10">
            Demo Question
          </h2>

          <p className="w-full max-w-[894px] font-normal text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-[30px] md:leading-[32px] lg:leading-[34px] text-gray-600 text-center mb-12">
            1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?
          </p>

          <div
            className="w-full max-w-[824px] h-[200px] border border-teal-500/20 rounded-[10px] flex items-center justify-center px-8 sm:px-24 md:px-[200px] lg:px-[362px] py-[50px] gap-[10px] mb-12"
            style={{
              background: `linear-gradient(0deg, rgba(0, 163, 152, 0.03), rgba(0, 163, 152, 0.03)), #FFFFFF`,
            }}
          >
            <button
              onClick={handleMicClick}
              className={`w-17 h-17 rounded-full p-1 flex items-center justify-center ${
                isRecording ? 'bg-red-500' : 'bg-transparent'
              } shadow-md transition duration-300`}
              aria-pressed={isRecording}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <img
                src="/images/Audio Recording.png"
                alt="Mic Icon"
                className="w-full h-full object-contain"
              />
            </button>
          </div>

          <button
            onClick={handleAccept}
            className="w-[148px] h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-[40px] px-[40px] py-[10px] transition mt-16 mb-4"
          >
            Continue
          </button>
        </main>
      </div>

      {/* Bottom Area */}
      <div className="bottom-4 left-0 w-full z-50 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <p className="text-[14px] leading-[20px] font-medium text-gray-500 text-center">
            Note: Do not refresh the page or you'll lose your data
          </p>
        </div>

        {/* Bottom Right Controls */}
{/* Bottom Right Controls */}
<div className="absolute bottom-6 right-6 flex items-center gap-4 z-50 pointer-events-auto">
  {/* Mic + Video strength bars */}
  <div className="flex flex-col items-start gap-4">
    {/* Mic strength bars */}
    <div className="flex items-center gap-2">
      <FaMicrophone className="text-gray-500 text-[16px]" />
      <div className="flex items-end gap-[2px]">
        {[10, 30, 50, 70, 90].map((threshold, i) => (
          <div
            key={i}
            style={{ width: 2, height: 6 + i * 3 }}
            className={micStrength > threshold ? 'bg-orange-500' : 'bg-gray-300'}
          />
        ))}
      </div>
    </div>

    {/* Video strength bars */}
    <div className="flex items-center gap-2">
      <FaVideo className="text-gray-500 text-[16px]" />
      <div className="flex items-end gap-[2px]">
        {[20, 60, 100, 140, 180].map((threshold, i) => (
          <div
            key={i}
            style={{ width: 2, height: 6 + i * 3 }}
            className={videoStrength > threshold ? 'bg-blue-500' : 'bg-gray-300'}
          />
        ))}
      </div>
    </div>
  </div>

  {/* Webcam video preview */}
  <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    className="w-28 h-20 rounded-md shadow-lg object-cover border border-gray-300"
  />
</div>

</div>
    </div>
  );
};

export default DemoQuestion;
