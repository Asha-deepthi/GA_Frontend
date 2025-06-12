import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import VideoSection from "./components/VideoSection";
import InterviewFeedback from "./components/InterviewFeedback";
import Header from "./components/Header";

const mockCandidates = [
  {
    id: 1,
    session_id: 528,
    name: "Pavan",
    gender: "Male",
    age: 24,
    degree: "Bachelor",
    experience: [
      { role: "Store Manager", duration: "2016 - 2019" },
      { role: "Store Manager", duration: "2014 - 2016" },
    ],
    education: "Bachelor: 2010 - 2014",
    preference: "Banking / Financial Service",
    contact: "9696969696",
    ctc: "6 LPA",
    resume: "Resume-pavan-Online-v2.pdf",
    rating: 3.0,
    avatar: "images/profilepic.png",
    evaluationStatus: "completed",
  },
  {
    id: 2,
    session_id: 1234,
    name: "Renuka",
    gender: "Female",
    age: 23,
    degree: "Bachelor",
    experience: [{ role: "Store Manager", duration: "2018 - 2019" }],
    education: "Bachelor: 2014 - 2018",
    preference: "Retail",
    contact: "9876543210",
    ctc: "4.5 LPA",
    resume: "Resume-renuka.pdf",
    rating: 3.0,
    avatar: "images/profilepic.png",
    evaluationStatus: "rejected",
  },
  {
    id: 3,
    session_id: 123,
    name: "Kalki",
    gender: "Male",
    age: 25,
    degree: "Bachelor",
    experience: [{ role: "Store Manager", duration: "2018 - 2019" }],
    education: "Bachelor: 2013 - 2017",
    preference: "Sales",
    contact: "9123456780",
    ctc: "5.2 LPA",
    resume: "Resume-kalki.pdf",
    rating: 4.0,
    avatar: "images/profilepic.png",
    evaluationStatus: "pending",
  },
];

const mockAIComment =
  "The candidate demonstrates strong interpersonal and problem-solving skills. Suitable for customer-facing roles. Work experience aligns with position requirements.";

