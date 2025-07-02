import React, { useState, useEffect,useRef  } from "react";
import { useParams } from "react-router-dom";
import TopHeader from "./components/TopHeader";
import SidebarLayout from "./components/SidebarLayout";
import RightPanel from "./components/RightPanel";
import CameraFeedPanel from "./components/CameraFeedPanel";
import SectionComponent from "./components/SectionComponent";
import { useNavigate } from "react-router-dom";
import NoFaceAlert from "./NoFaceAlert";
import MultiplePersonsAlert from "./MultiplePersonsAlert";
import IdentityMismatchAlert from "./IdentityMismatchAlert";
import BASE_URL from "../config";
import { useCallback } from "react";
import { useContext } from "react";
import AuthContext from "../Test_creation/contexts/AuthContext";

//const apiurl = "http://localhost:8000/api/test-creation";
//const answerApiUrl = "http://127.0.0.1:8000/api/test-execution";

export default function SectionPage() {
  const { setUser } = useContext(AuthContext);
  const { testId } = useParams();
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [fullscreenReady, setFullscreenReady] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [realCandidateTestId, setRealCandidateTestId] = useState(null);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [answersStatus, setAnswersStatus] = useState({});
  const [userName, setUserName] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sharedStream, setSharedStream] = useState(null);
  //const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);
  const webcamRef = useRef(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testStarted, setTestStarted] = useState(true);
  const [showNoFaceAlert, setShowNoFaceAlert] = useState(false);
const [showMultiFaceAlert, setShowMultiFaceAlert] = useState(false);
const [cameraReady, setCameraReady] = useState(false);
const [showIdentityAlert, setShowIdentityAlert] = useState(false); 

const handleNoFace = useCallback(() => {
  setShowNoFaceAlert(true);
}, []);

const handleMultiplePersons = useCallback(() => {
  setShowMultiFaceAlert(true);
}, []);

const handleIdentityMismatch = useCallback(() => {                     
  setShowIdentityAlert(true);
}, []);

const shouldBlur = () => showNoFaceAlert || showMultiFaceAlert || showIdentityAlert;

  const fetchSectionProgress = () => {
  fetch(
    `${BASE_URL}/test-execution/candidate-section-progress/?test_id=${testId}&candidate_test_id=${realCandidateTestId}`
  )
    .then((res) => res.json())
    .then((data) => setSections(data || []))
    .catch((err) => console.error("Error fetching section progress:", err));
};

useEffect(() => {
  if (document.fullscreenElement) {
    setFullscreenReady(true);
  }
}, []);

useEffect(() => {
  if (testId && realCandidateTestId) {
    const timeoutId = setTimeout(() => {
      fetchSectionProgress();
    }, 2000); // wait 2 seconds before calling

    return () => clearTimeout(timeoutId); // clear on re-render
  }
}, [testId, realCandidateTestId]);

// Update attempted count for a section
const incrementAttempted = (sectionId, incrementBy = 1) => {
  setSections(prevSections =>
    prevSections.map(sec =>
      sec.section_id === sectionId
        ? { 
            ...sec, 
            attempted_questions: Math.max(0, (sec.attempted_questions || 0) + incrementBy)
          }
        : sec
    )
  );
};


  //  New: Fetch candidate_test_id and sections using token
  useEffect(() => {
  const token = sessionStorage.getItem("access_token");
  if (!testId || !token) {
    console.warn("Missing testId or token");
    return;
  }

  fetch(`http://localhost:8000/api/me/`, {
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
      console.log("✅ User from /api/me/:", user);
      setUserName(user.name);
      setUser(user); 
      const candidateId = user.id;
      console.log("🌍 BASE_URL:", BASE_URL);
console.log("🧪 testId:", testId);
console.log("🧑‍💻 Full fetch URL:",
  `${BASE_URL}/test-creation/candidate-test-id/?candidate_id=${candidateId}&test_id=${testId}`
);

      return fetch(
        `${BASE_URL}/test-creation/candidate-test-id/?candidate_id=${candidateId}&test_id=${testId}`,
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
      const firstSection = data.sections?.[0]?.id;
      setSelectedSectionId(firstSection || null);
      console.log("✅ Candidate_Test loaded:", data.id, data.sections);
    })
    .catch((err) => {
      console.error("❌ Error during authentication or data fetch:", err);
      setUserName("Guest");
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
          `${BASE_URL}/test-creation/get-timer/?candidate_test_id=${realCandidateTestId}&section_id=${selectedSectionId}`
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
          fetch(`${BASE_URL}/test-creation/save-timer/`, {
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
  // Add the current section to the new completed list
  const updatedCompleted = [...completedSections, selectedSectionId];
  setCompletedSections(updatedCompleted);
  setStopTimer(true);

  console.log("✅ Completed section:", selectedSectionId);
  console.log("🧩 Updated completedSections:", updatedCompleted);

  const currentIndex = sections.findIndex(
    (sec) => sec.section_id === selectedSectionId
  );
  console.log("🔢 Current section index:", currentIndex);

  // Use local updatedCompleted to find next unvisited section
  const remainingSections = sections.slice(currentIndex + 1);
  const nextSection = remainingSections.find(
    (sec) => ![...completedSections, selectedSectionId].includes(sec.section_id)
  );

  console.log("➡️ Next section to navigate to:", nextSection);

  if (nextSection) {
    console.log("✅ Navigating to section ID:", nextSection.section_id);
    setSelectedSectionId(nextSection.section_id);
  } else {
    console.log("🎉 All sections complete");
    setSharedStream(null);
  if (webcamRef.current?.srcObject) {
    webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
    webcamRef.current.srcObject = null;
  }
  setTestStarted(false);
    setTestCompleted(true);
    setSelectedSectionId(null);
    setStopTimer(true);
    alert("✅ All sections completed! Submitting test...");
   // navigate(`/submission/${realCandidateTestId}`);
   navigate(`/test/${testId}/section/${selectedSectionId}/review`);
  }
};

  const updateQuestionStatus = (qid, status, answer = null) => {
    setAnswersStatus((prev) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        status,
        ...(answer !== null && { answer }), // only overwrite answer if provided
      },
    }));
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
    //updateQuestionStatus(qid, "visited");
  };

  {/*if (!fullscreenReady) {
    return (
      <div className="min-h-screen bg-white text-[#00A398]">
      <TopHeader userName={userName} />
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-3xl font-bold mb-4">Start Your Test</h1>
            <button
              onClick={requestFullscreen}
              className="px-6 py-3 bg-[#00A398] text-white text-lg rounded-full hover:bg-white hover:text-[#00A398] border border-[#00A398] transition"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  } */}

if (testCompleted) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white text-[#00A398]">
      <h1 className="text-2xl font-bold">✅ Test completed. Submitting...</h1> 
    </div>
  );
}

  return (
  <>
    {shouldBlur() && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    {showNoFaceAlert && (
      <NoFaceAlert
        onDismiss={() => setShowNoFaceAlert(false)}
        onContinue={() => {
          setShowNoFaceAlert(false);
          requestFullscreen();
        }}
      />
    )}

    {showMultiFaceAlert && (
      <MultiplePersonsAlert
        onDismiss={() => setShowMultiFaceAlert(false)}
        onContinue={() => {
          setShowMultiFaceAlert(false);
          requestFullscreen();
        }}
      />
    )}

{showIdentityAlert && (                                           
      <IdentityMismatchAlert
       onDismiss={() => setShowIdentityAlert(false)}
       onContinue={() => {
          setShowIdentityAlert(false);
         requestFullscreen();
        }}
      />
    )}
  </div>
)}

    <div className={`h-screen w-screen overflow-hidden bg-white flex flex-col transition-all duration-300 ${shouldBlur() ? "blur-sm brightness-50" : ""}`}>
      <TopHeader userName={userName} />
      <div className="flex flex-1">
        <div className="border-r p-4">
          <SidebarLayout
            selectedSectionId={selectedSectionId}
            completedSections={completedSections}
            onSelectSection={setSelectedSectionId}
            candidateTestId={realCandidateTestId}
            testId={testId}
            sections={sections}
          />
        </div>

        <div className="flex-1 p-4 overflow-auto relative">
          {testStarted && !testCompleted && (
            <SectionComponent
              section_id={selectedSectionId}
              candidate_test_id={realCandidateTestId}
              test_id={testId}
              onSectionComplete={handleSectionComplete}
              questions={questions}
              setQuestions={setQuestions}
              currentQuestionId={currentQuestionId}
              setCurrentQuestionId={setCurrentQuestionId}
              answersStatus={answersStatus}
              setAnswersStatus={setAnswersStatus}
              onQuestionAttempted={incrementAttempted}
              mediaStream={sharedStream}
              videoRef={webcamRef}
              isTestActive={testStarted && !testCompleted}
              onNoFace={handleNoFace}                     
              onMultiplePersons={handleMultiplePersons} 
              onIdentityMismatch={handleIdentityMismatch}
              isCameraReady={cameraReady}
            />
          )}
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
            {testStarted && !testCompleted && (
              <CameraFeedPanel
                candidate_test_id={realCandidateTestId}
                setStream={setSharedStream}
                ref={webcamRef}
                onReady={() => setCameraReady(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </>
);

}

function toSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}
