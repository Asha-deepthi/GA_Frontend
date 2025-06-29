import React, { useEffect, useRef, useState } from 'react';

const VideoComponent = ({
  question,
  onAnswerUpdate,
  currentStatus,
  onNext,
  isLast,
  onLocalAnswerChange
}) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (currentStatus?.answer?.url) {
      setBlobUrl(currentStatus.answer.url);
    } else if (typeof currentStatus?.answer === "string") {
      setBlobUrl(currentStatus.answer);
    } else {
      setBlobUrl(null);
    }
  }, [question.id]);

  useEffect(() => {
    if (blobUrl && onLocalAnswerChange) {
      fetch(blobUrl)
        .then(res => res.blob())
        .then(blob => {
          const filename = `video_${question.id}_${Date.now()}.webm`;
          onLocalAnswerChange({
            type: "video",
            url: blobUrl,
            blob,
            filename
          });
        });
    }
  }, [blobUrl]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setRecording(false);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Video/Audio access denied or failed:", err);
      alert("Please allow camera and microphone access.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach((track) => track.stop());
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

      <div className="mb-4">
        <video ref={videoRef} autoPlay muted className="w-full h-64 bg-black" />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={startRecording}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={recording}
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!recording}
        >
          Stop Recording
        </button>
      </div>

      {blobUrl && (
        <div className="mb-4">
          <video controls src={blobUrl} className="w-full h-64 bg-black" />
        </div>
      )}
    </div>
  );
};

export default VideoComponent;