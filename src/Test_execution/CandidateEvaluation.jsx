import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import VideoSection from "./components/VideoSection";
import InterviewFeedback from "./components/InterviewFeedback";
import Header from "./components/Header";

const mockAIComment =
  "The candidate demonstrates strong interpersonal and problem-solving skills. Suitable for customer-facing roles. Work experience aligns with position requirements.";

const CandidateEvaluation = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [marks, setMarks] = useState({});
  const [sections, setSections] = useState([]);
  const [responses, setResponses] = useState([]);
  const [allQuestionsBySection, setAllQuestionsBySection] = useState({});
  const [screenshots, setScreenshots] = useState([]);
  const [aiComment, setAiComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [evaluatedMarks, setEvaluatedMarks] = useState({});

  // ✅ Fetch all candidates
 useEffect(() => {
  const token = sessionStorage.getItem("access_token"); // or sessionStorage, or context

    fetch("http://127.0.0.1:8000/api/candidates/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch candidates");
        return res.json();
      })
      .then((data) => setCandidates(data))
      .catch((err) => console.error("Error fetching candidates:", err));
  }, []);

  // When candidate changes, reset related data
  useEffect(() => {
    if (selectedCandidate?.user) {
      setCurrentSectionIndex(0);
      setEvaluatedMarks({});
    } else {
      setSections([]);
      setResponses([]);
      setScreenshots([]);
      setAiComment("");
      setError(null);
    }
  }, [selectedCandidate]);

  // Fetch sections, questions, answers, and screenshots
  useEffect(() => {
    if (!selectedCandidate?.candidate_test_id || !selectedCandidate?.user) return;

    const candidateTestId = selectedCandidate.candidate_test_id;
    const testId = selectedCandidate.test_id;

    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:8000/api/test-creation/tests/${testId}/sections/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sections");
        return res.json();
      })
      .then((sectionList) => {
        setSections(sectionList);

        return Promise.all(
          sectionList.map((section) =>
            Promise.all([
              fetch(`http://127.0.0.1:8000/api/test-creation/tests/${testId}/sections/${section.id}/questions/`).then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch questions for section ${section.id}`);
                return res.json();
              }),
              fetch(`http://127.0.0.1:8000/api/test-execution/get-answers/?candidate_test_id=${candidateTestId}&section_id=${section.id}`).then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch answers for section ${section.id}`);
                return res.json();
              }),
            ])
          )
        ).then((sectionsResults) => {
          return fetch(`http://127.0.0.1:8000/api/test-execution/proctoring-screenshots/?candidate_test_id=${candidateTestId}`)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch screenshots");
              return res.json();
            })
            .then((screenshotsData) => {
              const allMerged = [];
              const questionsBySection = {};

              sectionsResults.forEach(([questionsData, answersData], idx) => {
                const section = sectionList[idx];
                const questionsArray = Array.isArray(questionsData) ? questionsData : questionsData.questions || [];

                questionsBySection[section.id] = questionsArray;

                const merged = questionsArray.map((q) => {
                  const matchedAnswer = answersData.find((a) => String(a.question_id) === String(q.id));
                  return {
                    ...q,
                    answer: matchedAnswer?.answer_text || matchedAnswer?.answer || null,
                    question_type: matchedAnswer?.question_type || q.type || "unknown",
                    section_id: section.id,
                    answer_id: matchedAnswer?.answer_id || matchedAnswer?.id || null,
                    marks_allotted: matchedAnswer?.marks_allotted ?? null,
                    marks_per_question: q.marks_per_question || 1,
                  };
                });

                allMerged.push(...merged);
              });

              setResponses(allMerged);
              setAllQuestionsBySection(questionsBySection);
              setScreenshots(screenshotsData);
              setAiComment(mockAIComment);
              setLoading(false);
            });
        });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedCandidate]);

  useEffect(() => {
    if (responses.length === 0) return;
    const initialEvaluatedMarks = {};
    responses.forEach((resp) => {
      if (resp.answer_id) {
        initialEvaluatedMarks[resp.answer_id] = resp.marks_allotted ?? 0;
      }
    });
    setEvaluatedMarks(initialEvaluatedMarks);
  }, [responses]);

  const currentSection = sections[currentSectionIndex];
  const currentSectionQuestions = responses.filter((r) => r.section_id === currentSection?.id);

  const handleMarkChange = (answerId, marks) => {
    setEvaluatedMarks((prev) => ({
      ...prev,
      [answerId]: marks,
    }));
  };

  const handleEvaluationSubmit = ({ score, recommendation, comment }) => {
  if (!selectedCandidate?.candidate_test_id) {
    alert("Candidate test ID not found.");
    return;
  }

  fetch("http://127.0.0.1:8000/api/test-creation/submit-evaluation/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      candidate_test_id: selectedCandidate.candidate_test_id,
      total_score: score,
      result: recommendation,
      comment: comment,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to submit evaluation");
      return res.json();
    })
    .then((data) => {
      alert("✅ Evaluation submitted successfully!");
      console.log("Backend response:", data);
    })
    .catch((err) => {
      console.error("❌ Error submitting evaluation:", err);
      alert("Failed to submit evaluation.");
    });
};
// 💡 Total score calculation
const totalScore = responses.reduce(
  (acc, q) => acc + Number(evaluatedMarks[q.answer_id] ?? 0),
  0
);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
         candidates={candidates}
         onSelect={setSelectedCandidate}
         selectedCandidate={selectedCandidate}
        />
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {selectedCandidate ? (
            <>
              {/* Candidate Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <img
                      src={selectedCandidate.avatar || "/images/photo.png"}
                      alt={selectedCandidate.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{selectedCandidate.name}</h2>
                      <p className="text-sm text-gray-700 mt-1 flex flex-wrap gap-2">
                        <span>{selectedCandidate.gender}</span>
                        <span>|</span>
                        <span>Age {selectedCandidate.age}</span>
                        <span>|</span>
                        <span>{selectedCandidate.experience?.length || 0} Years EXP</span>
                        <span>|</span>
                        <span>{selectedCandidate.degree}</span>
                        <span>|</span>
                        <span>ctc {selectedCandidate.ctc}</span>
                        <span>|</span>
                        <span>Tel {selectedCandidate.contact}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-teal-600 font-semibold cursor-pointer flex items-center gap-1">
                    {/* Share Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 100-6 3 3 0 000 6zM9 12a3 3 0 100-6 3 3 0 000 6zm6 0a3 3 0 100-6 3 3 0 000 6zM9 16a3 3 0 100 6 3 3 0 000-6zm6 0a3 3 0 100 6 3 3 0 000-6z" />
                    </svg>
                    SHARE
                  </div>
                </div>
              </div>

              {/* Loading/Error/Sections */}
              {loading && <p className="text-center text-gray-500">Loading candidate responses...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}

              {!loading && !error && responses.length > 0 && sections.length > 0 && (
                <>
                  <div className="mb-4 text-center font-semibold text-lg">
                    Section Name: {currentSection?.name || "Unknown"}
                  </div>

                  {/* Section Marks */}
                  {currentSection && (
                    <div className="mb-4 text-center text-sm text-gray-700">
                      Section Marks:{" "}
                      <span
                        className={
                          currentSectionQuestions.every(
                            (q) => (evaluatedMarks[q.answer_id] ?? 0) === 0
                          )
                            ? "text-red-500 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {currentSectionQuestions.reduce(
                          (sum, q) => sum + Number(evaluatedMarks[q.answer_id] ?? 0),
                          0
                        )}
                      </span>{" "}
                      out of{" "}
                      {currentSection?.marks_per_question *
                        (allQuestionsBySection[currentSection?.id]?.length || 0)}
                    </div>
                  )}

                  <VideoSection
                    screenshots={screenshots}
                    responses={currentSectionQuestions}
                    onMarkChange={handleMarkChange}
                    evaluatedMarks={evaluatedMarks}
                    section={currentSection}
                  />

                  {/* Navigation */}
                  <div className="flex justify-center gap-4 mt-6 mb-6">
                    <button
                      disabled={currentSectionIndex === 0}
                      onClick={() =>
                        setCurrentSectionIndex((idx) => Math.max(idx - 1, 0))
                      }
                      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                      Previous Section
                    </button>
                    <button
                      disabled={currentSectionIndex === sections.length - 1}
                      onClick={() =>
                        setCurrentSectionIndex((idx) =>
                          Math.min(idx + 1, sections.length - 1)
                        )
                      }
                      className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
                    >
                      Next Section
                    </button>
                  </div>

                  <InterviewFeedback
                   onSubmit={handleEvaluationSubmit}
                   initialData={{ score: totalScore }}
                   aiComment={aiComment}
                  />
                </>
              )}

              {!loading && !error && responses.length === 0 && (
                <p>No responses available for this candidate.</p>
              )}
            </>
          ) : (
            <p className="text-gray-500 mt-10 text-center">
              Select a candidate to start evaluation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateEvaluation;
