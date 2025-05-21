import React, { useState, useEffect, useRef } from 'react';
import { FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStream } from './StreamContext';
import { FiRefreshCw } from 'react-icons/fi';

const AudioQuestion = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioChunksRef = useRef([]);

  const { webcamStream } = useStream();
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Fetch audio question
  useEffect(() => {
    fetch("http://localhost:8000/test-execution/demo-questions/")
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch questions");
        return response.json();
      })
      .then(data => {
        const audioQuestion = data.find(q => q.question_type === "audio");
        setQuestionData(audioQuestion);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  }, []);

  // Display webcam stream
  useEffect(() => {
    if (webcamStream && videoRef.current) {
      if (videoRef.current.srcObject !== webcamStream) {
        videoRef.current.srcObject = webcamStream;
        videoRef.current.play().catch(err =>
          console.error("Error playing webcam stream:", err)
        );
      }
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [webcamStream]);

  // Handle mic recording
  const handleMicClick = async () => {
    setIsProcessing(true);
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          // Revoke old URL if exists
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }

          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          console.log("Audio URL:", url);

          // Stop all audio tracks
          stream.getTracks().forEach(track => track.stop());
          setIsProcessing(false);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setIsProcessing(false);
      } catch (err) {
        console.error("Microphone access denied:", err);
        setIsProcessing(false);
      }
    } else {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }
  };

  const handleRetry = () => {
    setAudioUrl(null);
    setIsRecording(false);
    audioChunksRef.current = [];
  };


  const handleBack = () => navigate("/demoquestion");
  const handleSubmit = () => navigate("/videoquestion");

  return (
    <div className="w-screen min-h-screen bg-white font-overpass relative overflow-x-hidden overflow-y-auto pb-24">
      {/* Top Color Bar */}
      <div className="fixed top-0 left-0 w-full h-[10px] flex z-50">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <header className="absolute top-[50px] left-1/2 z-40 flex items-center justify-between px-4 sm:px-8 w-full max-w-[1250px] transform -translate-x-1/2 h-[44px] bg-white">
        <div className="w-[100px] sm:w-[144px] h-[24px] bg-black/20 rounded" />
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center px-3 sm:px-6 py-2 rounded-[70px] bg-[#FFEAEA] border border-[#E0302D] gap-2 sm:gap-2">
            <FaClock className="text-[#E0302D] text-lg" />
            <span className="font-medium text-[#E0302D] text-sm sm:text-base">05:00</span>
          </div>
          <div className="h-6 w-[2px] bg-gray-300 hidden sm:block" />
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <img src="/images/profilepic.png" alt="Avatar" className="w-6 h-6 rounded-full" />
            <span className="font-medium text-[#1A1A1A] text-sm sm:text-base">Arjun</span>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="relative max-w-[1250px] mx-auto px-4 sm:px-8 pb-10 pt-[130px] flex flex-col items-center text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 w-full max-w-[1036px]" style={{ gap: '1rem' }}>
          <button onClick={handleBack} className="text-sm font-medium border border-white bg-white text-black px-4 py-2 rounded-full mb-4 sm:mb-0">
            &larr; Back
          </button>
          <div className="flex gap-2 items-center justify-center mb-4 sm:mb-0">
            <div className="w-20 sm:w-32 h-1 rounded-full bg-teal-500/40" />
            <div className="w-20 sm:w-32 h-1 rounded-full bg-teal-500/10" />
            <div className="w-20 sm:w-32 h-1 rounded-full bg-teal-500/10" />
            <div className="w-20 sm:w-32 h-1 rounded-full bg-teal-500/10" />
          </div>
          <span className="text-sm font-medium text-black ml-0 sm:ml-8">(01/04)</span>
        </div>

        {/* Question */}
        <h2 className="text-3xl sm:text-[40px] font-extrabold text-black mb-6">Audio Question</h2>
        {loading ? (
          <p className="text-lg text-gray-600">Loading question...</p>
        ) : questionData ? (
          <p className="text-base sm:text-xl text-gray-600 max-w-[900px] mb-12 leading-relaxed">{questionData.question_text}</p>
        ) : (
          <p className="text-lg text-red-500">No audio question found.</p>
        )}

        <div className="w-full max-w-[824px] h-[200px] border border-teal-500/20 rounded-[10px] flex flex-col items-center justify-center px-4 sm:px-[362px] mb-6 bg-[linear-gradient(0deg,rgba(0,163,152,0.03),rgba(0,163,152,0.03)),#FFFFFF]">
          <div className="flex items-center gap-6">
            {/* Mic Button */}
            <button
              onClick={handleMicClick}
              className={`w-20 h-20 rounded-full p-2 flex items-center justify-center ${isRecording ? 'bg-teal-500' : 'bg-teal-500'} shadow-md transition duration-300`}
              aria-label="Toggle Recording"
              disabled={isProcessing}
            >
              <img src="/images/Audio Recording.png" alt="Mic Icon" className="w-full h-full object-contain rounded-full" />
            </button>

            {/* Status Text */}
            <div className="flex flex-col gap-2 items-start">
              {isRecording && <p className="text-sm text-gray-600">Recording...</p>}
            </div>

            {/* Retry Button */}
            {audioUrl && (
              <button
                onClick={handleRetry}
                className="w-20 h-20 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center shadow transition"
                aria-label="Retry Recording"
              >
                <FiRefreshCw className="w-6 h-6 text-white" />
              </button>
            )}
          </div>



        </div>


        {/* Audio Playback */}
        {audioUrl && (
          <div className="mb-6">
            <audio controls src={audioUrl} className="w-full max-w-md" />
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-[218px] h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition flex items-center justify-center mb-8"
        >
          Submit & Continue
        </button>
      </main>

      {/* Bottom Note */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 px-4">
        <p className="text-xs text-gray-500 text-center max-w-xs sm:max-w-md">
          Note: Do not refresh the page or you'll lose your data
        </p>
      </div>

      {/* Webcam Box */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 z-40">
        <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-white">
          <img src="/images/signal.png" alt="Voice Signal" className="w-full h-full object-contain" />
        </div>
        <div className="w-[150px] h-[100px] rounded-md bg-black border border-gray-400 overflow-hidden">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default AudioQuestion;
