import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaVideo,
  FaClock,
  FaArrowLeft,
  FaRedo,
  FaStop,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStream } from "./StreamContext";

const VideoQuestion = () => {
  const navigate = useNavigate();
  const { webcamStream } = useStream();
  const videoRef = useRef(null);
  const smallVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [videoLevel, setVideoLevel] = useState(0);

  const handleBack = () => navigate("/audioquestion");
  const handleSubmit = async () => {
  if (!recordedBlob) {
    alert("Please record your video answer before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append("question_id", questionData?.id); // include the related question ID if needed
  formData.append("video", recordedBlob, "recorded-video.webm");

  try {
    const response = await fetch("http://localhost:8000/test-execution/upload-video/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();  // get error details
      console.error("Upload failed:", response.status, errorText);
      throw new Error("Failed to upload video.");
    }

    console.log("Video uploaded successfully.");
    navigate("/mcqquestion");
  } catch (error) {
    console.error("Video upload failed:", error);
    alert("Upload failed. Please try again.");
  }
};

  useEffect(() => {
    fetch("http://localhost:8000/test-execution/demo-questions/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video question.");
        return res.json();
      })
      .then((data) => {
        const videoQ = data.find((q) => q.question_type === "video");
        setQuestionData(videoQ);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (recordedBlob) {
        const videoURL = URL.createObjectURL(recordedBlob);
        videoRef.current.srcObject = null;
        videoRef.current.src = videoURL;
        videoRef.current.muted = false;
        videoRef.current.controls = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => console.error("Playback error:", err));
        };
      } else if (webcamStream) {
        videoRef.current.src = null;
        videoRef.current.srcObject = webcamStream;
        videoRef.current.muted = true;
        videoRef.current.controls = false;
        videoRef.current.play().catch((err) => console.error("Live video play error:", err));
      }
    }
  }, [webcamStream, recordedBlob]);

  useEffect(() => {
    if (webcamStream && smallVideoRef.current) {
      smallVideoRef.current.srcObject = webcamStream;
      smallVideoRef.current.muted = true;
      smallVideoRef.current.play().catch((err) => console.error("Small video play error:", err));
    }
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
      if (smallVideoRef.current) smallVideoRef.current.srcObject = null;
    };
  }, [webcamStream]);

  useEffect(() => {
    let audioInterval;
    let videoInterval;

    if (webcamStream) {
      const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048; // better resolution

const microphone = audioContext.createMediaStreamSource(webcamStream);
microphone.connect(analyser);
const dataArray = new Uint8Array(analyser.fftSize);

audioInterval = setInterval(() => {
  analyser.getByteTimeDomainData(dataArray);

  // Compute RMS (root mean square) volume level
  let sumSquares = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const value = dataArray[i] - 128;
    sumSquares += value * value;
  }
  const rms = Math.sqrt(sumSquares / dataArray.length);

  // Normalize to scale of 0–5
  const normalized = Math.min(5, Math.floor((rms / 30) * 5)); // tweak 30 as needed

  setAudioLevel(normalized);
}, 300);

      videoInterval = setInterval(() => {
        const videoTrack = webcamStream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          let score = 0;
          if (settings.width >= 640) score++;
          if (settings.width >= 1280) score++
          if (settings.height >= 480) score++;
          if (settings.height >= 720) score++;
          if (settings.frameRate >= 15) score += 1;
          if (settings.frameRate >= 30) score += 1;
          score = Math.min(5, Math.max(0, score));
          setVideoLevel(score);
        }
      }, 1000);
    }

    return () => {
      if (audioInterval) clearInterval(audioInterval);
      if (videoInterval) clearInterval(videoInterval);
    };
  }, [webcamStream]);

  const renderSignalBars = (level, colorClass) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const height = `${(i + 1) * 4}px`;
      const color = i < level ? colorClass : "bg-gray-300";
      return <div key={i} className={`w-1 ${color}`} style={{ height }} />;
    });
  };

  const startRecording = () => {
    if (!webcamStream) {
      alert("Webcam stream not available");
      return;
    }

    const audioTracks = webcamStream.getAudioTracks();
    const videoTracks = webcamStream.getVideoTracks();

    if (audioTracks.length === 0 || videoTracks.length === 0) {
      alert("Missing audio or video tracks in stream");
      return;
    }

    const chunks = [];
    let options = { mimeType: "video/webm;codecs=vp8,opus" };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "video/webm" };
    }

    try {
      const combinedStream = new MediaStream([...videoTracks, ...audioTracks]);
      const mediaRecorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Recording is not supported on your browser or device.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retryRecording = () => setRecordedBlob(null);

  return (
    <div className="w-screen h-screen bg-white font-sans overflow-auto">
      {/* Top Bar */}
      <div className="flex w-full h-1">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-cyan-500" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-20 py-10">
        <div className="w-44 h-6 bg-gray-300" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-500 font-semibold bg-red-100 px-4 py-1 rounded-full border border-red-300">
            <FaClock className="text-sm" />
            <span>05:00</span>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="flex items-center gap-2">
            <img src="/images/profilepic.png" alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            <div className="text-sm text-gray-700 font-semibold">Arjun</div>
          </div>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="relative w-full mt-4 mb-6 h-6">
        <button
          onClick={handleBack}
          className="absolute left-[110px] text-gray-600 bg-white flex items-center gap-2"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <div className="flex justify-center absolute inset-0 items-center gap-4">
          <div className="w-20 h-1 bg-teal-500 rounded-full" />
          <div className="w-20 h-1 bg-teal-300 rounded-full" />
          <div className="w-20 h-1 bg-teal-100 rounded-full" />
          <div className="w-20 h-1 bg-teal-100 rounded-full" />
        </div>
        <div className="absolute right-[160px] top-0 text-sm font-semibold text-gray-700">
          (02/04)
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 md:px-20 w-full mt-20 pb-12">
        <h1 className="text-3xl text-black font-bold mb-6">Video Question</h1>

        <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-start mt-6">
          <div className="border border-teal-200 p-6 rounded-xl w-[396px] h-[410px] shadow-md overflow-auto">
            {loading ? (
              <p className="text-gray-500 text-base">Loading question...</p>
            ) : questionData ? (
              <p className="text-gray-700 text-base leading-relaxed">
                {questionData.question_text}
              </p>
            ) : (
              <p className="text-red-500 text-base">No video question found.</p>
            )}
          </div>

          {/* Video Box */}
          <div className="border w-[610px] h-[410px] rounded-xl shadow-md flex flex-col items-center justify-center bg-gray-50 p-4 relative">
            <video
              ref={videoRef}
              autoPlay
              muted={!recordedBlob}
              playsInline
              className="w-[580px] h-[329px] rounded-[5px] object-cover mb-2"
            />
            <div className="flex gap-4 mt-2 absolute bottom-4">
              {!isRecording && !recordedBlob && (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <FaVideo />
                </button>
              )}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <FaStop />
                </button>
              )}
              {!isRecording && recordedBlob && (
                <>
                  <button
                    onClick={retryRecording}
                    className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <FaRedo />
                  </button>
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <FaVideo />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full"
          >
            Submit & Continue
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative w-full">
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-black font-medium">
          Note : Do not refresh the page or you'll lose your data
        </div>
        <div className="absolute bottom-2 right-4 flex gap-2 items-end z-50">
          <div className="flex flex-col gap-2 items-start justify-end mr-2">
            <div className="flex items-end gap-1 text-gray-700">
              <FaMicrophone className="mr-1" />
              {renderSignalBars(audioLevel, "bg-orange-500")}
            </div>
            <div className="flex items-end gap-1 text-gray-700">
              <FaVideo className="mr-1" />
              {renderSignalBars(videoLevel, "bg-teal-500")}
            </div>
          </div>
          <div className="w-[112px] h-[80px] rounded-lg bg-black overflow-hidden border border-gray-300">
            <video
              ref={smallVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoQuestion;
