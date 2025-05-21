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

  const handleBack = () => navigate("/audioquestion");
  const handleSubmit = () => navigate("/mcqquestion");

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
    if (webcamStream) {
      console.log("Audio tracks count:", webcamStream.getAudioTracks().length);
      console.log("Audio tracks:", webcamStream.getAudioTracks());
      console.log("Video tracks count:", webcamStream.getVideoTracks().length);
      console.log("Video tracks:", webcamStream.getVideoTracks());
    }
  }, [webcamStream]);

  useEffect(() => {
    if (videoRef.current) {
      if (recordedBlob) {
        const videoURL = URL.createObjectURL(recordedBlob);
        videoRef.current.srcObject = null;
        videoRef.current.src = videoURL;
        videoRef.current.muted = false; // unmute playback
        videoRef.current.controls = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => console.error("Playback error:", err));
        };
      } else if (webcamStream) {
        videoRef.current.src = null;
        videoRef.current.srcObject = webcamStream;
        videoRef.current.muted = true; // mute live preview
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

  const startRecording = () => {
  if (!webcamStream) {
    alert("Webcam stream not available");
    return;
  }

  const audioTracks = webcamStream.getAudioTracks();
  const videoTracks = webcamStream.getVideoTracks();

  if (audioTracks.length === 0 || videoTracks.length === 0) {
    console.error("Missing audio or video tracks");
    alert("Missing audio or video tracks in stream");
    return;
  }

  const chunks = [];
  let options = { mimeType: "video/webm;codecs=vp8,opus" };

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.warn(`${options.mimeType} not supported, falling back`);
    options = { mimeType: "video/webm" };
  }

  try {
    const combinedStream = new MediaStream([...videoTracks, ...audioTracks]);
    const mediaRecorder = new MediaRecorder(combinedStream, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedBlob(blob);
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event.error);
    };

    mediaRecorder.start();
    setIsRecording(true);
  } catch (err) {
    console.error("Failed to create MediaRecorder:", err);
    alert("Recording is not supported on your browser or device.");
  }
};


  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retryRecording = () => {
    setRecordedBlob(null);
  };

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
            <img
              src="/images/profilepic.png"
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
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
          {/* Question Box */}
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
              muted={!recordedBlob} // mute live preview, unmute playback
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
            <div className="flex items-center gap-1 text-gray-700">
              <FaMicrophone className="mr-1" />
            <div className="w-[2px] h-[3px] bg-yellow-500" />
            <div className="w-[2px] h-[9px] bg-yellow-500" />
            <div className="w-[2px] h-[15px] bg-yellow-500" />
            <div className="w-[2px] h-[21px] bg-yellow-500" />
            <div className="w-[2px] h-[27px] bg-yellow-500" />
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <FaVideo className="mr-1" />
               <div className="w-[2px] h-[3px] bg-green-500" />
            <div className="w-[2px] h-[9px] bg-green-500" />
            <div className="w-[2px] h-[15px] bg-green-500" />
            <div className="w-[2px] h-[21px] bg-green-500" />
            <div className="w-[2px] h-[27px] bg-green-500" />
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
