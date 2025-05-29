import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStream } from './StreamContext';
import { FaMicrophone, FaVideo } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

const DemoQuestion = () => {
  const { webcamStream } = useStream();
  const [isRecording, setIsRecording] = useState(false);
  const [micStrength, setMicStrength] = useState(0);
  const [videoStrength, setVideoStrength] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [micStream, setMicStream] = useState(null);
  const videoRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioBlob, setAudioBlob] = useState(null);
     // fetch from your backend
    useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return setUserName('Guest');
  
    fetch(`http://127.0.0.1:8000/test-execution/get-user/${id}/`)
      .then(res => res.json())
      .then(profile => setUserName(profile.name))
      .catch(() => setUserName('Guest'));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/test-execution/demo-questions/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video question.");
        return res.json();
      })
      .then((data) => {
        const videoQ = data.find((q) => q.question_type === "audio" && q.is_demo);
        setQuestionData(videoQ);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleMicClick = async () => {
    setIsProcessing(true);

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicStream(stream);
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setAudioBlob(blob);
          stream.getTracks().forEach((track) => track.stop());
          setMicStream(null);
          setIsProcessing(false);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setIsProcessing(false);
      } catch (err) {
        console.error('Microphone access denied:', err);
        setIsProcessing(false);
      }
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
    }
  };

  const handleRetry = () => {
    setAudioUrl(null);
  };

  const handleAccept = async () => {
    if (!audioBlob) {
      alert("Please record your answer before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("question_id", questionData?.id || "");
    formData.append("demo_audio_file", audioBlob, "response.webm");

    try {
      const response = await fetch("http://localhost:8000/test-execution/upload-demo-audio/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        throw new Error("Failed to upload audio");
      }

      const result = await response.json();
      console.log("Audio uploaded:", result);
      navigate("/audioquestion");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  // Webcam setup
  useEffect(() => {
    if (webcamStream && videoRef.current) {
      let active = true;
      if (videoRef.current.srcObject !== webcamStream) {
        videoRef.current.srcObject = webcamStream;
      }
      videoRef.current.play().catch((err) => {
        if (active) console.error('Error playing video:', err);
      });
      return () => {
        active = false;
        if (videoRef.current) videoRef.current.srcObject = null;
      };
    }
  }, [webcamStream]);

  // Video strength analyzer
  useEffect(() => {
    if (!webcamStream) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let videoAnimationFrameId;

    const updateVideoStrength = () => {
      const video = videoRef.current;
      if (!video || video.readyState !== 4) {
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
        totalBrightness += (r + g + b) / 3;
      }

      const avgBrightness = totalBrightness / (length / 4);
      setVideoStrength(avgBrightness);
      videoAnimationFrameId = requestAnimationFrame(updateVideoStrength);
    };

    updateVideoStrength();
    return () => cancelAnimationFrame(videoAnimationFrameId);
  }, [webcamStream]);

  // Mic strength analyzer
  useEffect(() => {
    if (!micStream) return;

    const audioContext = new AudioContext();
    const micSource = audioContext.createMediaStreamSource(micStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    micSource.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let micAnimationFrameId;

    const updateMicStrength = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setMicStrength(avg);
      micAnimationFrameId = requestAnimationFrame(updateMicStrength);
    };

    updateMicStrength();
    return () => {
      cancelAnimationFrame(micAnimationFrameId);
      audioContext.close();
    };
  }, [micStream]);

  return (
    <div className="w-screen min-h-screen bg-white font-overpass relative overflow-x-hidden overflow-y-auto">
      {/* Top Colored Progress Bar */}
      <div className="top-0 left-0 w-full h-[10px] flex z-50">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <div className="relative max-w-[1250px] mx-auto px-4 pt-[70px] pb-12">
        <header className="flex justify-between items-center h-[44px] px-8 mb-12">
          <div className="w-[197.78px] h-[40px] bg-gray-300" />
          <div className="flex items-center gap-2">
            <img src="/images/profilepic.png" alt="Avatar" className="w-6 h-6 rounded-full" />
            <span className="text-base font-medium text-gray-900">{userName ?? 'Loading...'}</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center text-center px-4">
          <h2 className="font-extrabold text-[40px] leading-[48px] text-black mb-10">Demo Question</h2>
          {loading ? (
          <p className="text-lg text-gray-600">Loading question...</p>
        ) : questionData ? (
          <p className="text-base sm:text-xl text-gray-600 max-w-[900px] mb-12 leading-relaxed">{questionData.question_text}</p>
        ) : (
          <p className="text-lg text-red-500">No audio question found.</p>
        )}

          {/* Mic Section */}
          <div className="w-full max-w-[824px] h-[200px] border border-teal-500/20 rounded-[10px] flex flex-col items-center justify-center px-4 sm:px-[362px] mb-6 bg-[linear-gradient(0deg,rgba(0,163,152,0.03),rgba(0,163,152,0.03)),#FFFFFF]">
            <div className="flex items-center gap-6">
              {/* Mic Button */}
              <div className="relative w-18 h-18 flex items-center justify-center">
                {isRecording && (
                  <>
                    <span className="absolute w-20 h-20 rounded-full border-8 border-teal-400 animate-pingCustom" />
                    <span className="absolute w-22 h-22 rounded-full border-8 border-teal-300 animate-pingCustom delay-200" />
                    <span className="absolute w-24 h-24 rounded-full border-8 border-teal-200 animate-pingCustom delay-400" />

                  </>
                )}
                <button
                  onClick={handleMicClick}
                  className={`relative z-10 w-16 h-16 rounded-full p-0 flex items-center justify-center transition duration-300 shadow-md ${isRecording ? 'bg-teal-600' : 'bg-teal-500'
                    }`}
                  aria-label="Toggle Recording"
                  disabled={isProcessing}
                >
                  <img src="/images/Audio Recording.png" alt="Mic Icon" className="w-full h-full object-contain" />
                </button>
              </div>


              {/* Status Text */}
              {isRecording && <p className="text-sm text-gray-600">Recording...</p>}

              {/* Retry Button */}
              {audioUrl && (
                <button
                  onClick={handleRetry}
                  className="w-16 h-16 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center shadow transition"
                  aria-label="Retry Recording"
                >
                  <FiRefreshCw className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Audio Playback */}
          {audioUrl ? (
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-700 mb-2">Your Recorded Answer:</p>
              <audio controls autoPlay src={audioUrl} className="w-full max-w-md" />
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-6">No recording yet</p>
          )}

          {/* Continue Button */}
          <button
            onClick={handleAccept}
            className="w-[148px] h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-[40px] px-[40px] py-[10px] transition mt-16 mb-4"
          >
            Continue
          </button>
        </main>
      </div>

      {/* Bottom HUD */}
      <div className="bottom-4 left-0 w-full z-50 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <p className="text-[14px] leading-[20px] font-medium text-gray-500 text-center">
            Note: Do not refresh the page or you'll lose your data
          </p>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-4 z-50 pointer-events-auto">
          <div className="flex flex-col items-start gap-4">
            {/* Mic Strength Bars */}
            <div className="flex items-center gap-2">
              <FaMicrophone className="text-gray-500 text-[16px]" />
              <div className="flex items-end gap-[3px]">
                {[10, 30, 50, 70, 90].map((threshold, i) => (
                  <div
                    key={i}
                    style={{ width: 4, height: 4 + i * 4 }}
                    className={micStrength > threshold ? 'bg-orange-500' : 'bg-gray-300'}
                  />
                ))}
              </div>
            </div>

            {/* Video Strength Bars */}
            <div className="flex items-center gap-2">
              <FaVideo className="text-gray-500 text-[16px]" />
              <div className="flex items-end gap-[3px]">
                {[20, 60, 100, 140, 180].map((threshold, i) => (
                  <div
                    key={i}
                    style={{ width: 4, height: 4 + i * 4 }}
                    className={videoStrength > threshold ? 'bg-blue-500' : 'bg-gray-300'}
                  />
                ))}
              </div>
            </div>
          </div>

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
