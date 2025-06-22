import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from 'face-api.js';

const isFullscreenActive = () =>
  !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

const useProctoring = ({
  candidate_test_id,
  answerApiUrl,
  mediaStream = null,
    videoElementRef = null, // ✅ NEW

  onTabSwitch = () => {
    console.log("⚠️ Tab switch alert triggered");
    setShowTabSwitchAlert(true);
  },
  onFullscreenExit = () => {
    console.log("⚠️ Fullscreen exited");
    setShowTabSwitchAlert(true);
  },
  onLowNetwork = () => {
    console.log("⚠️ Low network alert triggered");
    setShowLowNetworkAlert(true);
  },
  onLowAudioQuality = () => {
    console.log("⚠️ Low audio alert triggered");
    setShowLowAudioAlert(true);
  },
  onLowVideoQuality = () => {
    console.log("⚠️ Low video alert triggered");
    setShowLowVideoAlert(true);
  },
  onCameraOff = () => {
    console.log("⚠️ Camera off alert triggered");
    setShowCameraOffAlert(true);
  },
}) => {
  const [violationCount, setViolationCount] = useState(0);
  const lastViolationTimeRef = useRef({}); // ✅ an object to hold keys like 'low_audio'
  const audioContextRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const videoStreamRef = useRef(null);
  const violationCooldownMs = 60000;

  const logViolation = useCallback(
    async ({ eventType, remarks = "", confidence = 0.0 }) => {
      if (!candidate_test_id) return;

      const payload = {
        candidate_test_id: candidate_test_id,
        event_type: eventType,
        confidence,
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
          const errText = await res.text();
          console.error("Violation log failed:", res.status, res.statusText, errText);
        } else {
          console.log("Violation logged successfully");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    },
    [candidate_test_id, answerApiUrl]
  );

  const logWithCooldown = (eventType, remarks = "") => {
    const now = Date.now();
    const lastTime = lastViolationTimeRef.current[eventType] || 0;

    if (now - lastTime > violationCooldownMs) {
      setViolationCount((v) => v + 1);
      logViolation({ eventType, remarks });
      lastViolationTimeRef.current[eventType] = now;
    } else {
      console.log(`Skipped ${eventType} due to cooldown`);
    }
  };


  useEffect(() => {
    if (!candidate_test_id) return;

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
  }, [candidate_test_id, logViolation, onTabSwitch, onFullscreenExit, onLowNetwork]);

  const alreadyAlertedRef = useRef(false); 
  useEffect(() => {
    if (!candidate_test_id || !mediaStream) return;
    let faceCheckInterval;
    let audioCheck, videoCheck;

    const startStreams = async () => {
      try {
const stream = mediaStream.clone(); // Fix: prevent video freezing or black screen
        if (!stream) {
          logWithCooldown("camera_off", "No shared media stream available");
          onCameraOff();
          return;
        }

        videoStreamRef.current = stream;

        // FACE API: Setup for multiple face detection

const video = videoElementRef?.current;
if (!video || !video.srcObject) {
  console.warn("Video element not ready for face-api detection.");
  return;
}

console.log("📹 Video readyState:", video.readyState);
console.log("📐 Video dimensions:", video.videoWidth, video.videoHeight);

        try {
await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector/");
await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68/");
await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition/");
console.log("✅ All models loaded");



          faceCheckInterval = setInterval(async () => {
            try {
              const detections = await faceapi
  .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
  //.withFaceLandmarks();

  console.log("Faces detected:", detections.length);
    detections.forEach((d, i) => {
      if (d?.score !== undefined) {
  console.log(`Face ${i + 1}: confidence ${d.score.toFixed(2)}`);
} else {
  console.warn(`Face ${i + 1}: no score available`, d);
}

    });
if (detections.length > 1) {
  logWithCooldown("multiple_faces", `Detected ${detections.length} faces`);
  if (!alreadyAlertedRef.current) {
  alert("⚠ Multiple persons detected! Please stay alone during the exam.");
  alreadyAlertedRef.current = true;
  setTimeout(() => {
    alreadyAlertedRef.current = false;
  }, 15000); // Reset alert flag after 15 seconds
}

}

            } catch (faceErr) {
              console.error("Face detection error:", faceErr);
            }
          }, 7000); // every 7 seconds
        } catch (modelLoadErr) {
          logWithCooldown("face_api_error", "Failed to load face-api.js models");
          console.error("FaceAPI load error:", modelLoadErr);
        }

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
      if (audioContextRef.current && audioContextRef.current.state === "running") {
        audioContextRef.current.close().catch((err) => {
          console.warn("Error closing AudioContext:", err);
        });
      }

      clearInterval(audioCheck);
      clearInterval(videoCheck);
      clearInterval(faceCheckInterval);
    };
  }, [candidate_test_id, logViolation, onLowAudioQuality, onLowVideoQuality, onCameraOff]);

  useEffect(() => {
    if (violationCount === 2) {
      alert("⚠ Last warning: One more violation and your exam will be flagged.");
    }
  }, [violationCount]);

  return { violationCount, isFullscreenActive };
};

export default useProctoring;
