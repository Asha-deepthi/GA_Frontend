import React, { useState, useEffect } from "react";
import SectionComponent from "./components/SectionComponent";

const apiurl = "http://localhost:8000/api/test-creation";
const answerApiUrl = "http://127.0.0.1:8000/test-execution";

const sections = [
  { id: 1, name: "Section 1" },
  { id: 2, name: "Section 2" },
  { id: 3, name: "Section 3" },
  { id: 4, name: "Section 4" },
  { id: 5, name: "Section 5" },
  { id: 6, name: "Section 6" },
  { id: 7, name: "Section 7" },
];

const SectionPage = () => {
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [fullscreenReady, setFullscreenReady] = useState(false);
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setFullscreenReady(true);
  };

  const exitFullscreen = () => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exit) {
        exit.call(document)
          .then(() => {
            setFullscreenReady(false);
            setSelectedSectionId(null);
          })
          .catch((err) => {
            console.warn("Fullscreen exit failed:", err);
            setFullscreenReady(false);
            setSelectedSectionId(null);
          });
      }
    } else {
      // Not in fullscreen — just reset state
      setFullscreenReady(false);
      setSelectedSectionId(null);
    }
  };
  useEffect(() => {
    // Clear completed sections during development
    localStorage.removeItem("completedSections");
    const storedCompleted = JSON.parse(localStorage.getItem("completedSections")) || [];
    setCompletedSections(storedCompleted);
  }, []);

  const handleSectionComplete = (sectionId) => {
    //  const updated = [...completedSections, sectionId];
    //  localStorage.setItem("completedSections", JSON.stringify(updated));
    //  setCompletedSections(updated);
    setSelectedSectionId(null); // Go back to section page
  };

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      {selectedSectionId ? (
        fullscreenReady ? (
          <>
            <button
              className="absolute top-4 left-4 px-4 py-2 bg-black text-white border border-black rounded hover:bg-white hover:text-black transition"
              onClick={exitFullscreen}
            >
              ← Back to Sections
            </button>

            <SectionComponent
            section_id={selectedSectionId}
            apiurl={apiurl}
            answerApiUrl={answerApiUrl}
            onSectionComplete={handleSectionComplete}
          />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="text-xl font-semibold text-center">
              Please enter fullscreen mode before starting the exam.
            </p>
            <button
              className="px-6 py-3 bg-black text-white text-lg rounded hover:bg-white hover:text-black border border-black transition"
              onClick={requestFullscreen}
            >
              🔳 Enter Fullscreen
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
                className={`px-6 py-3 text-lg rounded border border-black transition ${
                  completedSections.includes(section.id)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-white hover:text-black"
                }`}
                onClick={() =>
                  !completedSections.includes(section.id) &&
                  setSelectedSectionId(section.id)
                }
                // disabled={completedSections.includes(section.id)}
                disabled={false}
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