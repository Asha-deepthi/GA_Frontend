import React, { useEffect, useRef, useState } from "react";
import { Mic, Video } from "lucide-react";

const getSignalLevel = (value) => {
  if (value > 0.7) return 3;
  if (value > 0.3) return 2;
  return 1;
};

const SignalBars = ({ level }) => (
  <div className="flex items-end gap-[2px] w-[36px] h-[20px]">
    {[1, 2, 3].map((bar) => (
      <div
        key={bar}
        className={`w-[6px] rounded-sm ${bar <= level ? "bg-green-500" : "bg-gray-300"}`}
        style={{ height: `${bar * 6}px` }}
      />
    ))}
  </div>
);

const CameraFeedPanel = ({ candidate_test_id }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [audioStrength, setAudioStrength] = useState(0.1);
  const [videoStrength, setVideoStrength] = useState(0.8);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // AUDIO ANALYSIS
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        const updateAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioStrength(Math.min(avg / 100, 1));
          requestAnimationFrame(updateAudio);
        };
        updateAudio();

        // VIDEO QUALITY SCORE
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        const resolutionScore = ((settings.width || 0) * (settings.height || 0)) / (1920 * 1080);
        const frameRateScore = (settings.frameRate || 0) / 30;
        const overallScore = Math.min((resolutionScore + frameRateScore) / 2, 1);
        setVideoStrength(overallScore);

        setTimeout(() => setReady(true), 1000);
      })
      .catch((err) => {
        console.error("❌ Failed to access media devices", err);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!ready || !videoRef.current || !canvasRef.current || !candidate_test_id) return;

      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, 150, 100);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");

      console.log("📸 Screenshot base64:", dataUrl.substring(0, 100));

      try {
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const formData = new FormData();
        formData.append("candidate_test_id", candidate_test_id);
        formData.append("screenshot", blob, `webcam_${Date.now()}.jpg`);

        await fetch("http://127.0.0.1:8000/api/test-execution/proctoring-screenshots/", {
          method: "POST",
          body: formData,
        });

        console.log("✅ Screenshot uploaded");
      } catch (err) {
        console.error("❌ Screenshot upload failed", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [ready,candidate_test_id]);

  return (
    <div className="fixed bottom-4 right-4 flex" style={{ width: "270px", height: "100px", gap: "15px" }}>
      {/* Signal Bars */}
      <div className="flex flex-col justify-center gap-4 w-[66px]">
        <div className="flex items-center gap-[10px]">
          <Mic size={20} className="text-gray-600" />
          <SignalBars level={getSignalLevel(audioStrength)} />
        </div>
        <div className="flex items-center gap-[10px]">
          <Video size={20} className="text-gray-600" />
          <SignalBars level={getSignalLevel(videoStrength)} />
        </div>
      </div>

      {/* Webcam Preview */}
      <div className="relative border border-gray-300 shadow-sm bg-black rounded-[5px] overflow-hidden">
        <video
          ref={videoRef}
          width={150}
          height={100}
          autoPlay
          muted
          playsInline
          className="object-cover"
        />
        <canvas ref={canvasRef} width={150} height={100} style={{ display: "none" }} />
        
      </div>
    </div>
  );
};

export default CameraFeedPanel;
