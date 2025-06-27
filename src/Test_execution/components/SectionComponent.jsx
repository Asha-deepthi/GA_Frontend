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
import { useParams } from 'react-router-dom';
import BASE_URL from "../../config";

//const SECTION_DURATION = 5 * 60; // default in seconds

export default function SectionComponent({
  section_id,
  test_id,
  candidate_test_id,
  onSectionComplete,
  mediaStream,
  // lifted state & setters from SectionPage
  questions,
  setQuestions,
  currentQuestionId,
  setCurrentQuestionId,
  answersStatus,
  setAnswersStatus,
  onQuestionAttempted,
    videoRef, // ✅ Add this
isTestActive, 
onNoFace,
  onMultiplePersons,
  isCameraReady,
}) {
  // --- Proctoring & Alerts State ---
  const [showTabSwitchAlert, setShowTabSwitchAlert] = useState(false);
  const [showLowNetworkAlert, setShowLowNetworkAlert] = useState(false);
  //const [showLowAudioAlert, setShowLowAudioAlert] = useState(false);
  const [showLowVideoAlert, setShowLowVideoAlert] = useState(false);
  const [showCameraOffAlert, setShowCameraOffAlert] = useState(false);
  //const { testId } = useParams();
  const [loading, setLoading] = useState(true); 

 const [blurOverlayActive, setBlurOverlayActive] = useState(false);

useEffect(() => {
  const isAnyAlertShown = showTabSwitchAlert ||
    showLowNetworkAlert ||
    //showLowAudioAlert ||
    showLowVideoAlert ||
    showCameraOffAlert;
  setBlurOverlayActive(isAnyAlertShown);
}, [
  showTabSwitchAlert,
  showLowNetworkAlert,
  //showLowAudioAlert,
  showLowVideoAlert,
  showCameraOffAlert
]);


  // Hook for proctoring events & violation count
  const { violationCount, webcamRef } = useProctoring({
    candidate_test_id: candidate_test_id,
     mediaStream, 
     videoElementRef: videoRef,
    onTabSwitch: () => setShowTabSwitchAlert(true),
    onFullscreenExit: () => setShowTabSwitchAlert(true),
    onLowNetwork: () => setShowLowNetworkAlert(true),
    //onLowAudioQuality: () => setShowLowAudioAlert(true),
    onLowVideoQuality: () => setShowLowVideoAlert(true),
    onCameraOff: () => setShowCameraOffAlert(true),
    isTestActive,
    onNoFace,           // 👈 Add this
  onMultiplePersons, 
  isCameraReady,
  });


  // --- Timer State ---
  // const [timeLeft, setTimeLeft] = useState(SECTION_DURATION);
  //const [defaultTime, setDefaultTime] = useState(SECTION_DURATION);

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

  const requestFullscreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

const dismissAndUnblur = (setAlertFn) => {
    setAlertFn(false);
    setTimeout(() => requestFullscreen(), 10);
  };

  // --- Fetch Section Questions & Saved Answers ---
  useEffect(() => {
    const fetchSectionData = async () => {
      if (!section_id || !candidate_test_id) {
       console.warn("Missing section_id or candidate_test_id for fetching section data");
       return;
     }
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/test-creation/tests/${test_id}/sections/${section_id}/questions/?candidate_test_id=${candidate_test_id}`);
        if (!res.ok) throw new Error('Failed to fetch questions');

        const rawData = await res.json();

        const subQuestionsMap = {};
        for (const q of rawData) {
          if (q.parent_question) {
            if (!subQuestionsMap[q.parent_question]) {
              subQuestionsMap[q.parent_question] = [];
            }
            subQuestionsMap[q.parent_question].push(q);
          }
        }

        const processedQuestions = rawData
          .filter((q) => !q.parent_question)
          .map((q) => {
            if (q.type === 'paragraph') {
              q.sub_questions = subQuestionsMap[q.id] || [];
            }
            return q;
          });

        const numbered = processedQuestions.map((q, i) => ({ ...q, number: i + 1 }));

        if (numbered.length === 0) {
          setQuestions([]);
          setCurrentQuestionId(null);
        } else {
          setQuestions(numbered);
          setCurrentQuestionId(numbered[0].id);
        }

        // ✅ Fetch saved answers
        const ansRes = await fetch(`${BASE_URL}/test-execution/get-answers/?candidate_test_id=${candidate_test_id}&section_id=${section_id}`);
        if (!ansRes.ok) throw new Error('Failed to fetch answers');
        const ansData = await ansRes.json();

        const backendMap = {};
        ansData.forEach((a) => {
          let parsedAnswer = null;
          if (a.answer?.text) parsedAnswer = a.answer.text;
          else if (a.answer?.audioUrl) parsedAnswer = { type: "audio", url: a.answer.audioUrl };
          else if (a.answer?.videoUrl) parsedAnswer = { type: "video", url: a.answer.videoUrl };

          backendMap[a.question_id] = {
            answer: parsedAnswer,
            markedForReview: a.marked_for_review || false,
            status: a.status || (parsedAnswer ? "answered" : "skipped"),
          };
        });

        setAnswersStatus((prev) => ({ ...prev, ...backendMap }));
      } catch (err) {
        console.error("Error fetching section data:", err);
        setQuestions([]);
        setCurrentQuestionId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [test_id, section_id, setQuestions, setAnswersStatus, setCurrentQuestionId]);

  useEffect(() => {
    if (!currentQuestionId && questions.length > 0) {
      setCurrentQuestionId(questions[0].id);
    }
  }, [questions, currentQuestionId]);

  // --- Sync Timer from Backend or Local ---
  {/* useEffect(() => {
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
  }, [defaultTime, section_id]); */}

  // --- Countdown ---
  //useEffect(() => {
  // if (timeLeft <= 0) {
  //   handleFinalSubmit();
  //   return;
  // }
  {/*const timerId = setInterval(() => {
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
  }, [timeLeft]);*/}

  
  // --- Debounced Answer Saving ---
  const latestAnswer = useRef(null);
  const debounceId = useRef(null);
  const sendAnswer = () => {
    if (!latestAnswer.current) return;
    const { url, options } = latestAnswer.current;
    enqueueRequest(url, options);
  }
  const debouncedSave = () => {
    clearTimeout(debounceId.current);
    debounceId.current = setTimeout(sendAnswer, 500);
  };

  const updateAnswer = (question_id, payload, parent_question_id = null) => {
  const hasAns = payload.answer && payload.answer !== "";
  const status = payload.markedForReview
    ? hasAns ? "reviewed_with_answer" : "reviewed"
    : hasAns ? "answered" : "skipped";

  let wasAttempted = false;
  let isAttempted = false;

  setAnswersStatus((prev) => {
    const prevStatus = prev[question_id]?.status;
    wasAttempted = prevStatus === "answered" || prevStatus === "reviewed_with_answer";
    isAttempted = status === "answered" || status === "reviewed_with_answer";

    const updated = {
      ...prev,
      [question_id]: {
        answer: hasAns ? payload.answer : null,
        markedForReview: payload.markedForReview,
        status,
      },
    };

    // Only visually update parent question's status; do not include in attempted count
    if (parent_question_id) {
      updated[parent_question_id] = {
        answer: null,
        markedForReview: payload.markedForReview,
        status,
      };
    }

    localStorage.setItem(`answers_${section_id}`, JSON.stringify(updated));
    return updated;
  });

  // ✅ Call outside of setAnswersStatus to avoid stale closure or multiple calls
  if (!parent_question_id && typeof onQuestionAttempted === "function") {
    if (!wasAttempted && isAttempted) {
      onQuestionAttempted(section_id, +1);
    } else if (wasAttempted && !isAttempted) {
      onQuestionAttempted(section_id, -1);
    }
  }

  // ✅ Debounced Save
  const form = new FormData();
  form.append("candidate_test_id", candidate_test_id);
  form.append("question_id", question_id);
  form.append("question_type", payload.type);
  form.append("section_id", section_id);

  if (hasAns) {
    if (payload.answer?.type === "audio")
      form.append("audio_file", payload.answer.blob, payload.answer.filename);
    else if (payload.answer?.type === "video")
      form.append("video_file", payload.answer.blob, payload.answer.filename);
    else form.append("answer_text", payload.answer);
  }

  form.append("marked_for_review", payload.markedForReview);
  form.append("status", status);

  latestAnswer.current = {
    url: `${BASE_URL}/test-execution/answers/`,
    options: { method: "POST", body: form },
  };

  debouncedSave();
};


  // --- Final Submit: ensure all questions have a status ---
  const handleFinalSubmit = async () => {
    for (const q of questions) {
      console.log("Checking question object:", q);
      const questionType = q.type || q.question_type || "";
      console.log("Submitting question_type:", questionType);
      if (!answersStatus[q.id]?.answer) {
        const form = new FormData();
        form.append("candidate_test_id", candidate_test_id);
        form.append("question_id", q.id);
        form.append("question_type", q.type || q.question_type || "unknown");
        form.append("section_id", section_id);
        form.append("answer_text", "");
        form.append("status", "skipped");
        enqueueRequest(`${BASE_URL}/test-execution/answers/`, {
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

const shouldBlur = () => {
  return (
    showTabSwitchAlert === true ||
    showLowNetworkAlert === true ||
    //showLowAudioAlert === true ||
    showLowVideoAlert === true ||
    showCameraOffAlert === true
  );
};

  return (
    <div className="p-6 relative max-h-[calc(100vh-120px)] overflow-y-auto">
      {shouldBlur() && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"/>
)}
  <div className={`relative transition duration-300 min-h-full ${shouldBlur() ? "blur-sm brightness-50" : ""}`}>
      {/* Top bar: violations + timer */}
      <div className="text-right text-lg font-bold mb-4">
        <p className="text-sm text-red-600">
          Violations: {violationCount}
        </p>
        {/* <p>
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>*/}
      </div>

      {/* Question */}
      <div className="border p-4 rounded shadow mb-4">
  {loading || !current ? (
    <div className="flex justify-center items-center gap-2 text-gray-600">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
      <span>{loading ? "Loading questions…" : "No question found."}</span>
    </div>
  ) : (
    <>
      <h2 className="text-xl font-bold mb-2">
        Question {current.number} of {questions.length}
      </h2>

      {current.type !== 'paragraph' && (
        <p className="mb-4">{current.question_text}</p>
      )}

      {(() => {
        const props = {
          question: current,
          currentStatus: answersStatus[current.id] || {},
          onAnswerUpdate: updateAnswer,
          onNext: () => {
            if (currentIndex < questions.length - 1) {
              setCurrentQuestionId(questions[currentIndex + 1].id);
            } else {
              handleFinalSubmit(); // ✅ Last question
            }
          },
        };

        const isLast = currentIndex === questions.length - 1;
  console.log("Current Question Type:", current?.type);
const typeKey = {
  "Multiple Choice": "mcq",
  "Fill in the blank": "fib",
  "Subjective": "subjective",
  "Audio based": "audio",
  "Video based": "video",
  "Paragraph": "paragraph",
}[current.type] || current.type;

        switch (typeKey) {
          case "mcq":
            return <MultipleChoiceComponent {...props} isLast={isLast} />;
          case "fib":
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
          case "paragraph": {
            if (!current.sub_questions || current.sub_questions.length === 0) {
              return <p className="text-red-500">Error: Sub-questions are missing for this paragraph.</p>;
            }

            const subQuestion = current.sub_questions[0];

            const subQuestionProps = {
              question: subQuestion,
              currentStatus: answersStatus[subQuestion.id] || {},
              onAnswerUpdate: (sub_question_id, payload) => {
                updateAnswer(sub_question_id, payload);

                const hasAns = payload.answer && payload.answer !== "";
                const parentStatus = payload.markedForReview
                  ? hasAns ? "reviewed_with_answer" : "reviewed"
                  : hasAns ? "answered" : "skipped";

                setAnswersStatus((prev) => ({
                  ...prev,
                  [current.id]: {
                    answer: null,
                    markedForReview: payload.markedForReview,
                    status: parentStatus,
                  },
                }));
              },
              onNext: () => {
                if (currentIndex < questions.length - 1) {
                  setCurrentQuestionId(questions[currentIndex + 1].id);
                } else {
                  handleFinalSubmit();
                }
              },
              isLast,
            };

            const renderSubQuestionComponent = () => {
              switch (subQuestion.type) {
                case 'mcq':
                  return <MultipleChoiceComponent {...subQuestionProps} />;
                case 'fib':
                  return <FillInTheBlankComponent {...subQuestionProps} />;
                default:
                  return <p>Unsupported sub-question type: {subQuestion.type}</p>;
              }
            };

            return (
              <div>
                <div className="prose mb-4 p-4 border rounded-md bg-gray-50">
                  <p>{current.paragraph_content || 'Passage content is missing.'}</p>
                </div>
                {renderSubQuestionComponent()}
              </div>
            );
          }
          default:
            return <p>Unsupported question type: {current.type}</p>;
        }
      })()}
    </>
  )}
  </div>
</div>
      {/* Alerts */}
      {showTabSwitchAlert && (
        <TabSwitchAlert
          onDismiss={() => dismissAndUnblur(setShowTabSwitchAlert)}
          onContinue={() => dismissAndUnblur(setShowTabSwitchAlert)}
        />
      )}
      {showLowNetworkAlert && (
        <LowNetworkAlert onDismiss={() => dismissAndUnblur(setShowLowNetworkAlert)} />
      )}
      {/* {showLowAudioAlert && (
        <AudioAlert onDismiss={() => dismissAndUnblur(setShowLowAudioAlert)} />
      )} */}
      {showLowVideoAlert && (
        <VideoAlert onDismiss={() => dismissAndUnblur(setShowLowVideoAlert)} />
      )}
      {showCameraOffAlert && (
        <CameraOffAlert
           onDismiss={() => dismissAndUnblur(setShowCameraOffAlert)}
          onEnable={() => dismissAndUnblur(setShowCameraOffAlert)}
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
    </div>
  );
}