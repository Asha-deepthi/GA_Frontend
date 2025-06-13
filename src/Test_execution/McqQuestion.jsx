import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaVideo, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { useStream } from './StreamContext';

export default function MCQQuestionScreen() {
  const [userName, setUserName] = useState(null);
     // fetch from your backend
    useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return setUserName('Guest');
  
    fetch(`http://127.0.0.1:8000/api/test-execution/get-user/${id}/`)
      .then(res => res.json())
      .then(profile => setUserName(profile.name))
      .catch(() => setUserName('Guest'));
  }, []);
  const [progress] = useState([true, true, true, false]);
  const navigate = useNavigate();
  const { testId } = useParams();
  const { webcamStream } = useStream();
  const videoRef = useRef(null);

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [micLevel, setMicLevel] = useState(0);
  const [videoLevel, setVideoLevel] = useState(0);

  const handleBack = () => navigate("/videoquestion");
  const handleSubmit = () => {
  if (testId) {
    navigate(`/codingquestion/${testId}`);
  } else {
    alert("Error: Test ID is missing. Cannot proceed.");
    console.error("testId is missing from URL parameters in BasicDetails page.");
  }
};
  // Fetch MCQ question
  useEffect(() => {
    fetch("http://localhost:8000/api/test-execution/demo-questions/")
      .then(res => res.ok ? res.json() : Promise.reject("Fetch failed"))
      .then(data => {
        const mcq = data.find(q => q.question_type === "mcq");
        setQuestionData(mcq);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Monitor video playback quality
  useEffect(() => {
    if (!webcamStream || !videoRef.current) return;
    const videoEl = videoRef.current;
    videoEl.srcObject = webcamStream;
    videoEl.play().catch(console.error);

    let prevFrames = 0;
    let prevDropped = 0;
    let initialized = false;

    const getStats = () => {
      if (videoEl.getVideoPlaybackQuality) {
        const quality = videoEl.getVideoPlaybackQuality();
        return { total: quality.totalVideoFrames, dropped: quality.droppedVideoFrames };
      }
      const total = videoEl.webkitDecodedFrameCount || 0;
      const dropped = videoEl.webkitDroppedFrameCount || 0;
      return { total, dropped };
    };

    const initQuality = () => {
      const { total, dropped } = getStats();
      prevFrames = total;
      prevDropped = dropped;
      initialized = true;
    };

    const checkQuality = () => {
      if (!initialized) {
        initQuality();
      } else {
        const { total, dropped } = getStats();
        const newFrames = total - prevFrames;
        const newDropped = dropped - prevDropped;
        const ratio = newFrames > 0 ? (newFrames - newDropped) / newFrames : 1;
        const level = Math.min(5, Math.max(1, Math.ceil(ratio * 5)));
        setVideoLevel(level);
        prevFrames = total;
        prevDropped = dropped;
      }
      setTimeout(checkQuality, 1000);
    };
    checkQuality();
  }, [webcamStream]);

  // Monitor microphone level
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const src = audioCtx.createMediaStreamSource(stream);
        src.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const data = new Uint8Array(bufferLength);

        const measure = () => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((sum, v) => sum + v, 0) / bufferLength;
          const level = Math.min(5, Math.ceil((avg / 255) * 5));
          setMicLevel(level);
          requestAnimationFrame(measure);
        };
        measure();
      })
      .catch(console.error);
  }, []);

  const toggleOption = key => {
    setSelectedOptions(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderBars = (level, color) => (
    <div className="flex items-end gap-1">
      {[1,2,3,4,5].map(n => (
        <div key={n}
             className={`w-[4px] ${n <= level ? `bg-${color}-500` : 'bg-gray-200'}`}
             style={{ height: `${n * 4}px` }} />
      ))}
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-white font-sans overflow-auto">
      {/* Top Colored Bar */}
      <div className="flex w-full h-1">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-20 py-6">
        <div className="w-44 h-6 bg-gray-300" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-500 bg-red-100 px-4 py-2 rounded-full border border-red-300">
            <FaClock />
            <span>03:00</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <img src="/images/profilepic.png" alt="Profile" className="w-6 h-6 rounded-full" />
            <span className="text-gray-700 font-semibold">{userName ?? 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative w-full flex items-center px-6 md:px-20 mb-12" style={{ height: 24 }}>
        <button onClick={handleBack} className="absolute left-[110px] text-gray-600 bg-white flex items-center gap-2">
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <div className="flex-1 flex justify-center items-center gap-4">
          {progress.map((done, i) => (
            <div
              key={i}
              className={`h-1 rounded-full ${done ? 'bg-teal-500' : 'bg-teal-200'}`}
              style={{ width: 200 }}
            />
          ))}
        </div>
        <div className="absolute right-[160px] text-gray-700 font-semibold">(03/04)</div>
      </div>

      {/* Question */}
      <div className="text-center px-6 md:px-20 mt-8 mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">MCQ Question</h1>
        {loading ? (
          <p className="text-gray-500">Loading question...</p>
        ) : questionData ? (
          <p className="mt-4 text-base md:text-lg text-gray-700">{questionData.question_text}</p>
        ) : (
          <p className="mt-4 text-base md:text-lg text-red-500">No MCQ question found.</p>
        )}
      </div>

      {/* Options */}
      <div className="px-6 md:px-20 mb-12 grid grid-cols-1  md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {questionData && questionData.options ? (
          Object.entries(questionData.options).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOptions.includes(key)}
                onChange={() => toggleOption(key)}
                className="form-checkbox h-5 w-5 text-teal-500 rounded"
              />
              <span className="text-gray-800">{value}</span>
            </label>
          ))
        ) : (
          <p className="text-gray-500">No options available</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center mb-12">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full"
        >
          Submit & Continue
        </button>
        <p className="mt-16 text-center text-sm text-black font-medium">
          Note: Do not refresh the page or you'll lose your data
        </p>
      </div>

      {/* Live Signals */}
      <div className="absolute bottom-4 right-4 flex items-end gap-4 z-50">
        <div className="flex flex-col gap-2 items-start justify-end mr-2 text-gray-700">
          <div className="flex items-center gap-1">
            <FaMicrophone /> {renderBars(micLevel, 'yellow')}
          </div>
          <div className="flex items-center gap-1">
            <FaVideo /> {renderBars(videoLevel, 'teal')}
          </div>
        </div>
        <div className="w-28 h-20 rounded-lg overflow-hidden border border-gray-300 bg-black">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
