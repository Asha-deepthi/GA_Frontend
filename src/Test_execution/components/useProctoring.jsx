import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const isFullscreenActive = () =>
  !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

const useProctoring = ({
  sessionId,
  answerApiUrl,
  onTabSwitch       = () => {},
  onFullscreenExit  = () => {},
  onLowNetwork      = () => {},
  onLowAudioQuality = () => {},
  onLowVideoQuality = () => {},
  onCameraOff       = () => {}
}) => {
  const [violationCount, setViolationCount] = useState(0);
  const lastViolationTimeRef = useRef(0);
  const webcamRef = useRef(null);
  const audioContextRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const videoStreamRef = useRef(null);
  const violationCooldownMs = 1000;


  const logViolation = useCallback(async ({ eventType, remarks = "", confidence = 0.0 }) => {
  if (!sessionId) return;

  const payload = {
    session_id: sessionId,            // field name corrected
    event_type: eventType,            // must be one of allowed choices
    confidence: confidence,           // must send some float (required)
    remarks,
  };
  console.log("Logging violation with payload:", payload);

  try {
    const res = await fetch(`${answerApiUrl}/proctoring-logs/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errText = await res.text();
      console.error("Violation log failed:", res.status, res.statusText, errText);
    } else {
      console.log("Violation logged successfully");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}, [sessionId, answerApiUrl]);


  const logWithCooldown = (eventType, remarks = "") => {
    const now = Date.now();
    if (now - lastViolationTimeRef.current > violationCooldownMs) {
      setViolationCount((v) => v + 1);
      logViolation({ eventType, remarks });
      lastViolationTimeRef.current = now;
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        logWithCooldown("tab_switch", "User changed tab or minimized");
        onTabSwitch();
      }
    };

    const handleFullscreenChange = () => {
      if (!isFullscreenActive()) {
        logWithCooldown("fullscreen_exit", "User exited fullscreen");
        onFullscreenExit();
      }
    };

    const handleOffline = () => {
      logWithCooldown("low_network", "Network connection lost");
      onLowNetwork();
    };

    const handleBlur = () => {
      logWithCooldown("WindowBlur", "User switched away from browser (e.g., to WhatsApp)");
    };

    const handleFocus = () => {
      console.log("Window focused again");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("offline", handleOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("offline", handleOffline);
    };
  }, [sessionId, logViolation, onTabSwitch, onFullscreenExit, onLowNetwork]);

  useEffect(() => {
  if (!sessionId) return;

  let audioCheck, videoCheck;

  const startStreams = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoStreamRef.current = stream;
      if (webcamRef.current) webcamRef.current.srcObject = stream;

      const ac = new AudioContext();
      const mic = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      mic.connect(analyser);

      audioContextRef.current = ac;
      micAnalyserRef.current = analyser;

      audioCheck = setInterval(() => {
        const data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i of data) sum += (i - 128) * (i - 128);
        const rms = Math.sqrt(sum / data.length);
        if (rms < 10) {
          logWithCooldown("low_audio", "Audio signal too low");
          onLowAudioQuality();
        }
      }, 5000);

      videoCheck = setInterval(() => {
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        if (settings.frameRate && settings.frameRate < 10) {
          logWithCooldown("low_video", "Video frame rate too low");
          onLowVideoQuality();
        }
      }, 5000);

    } catch (err) {
      logWithCooldown("camera_off", "Camera unavailable");
      onCameraOff();
    }
  };

  startStreams();

  return () => {
    videoStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    clearInterval(audioCheck);
    clearInterval(videoCheck);
  };
}, [sessionId, logViolation, onLowAudioQuality, onLowVideoQuality, onCameraOff]);


  useEffect(() => {
    if (violationCount === 2) {
      alert("⚠ Last warning: One more violation and your exam will be flagged.");
    }
  }, [violationCount]);

  useEffect(() => {
    const takeWebcamScreenshot = async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const blob = await fetch(imageSrc).then((res) => res.blob());
          const formData = new FormData();
          formData.append("session", sessionId);
          formData.append("screenshot", blob, `webcam_${Date.now()}.jpg`);

          await fetch(`http://127.0.0.1:8000/test-execution/proctoring-screenshots/`, {
            method: "POST",
            body: formData,
          });
          console.log("📸 Webcam screenshot uploaded.");
        }
      }
    };

    const interval = setInterval(takeWebcamScreenshot, 8000);
    return () => clearInterval(interval);
  }, [sessionId]);

  return { violationCount, isFullscreenActive, webcamRef };
};

export default useProctoring;
