import React, { useState, useEffect } from "react";
import SectionComponent from "./components/SectionComponent";

const apiurl = "http://localhost:8000/api/test-creation";

const sections = [
  { id: 1, name: "Section 1" },
  { id: 2, name: "Section 2" },
];

const SectionPage = () => {
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [fullscreenGranted, setFullscreenGranted] = useState(false);

  const enterFullScreen = async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      setFullscreenGranted(true);
    } catch (err) {
      console.error("Failed to enter fullscreen:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && selectedSectionId) {
        setFullscreenGranted(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [selectedSectionId]);

  const handleExitTest = () => {
    setSelectedSectionId(null);
    setFullscreenGranted(false);
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col items-center justify-center p-4 relative">
      {selectedSectionId ? (
        fullscreenGranted ? (
          <>
            <button
              className="absolute top-4 left-4 px-4 py-2 bg-black text-white border border-black rounded hover:bg-white hover:text-black transition"
              onClick={handleExitTest}
            >
              ← Back to Sections
            </button>
            <SectionComponent section_id={selectedSectionId} apiurl={apiurl} />
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please enter fullscreen to continue the test</h2>
            <button
              onClick={enterFullScreen}
              className="px-6 py-3 text-lg bg-black text-white rounded hover:bg-white hover:text-black border border-black transition"
            >
              ⛶ Go Fullscreen
            </button>
          </div>
        )
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Select a Section</h1>
          <div className="flex flex-col gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                className="px-6 py-3 text-lg bg-black text-white border border-black rounded hover:bg-white hover:text-black transition"
                onClick={() => setSelectedSectionId(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SectionPage;