const CandidateEvaluation = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [marks, setMarks] = useState({});
  const [sections, setSections] = useState([]);
  const [responses, setResponses] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [aiComment, setAiComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [evaluatedMarks, setEvaluatedMarks] = useState({}); // { answer_id: marks }

  useEffect(() => {
    if (selectedCandidate?.session_id) {
      setSessionId(selectedCandidate.session_id);
      setCurrentSectionIndex(0);
      setEvaluatedMarks({});
    } else {
      setSessionId(null);
      setSections([]);
      setResponses([]);
      setScreenshots([]);
      setAiComment("");
      setError(null);
    }
  }, [selectedCandidate]);

  useEffect(() => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);

    // Fetch sections first
    fetch("http://127.0.0.1:8000/api/test-creation/sections/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sections");
        return res.json();
      })
      .then((sectionList) => {
        setSections(sectionList);

        // Fetch questions & answers for each section
        return Promise.all(
          sectionList.map((section) =>
            Promise.all([
              fetch(
                `http://127.0.0.1:8000/api/test-creation/sections/${section.id}/questions/`
              ).then((res) => {
                if (!res.ok)
                  throw new Error(
                    `Failed to fetch questions for section ${section.id}`
                  );
                return res.json();
              }),
              fetch(
                `http://127.0.0.1:8000/test-execution/get-answers/?session_id=${sessionId}&section_id=${section.id}`
              ).then((res) => {
                if (!res.ok)
                  throw new Error(
                    `Failed to fetch answers for section ${section.id}`
                  );
                return res.json();
              }),
            ])
          )
        ).then((sectionsResults) => {
          // Fetch screenshots after questions & answers
          return fetch(
            `http://127.0.0.1:8000/test-execution/proctoring-screenshots/?session_id=${sessionId}`
          )
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch screenshots");
              return res.json();
            })
            .then((screenshotsData) => {
              const filteredScreenshots = screenshotsData.filter(
                (s) => s.session === sessionId
              );

              // Merge all questions + answers
              const allMerged = [];
              sectionsResults.forEach(([questionsData, answersData], idx) => {
                const section = sectionList[idx];
                const questionsArray = Array.isArray(questionsData)
                  ? questionsData
                  : questionsData.questions || [];

                const merged = questionsArray.map((q) => {
                  const matchedAnswer = answersData.find(
                    (a) => String(a.question_id) === String(q.id)
                  );
                  console.log("Question ID:", q.id);
    console.log("Matching Answer Found:", matchedAnswer);
    console.log("Answer ID:", matchedAnswer?.answer_id || matchedAnswer?.id);
                  return {
                    ...q,
                    answer:
                      matchedAnswer?.answer_text ||
                      matchedAnswer?.answer ||
                      null,
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
              setScreenshots(filteredScreenshots);
              setAiComment(mockAIComment);
              setLoading(false);
            });
        });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sessionId]);

  // Filter questions for current section
  const currentSection = sections[currentSectionIndex];
  const currentSectionQuestions = responses.filter(
    (r) => r.section_id === currentSection?.id
  );

  const handleMarkChange = (answerId, marks) => {
    setEvaluatedMarks((prev) => ({
      ...prev,
      [answerId]: marks,
    }));
  };

  const handleEvaluationSubmit = (evaluation) => {
    console.log("Submitted evaluation:", evaluation);
    // TODO: POST evaluation to backend
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar candidates={mockCandidates} onSelect={setSelectedCandidate} />
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {selectedCandidate ? (
            <>
              {/* Candidate Info Section */}
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
                    {/* Share icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 8a3 3 0 100-6 3 3 0 000 6zM9 12a3 3 0 100-6 3 3 0 000 6zm6 0a3 3 0 100-6 3 3 0 000 6zM9 16a3 3 0 100 6 3 3 0 000-6zm6 0a3 3 0 100 6 3 3 0 000-6z"
                      />
                    </svg>
                    SHARE
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-8 mt-6 text-sm">
                  <div>
                    <p className="text-gray-400 font-medium">Experience</p>
                    {selectedCandidate.experience?.map((item, idx) => (
                      <p key={idx} className="text-black">
                        {item.role} · {item.duration}
                      </p>
                    ))}
                  </div>

                  <div>
                    <p className="text-gray-400 font-medium">Education</p>
                    <p className="text-black">{selectedCandidate.education}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 font-medium">Resume</p>
                    <a
                      href={`/${selectedCandidate.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 underline"
                    >
                      {selectedCandidate.resume}
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-400 font-medium">Preference</p>
                    <p className="text-black">{selectedCandidate.preference}</p>
                  </div>
                </div>
              </div>

              {/* Loading & Error */}
              {loading && (
                <p className="text-center text-gray-500">Loading candidate responses...</p>
              )}
              {error && <p className="text-center text-red-500">{error}</p>}

              {/* Responses + Feedback */}
              {!loading && !error && responses.length > 0 && sections.length > 0 && (
                <>
                  {/* Section name & marks */}
                  <div className="mb-4 text-center font-semibold text-lg">
                    Section Name: {currentSection?.section_name || "Unknown"} &nbsp; 
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
      {currentSectionQuestions.reduce((sum, q) => {
        return sum + Number(evaluatedMarks[q.answer_id] ?? 0);
      }, 0)}
    </span>{" "}
    out of{" "}
    {currentSection?.marks_per_question * currentSectionQuestions.length}
  </div>
)}


                  {/* Questions and answers for this section */}
                  {console.log("✅ Sending responses to VideoSection:", responses)}
                  <VideoSection
                    screenshots={screenshots}
                    responses={currentSectionQuestions}
                    onMarkChange={handleMarkChange}
                    evaluatedMarks={evaluatedMarks}
                    section={currentSection}
                  />

                  {/* Navigation Buttons */}
                  <div className="flex justify-center gap-4 mt-6 mb-6">
                    <button
                      disabled={currentSectionIndex === 0}
                      onClick={() => setCurrentSectionIndex((idx) => Math.max(idx - 1, 0))}
                      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                      Previous Section
                    </button>

                    <button
                      disabled={currentSectionIndex === sections.length - 1}
                      onClick={() => setCurrentSectionIndex((idx) => Math.min(idx + 1, sections.length - 1))}
                      className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
                    >
                      Next Section
                    </button>
                  </div>

                  <InterviewFeedback onSubmit={handleEvaluationSubmit} aiComment={aiComment} />
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
