import React, { useEffect, useRef, useState } from 'react';

const AudioComponent = ({
  question,
  onAnswerUpdate,
  currentStatus,
  onNext,
  isLast,
  onLocalAnswerChange
}) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [recording, setRecording] = useState(false);
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
      // Reconstruct a blob object for local sync
      fetch(blobUrl)
        .then(res => res.blob())
        .then(blob => {
          const filename = `audio_${question.id}_${Date.now()}.webm`;
          onLocalAnswerChange({
            type: "audio",
            url: blobUrl,
            blob,
            filename
          });
        });
    }
  }, [blobUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setRecording(false);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Microphone access denied or failed:", error);
      alert("Please allow microphone access to record audio.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={startRecording}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={recording}
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!recording}
        >
          Stop Recording
        </button>
      </div>

      {blobUrl && (
        <div className="mb-4">
          <audio controls src={blobUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioComponent;