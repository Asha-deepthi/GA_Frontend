import React, { useState, useEffect, useRef } from "react";
import MultipleChoiceComponent from "./MultipleChoiceComponent";
import FillInTheBlankComponent from "./FillInTheBlankComponent";
import IntegerComponent from "./IntegerComponent";
import SubjectiveComponent from "./SubjectiveComponent";
import AudioComponent from "./AudioComponent";
import VideoComponent from "./VideoComponent";
import Textcomponent from "./Textcomponent";
import Passagecomponent from "./Passagecomponent";
import useProctoring from "./useProctoring";
import TabSwitchAlert from "../TabSwitchAlert";
import CameraOffAlert from "../CameraOffAlert";
import LowNetworkAlert from "../LowNetworkAlert";
//import AudioAlert from "../AudioAlert";
import VideoAlert from "../VideoAlert";

const SECTION_DURATION = 5 * 60; // default in seconds

export default function SectionComponent({
  section_id,
  session_id,
  apiurl,
  answerApiUrl,
  onSectionComplete,

  // lifted state & setters from SectionPage
  questions,
  setQuestions,
  currentQuestionId,
  setCurrentQuestionId,
  answersStatus,
  setAnswersStatus,
}) {
  // --- Proctoring & Alerts State ---
  const [showTabSwitchAlert, setShowTabSwitchAlert] = useState(false);
  const [showLowNetworkAlert, setShowLowNetworkAlert] = useState(false);
  const [showLowAudioAlert, setShowLowAudioAlert] = useState(false);
  const [showLowVideoAlert, setShowLowVideoAlert] = useState(false);
  const [showCameraOffAlert, setShowCameraOffAlert] = useState(false);

  // Hook for proctoring events & violation count
  const { violationCount, webcamRef } = useProctoring({
    sessionId: session_id,
    answerApiUrl,
    onTabSwitch: () => setShowTabSwitchAlert(true),
    onFullscreenExit: () => setShowTabSwitchAlert(true),
    onLowNetwork: () => setShowLowNetworkAlert(true),
    onLowAudioQuality: () => setShowLowAudioAlert(true),
    onLowVideoQuality: () => setShowLowVideoAlert(true),
    onCameraOff: () => setShowCameraOffAlert(true),
  });

  // --- Timer State ---
  const [timeLeft, setTimeLeft] = useState(SECTION_DURATION);
  const [defaultTime, setDefaultTime] = useState(SECTION_DURATION);

  // --- Answer Save Queue ---
  const requestQueue = useRef([]);
  const isProcessingQueue = useRef(false);
  const processQueue = async () => {
    if (isProcessingQueue.current) return;
    isProcessingQueue.current = true;
    while (requestQueue.current.length) {
      const { url, options } = requestQueue.current.shift();
      try {
        await fetch(url, options);
      } catch (err) {
        console.error("Request failed:", err);
      }
    }
    isProcessingQueue.current = false;
  };
  const enqueueRequest = (url, options) => {
    requestQueue.current.push({ url, options });
    processQueue();
  };

  // --- Fetch Section Questions & Saved Answers ---
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        // 1) Fetch questions
        const res = await fetch(
          `${apiurl}/sections/${section_id}/questions/`
        );
        const data = await res.json();
        // add numbering
        const numbered = data.map((q, i) => ({ ...q, number: i + 1 }));
        setQuestions(numbered);
        setCurrentQuestionId(numbered[0]?.id || null);
        // set default timer from API metadata if available
        setDefaultTime(
          (data[0]?.section?.time_limit || SECTION_DURATION / 60) * 60
        );
        // 2) Fetch saved answers
        const ansRes = await fetch(
          `${answerApiUrl}/get-answers/?session_id=${session_id}&section_id=${section_id}`
        );
        const ansData = await ansRes.json();
        const backendMap = {};
        ansData.forEach((a) => {
          backendMap[a.question_id] = {
            answer: a.answer_text || null,
            markedForReview: a.marked_for_review,
            status: a.status,
          };
        });
        setAnswersStatus((prev) => ({ ...prev, ...backendMap }));
      } catch (err) {
        console.error("Error fetching section data:", err);
      }
    };
    fetchSectionData();
  }, [section_id]);

  // --- Sync Timer from Backend or Local ---
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await fetch(
          `${apiurl}/get-timer/?session_id=${session_id}&section_id=${section_id}`
        );
        const { remaining_time } = await res.json();
        const local = localStorage.getItem(`timer_${section_id}`);
        const start =
          remaining_time != null
            ? remaining_time
            : local
            ? parseInt(local)
            : defaultTime;
        setTimeLeft(start);
      } catch {
        const local = localStorage.getItem(`timer_${section_id}`);
        setTimeLeft(local ? parseInt(local) : defaultTime);
      }
    };
    fetchTimer();
  }, [defaultTime, section_id]);

  // --- Countdown ---
  useEffect(() => {
    // if (timeLeft <= 0) {
    //   handleFinalSubmit();
    //   return;
    // }
    const timerId = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        localStorage.setItem(`timer_${section_id}`, next);
        if (next % 10 === 0) {
          enqueueRequest(`${apiurl}/save-timer/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id,
              section_id,
              remaining_time: next,
            }),
          });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // --- Debounced Answer Saving ---
  const latestAnswer = useRef(null);
  const debounceId = useRef(null);
  const sendAnswer = () => {
    if (!latestAnswer.current) return;
    const { url, options } = latestAnswer.current;
    enqueueRequest(url, options);
    latestAnswer.current = null;
  };
  const debouncedSave = () => {
    clearTimeout(debounceId.current);
    debounceId.current = setTimeout(sendAnswer, 500);
  };

  const updateAnswer = (question_id, payload) => {
    const hasAns = payload.answer && payload.answer !== "";
    const status = payload.markedForReview
      ? hasAns
        ? "reviewed_with_answer"
        : "reviewed"
      : hasAns
      ? "answered"
      : "skipped";
    // update local state
    setAnswersStatus((prev) => ({
      ...prev,
      [question_id]: {
        answer: hasAns ? payload.answer : null,
        markedForReview: payload.markedForReview,
        status,
      },
    }));
    localStorage.setItem(
      `answers_${section_id}`,
      JSON.stringify({
        ...answersStatus,
        [question_id]: {
          answer: hasAns ? payload.answer : null,
          markedForReview: payload.markedForReview,
          status,
        },
      })
    );
    // prepare form
    const form = new FormData();
    form.append("session_id", session_id);
    form.append("question_id", question_id);
    form.append("question_type", payload.type);
    form.append("section_id", section_id);
    if (hasAns) {
      if (payload.answer.type === "audio")
        form.append("audio_file", payload.answer.blob, payload.answer.filename);
      else if (payload.answer.type === "video")
        form.append("video_file", payload.answer.blob, payload.answer.filename);
      else form.append("answer_text", payload.answer);
    }
    form.append("marked_for_review", payload.markedForReview);
    form.append("status", status);
    latestAnswer.current = {
      url: `${answerApiUrl}/answers/`,
      options: { method: "POST", body: form },
    };
    debouncedSave();
  };

  // --- Final Submit: ensure all questions have a status ---
  const handleFinalSubmit = async () => {
    for (const q of questions) {
      if (!answersStatus[q.id]?.answer) {
        const form = new FormData();
        form.append("session_id", session_id);
        form.append("question_id", q.id);
        form.append("question_type", q.type);
        form.append("section_id", section_id);
        form.append("answer_text", "");
        form.append("status", "skipped");
        enqueueRequest(`${answerApiUrl}/answers/`, {
          method: "POST",
          body: form,
        });
      }
    }
    localStorage.removeItem(`answers_${section_id}`);
    onSectionComplete(section_id);
  };

  // --- getStatusColor for any remaining UI usage ---
  const getStatusColor = (qid) => {
    const s = answersStatus[qid]?.status;
    if (s === "answered") return "bg-green-500";
    if (s === "reviewed_with_answer") return "bg-orange-500";
    if (s === "reviewed") return "bg-violet-500";
    if (s === "skipped") return "bg-red-500";
    return "bg-gray-300";
  };

  // --- Render question by type, navigators, alerts, webcam ---
  const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
  const current = questions[currentIndex];

  return (
    <div className="p-6 relative">
      {/* Top bar: violations + timer */}
      <div className="text-right text-lg font-bold mb-4">
        <p className="text-sm text-red-600">
          Violations: {violationCount}
        </p>
        <p>
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>
      </div>

      {/* Question */}
      <div className="border p-4 rounded shadow mb-4">
        {!current ? (
          <p>Loading question…</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">
              Question {current.number} of {questions.length}
            </h2>
            <p className="mb-4">{current.question_text}</p>
            {(() => {
              const props = {
                question: current,
                currentStatus: answersStatus[current.id] || {},
                onAnswerUpdate: updateAnswer,
                onNext: () =>
                  setCurrentQuestionId(questions[currentIndex + 1]?.id),
              };
              const isLast = currentIndex === questions.length - 1;
              switch (current.type) {
                case "multiple-choice":
                  return <MultipleChoiceComponent {...props} isLast={isLast} />;
                case "fill-in-blanks":
                  return <FillInTheBlankComponent {...props} isLast={isLast} />;
                case "integer":
                  return <IntegerComponent {...props} isLast={isLast} />;
                case "subjective":
                  return <SubjectiveComponent {...props} isLast={isLast} />;
                case "audio":
                  return <AudioComponent {...props} isLast={isLast} />;
                case "video":
                  return <VideoComponent {...props} isLast={isLast} />;
                case "text":
                  return <Textcomponent {...props} isLast={isLast} />;
                case "passage":
                  return <Passagecomponent {...props} isLast={isLast} />;
                default:
                  return <p>Unsupported question type: {current.type}</p>;
              }
            })()}
          </>
        )}
      </div>

      {/* Alerts */}
      {showTabSwitchAlert && (
        <TabSwitchAlert
          onDismiss={() => setShowTabSwitchAlert(false)}
          onContinue={() => setShowTabSwitchAlert(false)}
        />
      )}
      {showLowNetworkAlert && (
        <LowNetworkAlert onDismiss={() => setShowLowNetworkAlert(false)} />
      )}
      {/* {showLowAudioAlert && (
        <AudioAlert onDismiss={() => setShowLowAudioAlert(false)} />
      )} */}
      {showLowVideoAlert && (
        <VideoAlert onDismiss={() => setShowLowVideoAlert(false)} />
      )}
      {showCameraOffAlert && (
        <CameraOffAlert
          onDismiss={() => setShowCameraOffAlert(false)}
          onEnable={() => setShowCameraOffAlert(false)}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          disabled={currentIndex <= 0}
          onClick={() =>
            setCurrentQuestionId(questions[currentIndex - 1]?.id)
          }
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentQuestionId(questions[currentIndex + 1]?.id)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Submit Section
          </button>
        )}
      </div>

      {/* Webcam Feed */}
      
    </div>
  );
}