import React, { useEffect, useRef, useState, useCallback } from "react";

const isFullscreenActive = () =>
  !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

const useProctoring = ({ sessionId, answerApiUrl }) => {
  const [violationCount, setViolationCount] = useState(0);
  const lastViolationTimeRef = useRef(0);
  const webcamRef = useRef(null);
  const violationCooldownMs = 1000;

  const logViolation = useCallback(
    async ({ eventType, confidence = 1.0, remarks = "" }) => {
      if (!sessionId) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/test-execution/proctoring-logs/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session: parseInt(sessionId),
            event_type: eventType,
            confidence,
            remarks,
          }),
        });

        if (!response.ok) {
          const errorJson = await response.json().catch(() => null);
          console.error("Failed to log violation:", errorJson?.detail || `HTTP ${response.status}`);
        } else {
          console.log("Violation logged successfully");
        }
      } catch (error) {
        console.error("Error logging violation:", error.message);
      }
    },
    [sessionId]
  );

  const logWithCooldown = (eventType, remarks = "") => {
    const now = Date.now();
    if (now - lastViolationTimeRef.current > violationCooldownMs) {
      setViolationCount((prev) => prev + 1);
      logViolation({ eventType, remarks });
      lastViolationTimeRef.current = now;
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        logWithCooldown("tab_switch", "User changed tab or minimized");
      }
    };

    const handleFullscreenChange = () => {
      if (!isFullscreenActive()) {
        logWithCooldown("fullscreen_exit", "User exited fullscreen");
      }
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

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [sessionId, logViolation]);

  useEffect(() => {
    if (violationCount === 2) {
      alert("⚠ Last warning: One more violation and your exam will be flagged.");
    }
  }, [violationCount]);

  // 🎥 Take webcam screenshot every 8 seconds
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

  // Return webcamRef for use in parent component
  return { violationCount, isFullscreenActive, webcamRef };
};

export default useProctoring;
