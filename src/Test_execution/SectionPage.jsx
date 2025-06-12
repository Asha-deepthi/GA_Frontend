import React, { useState, useEffect } from "react";
import TopHeader       from "./components/TopHeader";
import SidebarLayout   from "./components/SidebarLayout";
import RightPanel      from "./components/RightPanel";
import CameraFeedPanel from "./components/CameraFeedPanel";
import SectionComponent from "./components/SectionComponent";
import TestSummaryScreen from "./TestSummaryScreen";

const apiurl       = "http://localhost:8000/api/test-creation";
const answerApiUrl = "http://127.0.0.1:8000/test-execution";
const session_id   = 528;

const sections = [
  { id: 1, name: "Section 1" },
  { id: 2, name: "Section 2" },
  { id: 3, name: "Section 3" },
  { id: 4, name: "Section 4" },
  { id: 5, name: "Section 5" },
  { id: 6, name: "Section 6" },
  { id: 7, name: "Section 7" },
];

export default function SectionPage() {
  // Core UI state
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [fullscreenReady, setFullscreenReady]     = useState(false);
const [stopTimer, setStopTimer] = useState(false);
const [initialSeconds, setInitialSeconds] = useState(null);
const [timeLeft, setTimeLeft] = useState(null);

  // Pallette/Question state (lifted up)
  const [questions, setQuestions]                 = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [answersStatus, setAnswersStatus]         = useState({});

  // Load completedSections from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("completedSections")) || [];
    setCompletedSections(stored);
  }, []);

  // Fullscreen request/exit handlers
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    setFullscreenReady(true);
  };
  const exitFullscreen = () => {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;
    if (exit) {
      exit().then(() => {
        setFullscreenReady(false);
        setSelectedSectionId(null);
      });
    } else {
      setFullscreenReady(false);
      setSelectedSectionId(null);
    }
  };

  useEffect(() => {
  if (!selectedSectionId) return;

  const fetchTimer = async () => {
    try {
      const res = await fetch(`${apiurl}/get-timer/?session_id=${session_id}&section_id=${selectedSectionId}`);
      if (!res.ok) throw new Error(`404 or server error`);
      const data = await res.json();
      console.log("Fetched timer from backend:", data);

      const remaining_time = data.remaining_time;

      // If remaining_time is in HH:MM:SS string format, convert it
      const parsedTime = typeof remaining_time === "string"
        ? toSeconds(remaining_time)
        : remaining_time;

      setInitialSeconds(parsedTime ?? 600);
    } catch (err) {
      console.error("Failed to fetch timer:", err);

      // If no timer in backend, fallback to localStorage or default
      const local = localStorage.getItem(`timer_${selectedSectionId}`);

      const fallbackSection = sections.find((s) => s.id === selectedSectionId);
      const fallbackTimeMinutes = fallbackSection?.time_limit ?? 10;

      setInitialSeconds(local ? parseInt(local) : fallbackTimeMinutes * 60);
    }
  };

  fetchTimer();
}, [selectedSectionId]);


useEffect(() => {
  if (timeLeft === null || timeLeft <= 0) return;

  const timerId = setInterval(() => {
    setTimeLeft((prev) => {
      const next = prev - 1;
      console.log(`Saving time for section ${selectedSectionId}: ${next}s left`);
      localStorage.setItem(`timer_${selectedSectionId}`, next);

      if (next % 10 === 0) {
        fetch(`${apiurl}/save-timer/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id,
            section_id: selectedSectionId,
            remaining_time: next,
          }),
        }).catch((err) => console.error("Failed to save timer:", err));
      }

      return next;
    });
  }, 1000);

  return () => clearInterval(timerId);
}, [timeLeft, selectedSectionId]);


useEffect(() => {
  if (initialSeconds !== null) {
    setTimeLeft(initialSeconds);
  }
}, [initialSeconds]);
useEffect(() => {
  if (selectedSectionId) {
    setStopTimer(false);
  }
}, [selectedSectionId]);

  // Mark as complete and reset to section list
  const handleSectionComplete = (sectionId) => {
    // You could append to completedSections here if desired.
    setSelectedSectionId(null);
    setStopTimer(true); 
  };

  // Question palette helpers
  const updateQuestionStatus = (questionId, status) => {
    setAnswersStatus((prev) => ({ ...prev, [questionId]: { status } }));
  };
  const getColor = (qid) => {
    const s = answersStatus[qid]?.status;
    switch (s) {
      case "answered":           return "#4CAF50";
      case "reviewed_with_answer": return "#FF9800";
      case "reviewed":           return "#9C27B0";
      case "skipped":            return "#F44336";
      default:                   return "#CFDBE8";
    }
  };
  const handleQuestionClick = (qid) => {
    setCurrentQuestionId(qid);
    updateQuestionStatus(qid, "visited");
  };

  // 1) Section selection screen
  if (!selectedSectionId) {
    return (
      <div className="min-h-screen bg-white text-black">
        <TopHeader />
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-center">Select a Section</h1>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() =>
                  !completedSections.includes(sec.id) &&
                  setSelectedSectionId(sec.id)
                }
                className={`px-6 py-3 rounded text-lg border transition ${
                  completedSections.includes(sec.id)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-white hover:text-black"
                }`}
                disabled={completedSections.includes(sec.id)}
              >
                {sec.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2) Fullscreen prompt
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

  // 3) Main exam layout
  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex flex-col">
      <TopHeader />
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="border-r p-4">
          <SidebarLayout
            selectedSectionId={selectedSectionId}
            completedSections={completedSections}
            onSelectSection={setSelectedSectionId}
          />
        </div>

        {/* Center SectionComponent */}
        <div className="flex-1 p-4 overflow-auto relative">
          <SectionComponent
            section_id={selectedSectionId}
            session_id={session_id}
            apiurl={apiurl}
            answerApiUrl={answerApiUrl}
            onSectionComplete={handleSectionComplete}

            // Pass lifted state & setters
            questions={questions}
            setQuestions={setQuestions}
            currentQuestionId={currentQuestionId}
            setCurrentQuestionId={setCurrentQuestionId}
            answersStatus={answersStatus}
            setAnswersStatus={setAnswersStatus}
          />
          <TestSummaryScreen
    section_id={selectedSectionId}
            session_id={session_id}
  />
        </div>

        {/* Right Panel & Camera */}
        <div className="relative border-l p-4 flex flex-col justify-between">
          <RightPanel
            questions={questions}
            currentQuestionId={currentQuestionId}
            onQuestionClick={handleQuestionClick}
            getColor={getColor}
            stopTimer={stopTimer}
            initialSeconds={initialSeconds}
          />
          <div className="absolute bottom-4 right-4">
            <CameraFeedPanel session_id={session_id} />
          </div>
        </div>
      </div>
    </div>
  );
}