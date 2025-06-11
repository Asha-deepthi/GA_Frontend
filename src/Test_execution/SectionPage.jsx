import React, { useState, useEffect, useRef } from "react"; // <-- add useRef
import SectionComponent from "./components/SectionComponent";
import TopHeader from "./components/TopHeader";
import SidebarLayout from "./components/SidebarLayout";
import RightPanel from "./components/RightPanel";
import CameraFeedPanel from "./components/CameraFeedPanel"; // ✅ New Component

const apiurl = "http://localhost:8000/api/test-creation";
const answerApiUrl = "http://127.0.0.1:8000/test-execution";
//const testId = 1; // or get it from props, context, or URL
const session_id = 12345;
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
  //const webcamRef = useRef(null); // 👈 shared video ref


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
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;
    if (exit) {
      exit()
        .then(() => {
          setFullscreenReady(false);
          setSelectedSectionId(null);
        })
        .catch(() => {
          setFullscreenReady(false);
          setSelectedSectionId(null);
        });
    } else {
      setFullscreenReady(false);
      setSelectedSectionId(null);
    }
  };

  useEffect(() => {
    const storedCompleted = JSON.parse(localStorage.getItem("completedSections")) || [];
    setCompletedSections(storedCompleted);
  }, []);

  const handleSectionComplete = (sectionId) => {
    setSelectedSectionId(null);
  };

  if (!selectedSectionId) {
    return (
      <div className="min-h-screen bg-white text-black">
        <TopHeader />
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-center">Select a Section</h1>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  !completedSections.includes(section.id) &&
                  setSelectedSectionId(section.id)
                }
                className={`px-6 py-3 rounded text-lg border transition ${completedSections.includes(section.id)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-white hover:text-black"
                  }`}
                disabled={completedSections.includes(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!fullscreenReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <p className="text-xl font-semibold text-center mb-6">
          Please enter fullscreen mode before starting the exam.
        </p>
        <button
          className="px-6 py-3 bg-black text-white text-lg rounded hover:bg-white hover:text-black border border-black transition"
          onClick={requestFullscreen}
        >
          🔳 Enter Fullscreen
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex flex-col">
      <TopHeader />
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="border-r p-4">
          <SidebarLayout
            selectedSectionId={selectedSectionId}
            completedSections={completedSections}
            onSelectSection={(id) => setSelectedSectionId(id)}
            //testId={testId}
          />
        </div>

        {/* Center Section with Questions */}
        <div className="flex-1 p-4 overflow-auto relative">
          <button
            className="absolute top-0 left-0 text-sm text-blue-500 underline"
            onClick={exitFullscreen}
          >
            ← Back to Sections
          </button>
          <SectionComponent
            section_id={selectedSectionId}
           session_id={session_id}
            apiurl={apiurl}
            answerApiUrl={answerApiUrl}
            onSectionComplete={handleSectionComplete}
          />
        </div>

        {/* Right Panel with Palette, Timer, and Camera Feed */}
        <div className="relative border-l p-4 flex flex-col justify-between">
          <RightPanel />
          <div className="absolute bottom-4 right-4">
           <CameraFeedPanel 
           session_id={session_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPage;