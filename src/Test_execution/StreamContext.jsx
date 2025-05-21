import React, { createContext, useContext, useState, useEffect } from "react";

const StreamContext = createContext();

export const StreamProvider = ({ children }) => {
  const [webcamStream, setWebcamStream] = useState(null); // video + audio
  const [micStream, setMicStream] = useState(null); // audio only
  const [screenStream, setScreenStream] = useState(null); // screen share

  // Request webcam + mic together (called in Permission page)
  const requestWebcamAndMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const hasAudio = stream.getAudioTracks().length > 0;
      const hasVideo = stream.getVideoTracks().length > 0;

      if (hasVideo && hasAudio) {
        setWebcamStream(stream);
        setMicStream(new MediaStream(stream.getAudioTracks())); // mic-only if needed
        return true;
      } else {
        console.warn("Webcam or mic missing in stream.");
        return false;
      }
    } catch (err) {
      console.error("Error accessing webcam/mic:", err);
      return false;
    }
  };

  const getScreenStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setScreenStream(stream);
    } catch (err) {
      console.error("Screen share access failed:", err);
    }
  };

  // Cleanup streams on unmount or change
  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
      }
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [webcamStream, micStream, screenStream]);

  return (
    <StreamContext.Provider
      value={{
        webcamStream,
        setWebcamStream,
        micStream,
        setMicStream,
        screenStream,
        setScreenStream,
        getScreenStream,
        requestWebcamAndMic,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => useContext(StreamContext);
