import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from 'face-api.js';
import BASE_URL from "../../config";

const isFullscreenActive = () =>
  !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

const useProctoring = ({
  candidate_test_id,
  mediaStream = null,
  videoElementRef = null, // ✅ NEW
  isTestActive = true,
  isCameraReady,
  onNoFace = () => { },
  onMultiplePersons = () => { },
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
  const initialDescriptorRef = useRef(null); // stores the first face
  const isActiveRef = useRef(isTestActive);
  const graceStartRef = useRef(Date.now());
  const GRACE_PERIOD_MS = 5000; // 5 seconds

  const safeAlert = (message) => {
    if (isTestActive) alert(message);
  };

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
        const res = await fetch(`${BASE_URL}/test-execution/proctoring-logs/`, {
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
    [candidate_test_id]
  );

  const logWithCooldown = (eventType, remarks = "") => {
    if (!isTestActive) return;
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
    isActiveRef.current = isTestActive;
  }, [isTestActive]);


  useEffect(() => {
    if (!candidate_test_id || !isTestActive) return;


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
  const multiFaceAlertedRef = useRef(false);
  const identityAlertedRef = useRef(false);
  const noFaceAlertedRef = useRef(false);
  const faceIntervalRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const videoIntervalRef = useRef(null);
  const streamRef = useRef(null); // ← Needed for stream stop
  const noFaceCountRef = useRef(0);

  const stopAll = () => {
    clearInterval(faceIntervalRef.current);
    clearInterval(audioIntervalRef.current);
    clearInterval(videoIntervalRef.current);

    streamRef.current?.getTracks().forEach(t => t.stop());
    if (audioContextRef.current?.state === "running") {
      audioContextRef.current.close().catch(() => { });
    }
    console.log("🛑 Proctoring fully stopped");
  };
  useEffect(() => {
    if (!candidate_test_id || !mediaStream) return;

    const startStreams = async () => {
      if (!isTestActive) return;
      try {
        let stream;
        try {
          stream = mediaStream.clone();
        } catch (err) {
          console.warn("⚠️ mediaStream.clone() failed, using original stream", err);
          stream = mediaStream;
        }

        // Fix: prevent video freezing or black screen
        streamRef.current = stream;
        const tracks = stream?.getVideoTracks();
        if (!tracks || tracks.length === 0) {
          console.warn("🚫 No video tracks found in stream, starting retry check...");
          let retries = 0;
          const maxRetries = 5;

          const retryCheck = async () => {
            retries++;
            const retryStream = mediaStream.clone();
            const tracks = retryStream?.getVideoTracks();

            if (tracks && tracks.length > 0) {
              console.log("✅ Camera available after retry attempt", retries);
              return;
            }

            if (retries >= maxRetries) {
              logWithCooldown("camera_off", "Camera video track not found after retries");
              onCameraOff();
            } else {
              setTimeout(retryCheck, 1000); // retry every 1 second
            }
          };

          retryCheck();
          return;
        }


        videoStreamRef.current = stream;

        // FACE API: Setup for multiple face detection

        const video = videoElementRef?.current;
        if (!video) {
          console.warn("Video element not found.");
          return;
        }

        if (!video.srcObject) {
          video.srcObject = stream;
          console.log("🎥 Assigned stream to video element.");
        }



        await video.play();
        console.log("📹 Video readyState:", video.readyState);
        console.log("📐 Video dimensions:", video.videoWidth, video.videoHeight);

        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector/");
          await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68/");
          await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition/");
          console.log("✅ All models loaded");

          if (!initialDescriptorRef.current) {
            let attempts = 0;
            while (!initialDescriptorRef.current && attempts < 5) {
              const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

              if (detection?.descriptor) {
                initialDescriptorRef.current = detection.descriptor;
                console.log("✅ Initial face descriptor saved.");
                break;
              } else {
                console.warn(`⚠️ Attempt ${attempts + 1}: No face detected.`);
                await new Promise((res) => setTimeout(res, 1000)); // Wait 1 second
                attempts++;
              }
            }
          }


          faceIntervalRef.current = setInterval(async () => {
            if (!isTestActive) {
              console.log("⏳ Skipping face detection: test inactive or camera not ready");
              return;
            }

            const now = Date.now();
            const graceOver = now - graceStartRef.current > GRACE_PERIOD_MS;
            if (!graceOver) {
              console.log("🕓 In grace period: skipping face violation checks");
              return;
            }

            try {
              const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.7 }))
                .withFaceLandmarks()
                .withFaceDescriptors();


              console.log("Faces detected:", detections.length);

              // 👥 Multiple Faces Check - should be FIRST
              if (detections.length > 1 && !multiFaceAlertedRef.current) {
                console.log("👥 Multiple faces detected:", detections.length);
                if (onMultiplePersons) onMultiplePersons();
                logWithCooldown("multiple_people", `Detected ${detections.length} faces`);
                multiFaceAlertedRef.current = true;
                setTimeout(() => {
                  multiFaceAlertedRef.current = false;
                }, 15000);
              }

              // 🙈 No Face Detected
              if (detections.length === 0) {
                noFaceCountRef.current += 1;
                console.log(`🙈 No face detected (count = ${noFaceCountRef.current})`);

                if (noFaceCountRef.current >= 3 && !noFaceAlertedRef.current) {
                  if (onNoFace) onNoFace();
                  logWithCooldown("face_not_detected", "No face visible in webcam feed for 3+ intervals.");
                  noFaceAlertedRef.current = true;
                  setTimeout(() => {
                    noFaceAlertedRef.current = false;
                  }, 15000);
                  noFaceCountRef.current = 0; // reset after alert
                }
              } else {
                noFaceCountRef.current = 0; // reset on successful detection
              }


              // 🔍 Identity Check (only if 1 face)
              if (detections.length === 1 && initialDescriptorRef.current) {
                const faceMatcher = new faceapi.FaceMatcher(initialDescriptorRef.current, 0.6); // tighter match
                const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);

                console.log("🧠 Face match result:", bestMatch.toString());

                if (bestMatch.label === "unknown" && !identityAlertedRef.current) {
                  safeAlert("⚠ Identity mismatch! Please stay in front of the camera.");
                  logWithCooldown("identity_mismatch", "Detected a different person.");
                  identityAlertedRef.current = true;
                  setTimeout(() => {
                    identityAlertedRef.current = false;
                  }, 15000);
                }
              }

            } catch (faceErr) {
              console.error("Face detection error:", faceErr);
            }
          }, 4000);


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

        audioIntervalRef.current = setInterval(() => {
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

        videoIntervalRef.current = setInterval(() => {
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

    if (!videoElementRef?.current) {
      console.log("⏳ Waiting for videoElementRef to be ready...");

      let retries = 0;
      const maxRetries = 10;

      const waitForVideoRef = () => {
        retries++;
        if (videoElementRef?.current) {
          const video = videoElementRef.current;

          if (video.readyState >= 2) {
            console.log("✅ Video already ready. Starting proctoring...");
            startStreams();
          } else {
            video.onloadeddata = () => {
              console.log("📸 Video loaded (after waiting). Starting proctoring stream...");
              startStreams();
            };
          }
        } else if (retries < maxRetries) {
          setTimeout(waitForVideoRef, 500);
        } else {
          console.error("❌ videoElementRef still not available after retries.");
        }
      };

      waitForVideoRef();
    } else {
      const video = videoElementRef.current;

      if (video.readyState >= 2) {
        console.log("✅ Video already ready. Starting proctoring...");
        startStreams();
      } else {
        video.onloadeddata = () => {
          console.log("📸 Video loaded. Starting proctoring stream...");
          startStreams();
        };
      }
    }


    return () => {


      videoStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current && audioContextRef.current.state === "running") {
        audioContextRef.current.close().catch((err) => {
          console.warn("Error closing AudioContext:", err);
        });
      }

      clearInterval(audioIntervalRef.current);
      clearInterval(videoIntervalRef.current);
      clearInterval(faceIntervalRef.current);

      console.log("🧹 React effect cleanup");

    };
  }, [candidate_test_id, logViolation, onLowAudioQuality, onLowVideoQuality, onCameraOff]);

  useEffect(() => { if (!isTestActive) stopAll(); }, [isTestActive]);

  useEffect(() => {
    if (violationCount === 2) {
      if (isTestActive) {
        alert("⚠ Last warning: One more violation and your exam will be flagged.");
      }
    }
  }, [violationCount]);

  return { violationCount, isFullscreenActive };
};

export default useProctoring;
