import { useReactMediaRecorder } from "react-media-recorder";

const AudioComponent = ({ question }) => {
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  const handleSubmit = async () => {
    const blob = await fetch(mediaBlobUrl).then(res => res.blob());
    const formData = new FormData();
    formData.append("question_id", question.question_id);
    formData.append("question_type", question.question_type);
    formData.append("answer", blob, "audio.webm");

    await fetch("http://127.0.0.1:8000/test-execution/answers", {
      method: "POST",
      body: formData
    });
  };

  return (
    <div>
      <h3>{question.question}</h3>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {mediaBlobUrl && (
        <>
          <audio src={mediaBlobUrl} controls />
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}
    </div>
  );
};

export default AudioComponent;
