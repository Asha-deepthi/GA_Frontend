import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopHeader from "./components/TopHeader";
import SidebarLayout from "./components/SidebarLayout";
import RightPanel from "./components/RightPanel";
import CameraFeedPanel from "./components/CameraFeedPanel";
import SectionComponent from "./components/SectionComponent";

const apiurl = "http://localhost:8000/api/test-creation";
const answerApiUrl = "http://127.0.0.1:8000/api/test-execution";

export default function SectionPage() {
  const { testId } = useParams();
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [fullscreenReady, setFullscreenReady] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [realCandidateTestId, setRealCandidateTestId] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [answersStatus, setAnswersStatus] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);


  // ✅ New: Fetch candidate_test_id and sections using token
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!testId || !token) {
      console.warn("Missing testId or token");
      return;
    }

    fetch("http://localhost:8000/api/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Candidate not found or token expired");
        return res.json();
      })
      .then((user) => {
        console.log("User from /api/me/:", user);
        const candidateId = user.id;

        return fetch(
          `${apiurl}/candidate-test-id/?candidate_id=${candidateId}&test_id=${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      })
      .then((res) => {
        if (!res.ok) throw new Error("Candidate_Test not found");
        return res.json();
      })
      .then((data) => {
        setRealCandidateTestId(data.id);
        setSections(data.sections || []);
        console.log("✅ Candidate_Test loaded:", data.id, data.sections);
      })
      .catch((err) => {
        console.error("❌ Error during authentication or data fetch:", err);
      });
  }, [testId]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    elem.requestFullscreen?.() || elem.webkitRequestFullscreen?.() || elem.msRequestFullscreen?.();
    setFullscreenReady(true);
  };

  const exitFullscreen = () => {
    document.exitFullscreen?.()
      .then(() => {
        setFullscreenReady(false);
        setSelectedSectionId(null);
      })
      .catch(() => {
        setFullscreenReady(false);
        setSelectedSectionId(null);
      });
  };

  useEffect(() => {
    if (!selectedSectionId || !realCandidateTestId) return;

    const fetchTimer = async () => {
      try {
        const res = await fetch(
          `${apiurl}/get-timer/?candidate_test_id=${realCandidateTestId}&section_id=${selectedSectionId}`
        );
        if (!res.ok) throw new Error("Timer fetch failed");
        const data = await res.json();

        const parsedTime =
          typeof data.remaining_time === "string"
            ? toSeconds(data.remaining_time)
            : data.remaining_time;

        setInitialSeconds(parsedTime ?? 600);
      } catch (err) {
        const fallbackTime = localStorage.getItem(`timer_${selectedSectionId}`);
        const sectionObj = sections.find((s) => s.id === selectedSectionId);
        const fallbackMinutes = sectionObj?.time_limit || 10;
        setInitialSeconds(fallbackTime ? parseInt(fallbackTime) : fallbackMinutes * 60);
      }
    };

    fetchTimer();
  }, [selectedSectionId, realCandidateTestId, sections]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || stopTimer) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setStopTimer(true);
          localStorage.setItem(`timer_${selectedSectionId}`, 0);
          return 0;
        }

        localStorage.setItem(`timer_${selectedSectionId}`, next);
        if (next % 10 === 0) {
          fetch(`${apiurl}/save-timer/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              candidate_test_id: realCandidateTestId,
              section_id: selectedSectionId,
              remaining_time: next,
            }),
          }).catch((err) => console.error("Failed to save timer:", err));
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, selectedSectionId, stopTimer, realCandidateTestId]);

  useEffect(() => {
    if (initialSeconds !== null) setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (selectedSectionId && !stopTimer) setStopTimer(false);
  }, [selectedSectionId]);

  const handleSectionComplete = () => {
    setCompletedSections((prev) => [...prev, selectedSectionId]);
    setSelectedSectionId(null);
    setStopTimer(true);
  };

  const updateQuestionStatus = (qid, status) => {
    setAnswersStatus((prev) => ({ ...prev, [qid]: { status } }));
  };

  const getColor = (qid) => {
    const s = answersStatus[qid]?.status;
    return {
      answered: "#4CAF50",
      reviewed_with_answer: "#FF9800",
      reviewed: "#9C27B0",
      skipped: "#F44336",
    }[s] || "#CFDBE8";
  };

  const handleQuestionClick = (qid) => {
    setCurrentQuestionId(qid);
    updateQuestionStatus(qid, "visited");
  };

  if (!selectedSectionId) {
    return (
      <div className="min-h-screen bg-white text-black">
        <TopHeader />
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-center">Select a Section</h1>
            {sections.length === 0 ? (
              <p className="text-gray-500 text-center">Loading sections...</p>
            ) : (
              sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() =>
                    !completedSections.includes(sec.id) && setSelectedSectionId(sec.id)
                  }
                  className={`px-6 py-3 rounded text-lg border transition ${
                    completedSections.includes(sec.id)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-white hover:text-black"
                  }`}
                  disabled={completedSections.includes(sec.id)}
                >
                  {sec.name || `Section ${sec.id}`}
                </button>
              ))
            )}
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
        <div className="border-r p-4">
          <SidebarLayout
            selectedSectionId={selectedSectionId}
            completedSections={completedSections}
            onSelectSection={setSelectedSectionId}
            candidateTestId={realCandidateTestId}  
            testId={testId}
            refreshTrigger={refreshTrigger}
          />
        </div>

        <div className="flex-1 p-4 overflow-auto relative">
          <SectionComponent
            section_id={selectedSectionId}
            candidate_test_id={realCandidateTestId}
            test_id={testId}
            apiurl={apiurl}
            answerApiUrl={answerApiUrl}
            onSectionComplete={handleSectionComplete}
            questions={questions}
            setQuestions={setQuestions}
            currentQuestionId={currentQuestionId}
            setCurrentQuestionId={setCurrentQuestionId}
            answersStatus={answersStatus}
            setAnswersStatus={setAnswersStatus}
            refreshProgress={triggerRefresh}
          />
        </div>

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
            <CameraFeedPanel
            candidate_test_id={realCandidateTestId} />
          </div>
        </div>
      </div>
    </div>
  );
}

function toSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}
