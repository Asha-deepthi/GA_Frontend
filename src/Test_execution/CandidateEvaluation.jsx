import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import VideoSection from "./components/VideoSection";
import AIComment from "./components/AIComment";
import InterviewFeedback from "./components/InterviewFeedback";

// Mock data
const mockCandidates = [
    {
        id: 1,
        name: "Pavan",
        gender: "Male",
        age: 24,
        degree: "Bachelor",
        experience: "Store Manager: 2018 - 2019",
        rating: 3.0,
        avatar: "images/profilepic.png",
    },
    // Add more candidates here
    {
        id: 2,
        name: "Renuka",
        gender: "female",
        age: 24,
        degree: "Bachelor",
        experience: "Store Manager: 2018 - 2019",
        rating: 4.0,
        avatar: "images/profilepic.png",
    },
];


const mockResponses = [
    {
        question: "What professional skills do you have for Sales Executive positions?",
        videoUrl: "/sample1.mp4",
    },
    {
        question: "Which of the following roles related work experience do you have?",
        videoUrl: "/sample2.mp4",
    },
    // Add more responses
];

const mockAIComment =
    "The candidate demonstrates strong interpersonal and problem-solving skills. Suitable for customer-facing roles. Work experience aligns with position requirements.";

const CandidateEvaluation = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [responses, setResponses] = useState([]);
    const [aiComment, setAiComment] = useState("");

    useEffect(() => {
        if (selectedCandidate) {
            // In real setup: fetch(`/api/candidate/${selectedCandidate.id}/responses`)
            setResponses(mockResponses);
            setAiComment(mockAIComment);
        }
    }, [selectedCandidate]);

    const handleEvaluationSubmit = (evaluation) => {
        console.log("Submitted evaluation:", evaluation);
        // TODO: POST to backend
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar candidates={mockCandidates} onSelect={setSelectedCandidate} />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {selectedCandidate ? (
                    <>
                        {/* Candidate Details */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">{selectedCandidate.name}</h2>
                            <p className="text-sm text-gray-600">
                                {selectedCandidate.gender} | Age {selectedCandidate.age} | {selectedCandidate.degree}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{selectedCandidate.experience}</p>
                        </div>

                        <div className="flex space-x-6 mb-6">
                            {/* Video Section - left side */}
                            <div className="w-2/3">
                                <VideoSection responses={responses} />
                            </div>

                            {/* Right side - AI comment + Feedback */}
                            <div className="w-1/3 flex flex-col space-y-4">
                                <AIComment comment={aiComment} />
                                <InterviewFeedback onSubmit={handleEvaluationSubmit} />
                            </div>
                        </div>

                    </>
                ) : (
                    <p className="text-gray-500 mt-10 text-center">Select a candidate to start evaluation.</p>
                )}
            </div>
        </div>
    );
};

export default CandidateEvaluation;
