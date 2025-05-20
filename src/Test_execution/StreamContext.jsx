// src/StreamContext.jsx
import React, { createContext, useContext, useState } from 'react';

const StreamContext = createContext();

export const StreamProvider = ({ children }) => {
  const [webcamStream, setWebcamStream] = useState(null);
  const [micStream, setMicStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  // You can add permission request logic here or manage state in the Permissions component and update this context accordingly.

  return (
    <StreamContext.Provider
      value={{ webcamStream, setWebcamStream, micStream, setMicStream, screenStream, setScreenStream }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => useContext(StreamContext);
