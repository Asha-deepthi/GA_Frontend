import { useEffect, useRef, useState } from 'react';

const VideoComponent = ({ question, onAnswerUpdate, currentStatus, onNext }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    setBlobUrl(currentStatus?.answer || null);
  }, [question.question_id]);

  const startRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(mediaStream);
    videoRef.current.srcObject = mediaStream;

    mediaRecorderRef.current = new MediaRecorder(mediaStream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach((track) => track.stop());
  };

  const handleAction = (markForReview = false) => {
    const hasAnswer = !!blobUrl;
    const status = markForReview
      ? hasAnswer ? 'reviewed_with_answer' : 'reviewed'
      : hasAnswer ? 'answered' : 'skipped';

    onAnswerUpdate(question.question_id, {
      answer: hasAnswer ? blobUrl : null,
      markedForReview: markForReview,
      status
    });
    onNext();
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <div className="mb-4">
        <video ref={videoRef} autoPlay className="w-full h-64 bg-black" />
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={startRecording} className="bg-blue-500 text-white px-4 py-2 rounded">
          Start Recording
        </button>
        <button onClick={stopRecording} className="bg-red-500 text-white px-4 py-2 rounded">
          Stop Recording
        </button>
      </div>

      {blobUrl && (
        <div className="mb-4">
          <video controls src={blobUrl} className="w-full h-64 bg-black" />
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={() => handleAction(false)} className="bg-green-600 text-white px-4 py-2 rounded">
          Save & Next
        </button>
        <button onClick={() => handleAction(true)} className="bg-purple-600 text-white px-4 py-2 rounded">
          Mark for Review & Next
        </button>
      </div>
    </div>
  );
};

export default VideoComponent;
