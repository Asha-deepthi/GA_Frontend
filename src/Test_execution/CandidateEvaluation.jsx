import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import VideoSection from "./components/VideoSection";
import InterviewFeedback from "./components/InterviewFeedback";
import Header from "./components/Header";

const mockCandidates = [
  {
    id: 1,
    session_id: 12345,
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
  const [responses, setResponses] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [aiComment, setAiComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCandidate?.session_id) {
      setSessionId(selectedCandidate.session_id);
    } else {
      setSessionId(null);
    }
  }, [selectedCandidate]);

  useEffect(() => {
    if (!sessionId) {
      setResponses(null);
      setScreenshots([]);
      setAiComment("");
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const sections = [1, 2, 3, 4, 5, 6, 7]; // All 7 sections

    Promise.all([
      Promise.all(
        sections.map((sectionId) =>
          Promise.all([
            fetch(
              `http://127.0.0.1:8000/api/test-creation/sections/${sectionId}/questions/`
            )
              .then((res) => {
                if (!res.ok)
                  throw new Error(`Failed to fetch questions for section ${sectionId}`);
                return res.json();
              })
              .then((data) => {
                console.log(`Section ${sectionId} questions raw data:`, data);
                return data;
              }),
            fetch(
              `http://127.0.0.1:8000/test-execution/get-answers/?session_id=${sessionId}&section_id=${sectionId}`
            )
              .then((res) => {
                if (!res.ok)
                  throw new Error(`Failed to fetch answers for section ${sectionId}`);
                return res.json();
              }),
          ])
        )
      ),
      fetch(`http://127.0.0.1:8000/test-execution/proctoring-screenshots/?session_id=${sessionId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch screenshots");
          return res.json();
        }),
    ])
      .then(([[...sectionsResults], screenshotsData]) => {
        // Merge questions and answers from all sections
        const filteredScreenshots = screenshotsData.filter(
          (screenshot) => screenshot.session === sessionId
        );
        const allMerged = [];

        sectionsResults.forEach(([questionsData, answersData], idx) => {
          const questionsArray = Array.isArray(questionsData)
            ? questionsData
            : questionsData.questions || [];

          console.log(`Section ${sections[idx]} — questionsData:`, questionsArray);
          console.log(`Section ${sections[idx]} — answersData:`, answersData);

          const merged = questionsArray.map((q) => {
            console.log("Question ID:", q.id);
            answersData.forEach((a) => console.log("Answer question_id:", a.question_id));

            const matchedAnswer = answersData.find(
              (a) => String(a.question_id) === String(q.id)
            );
            console.log("Matched Answer for question", q.id, ":", matchedAnswer);

            return {
              ...q,
              answer: matchedAnswer?.answer_text || matchedAnswer?.answer || null,
              question_type: q.type || matchedAnswer?.question_type || "unknown",
              section_id: sections[idx],
              answer_id: matchedAnswer?.answer_id || matchedAnswer?.id || null,
              marks_allotted: matchedAnswer?.marks_allotted ?? null,
            };
          });

          allMerged.push(...merged);
        });

        console.log("Merged questions+answers:", allMerged);

        setResponses(allMerged);
        setScreenshots(filteredScreenshots);
        setAiComment(mockAIComment);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sessionId]);

  const handleEvaluationSubmit = (evaluation) => {
    console.log("Submitted evaluation:", evaluation);
    // TODO: POST evaluation to backend
  };

  useEffect(() => {
    if (responses) {
      console.log("Data passed to VideoSection:", responses);
    }
  }, [responses]);

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
              {responses && !loading && !error && (
                <div className="flex space-x-6 mb-6">
                  <div className="w-full">
                    <VideoSection screenshots={screenshots} responses={responses} />
                  </div>

                  <div className="w-1/3 flex flex-col space-y-4">
                    <InterviewFeedback onSubmit={handleEvaluationSubmit} aiComment={aiComment} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 mt-10 text-center">Select a candidate to start evaluation.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateEvaluation;
