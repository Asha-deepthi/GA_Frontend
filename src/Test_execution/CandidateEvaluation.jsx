import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import VideoSection from "./components/VideoSection";
import AIComment from "./components/AIComment";
import InterviewFeedback from "./components/InterviewFeedback";
import Header from "./components/Header";


// ✅ Consistent mock data
const mockCandidates = [
    {
        id: 1,
        name: "Pavan",
        gender: "Male",
        age: 24,
        degree: "Bachelor",
        experience: [
            { role: "Store Manager", duration: "2016 - 2019" },
            { role: "Store Manager", duration: "2014 - 2016" }
        ],
        education: "Bachelor: 2010 - 2014",
        preference: "Banking / Financial Service",
        contact: "9696969696",
        ctc: "6 LPA",
        resume: "Resume-pavan-Online-v2.pdf",
        rating: 3.0,
        avatar: "images/profilepic.png",
        evaluationStatus: "completed"
    },
    {
        id: 2,
        name: "Renuka",
        gender: "Female",
        age: 23,
        degree: "Bachelor",
        experience: [
            { role: "Store Manager", duration: "2018 - 2019" }
        ],
        education: "Bachelor: 2014 - 2018",
        preference: "Retail",
        contact: "9876543210",
        ctc: "4.5 LPA",
        resume: "Resume-renuka.pdf",
        rating: 3.0,
        avatar: "images/profilepic.png",
        evaluationStatus: "rejected"
    },
    {
        id: 3,
        name: "Kalki",
        gender: "Male",
        age: 25,
        degree: "Bachelor",
        experience: [
            { role: "Store Manager", duration: "2018 - 2019" }
        ],
        education: "Bachelor: 2013 - 2017",
        preference: "Sales",
        contact: "9123456780",
        ctc: "5.2 LPA",
        resume: "Resume-kalki.pdf",
        rating: 4.0,
        avatar: "images/profilepic.png",
        evaluationStatus: "pending"
    }
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
];

const mockAIComment =
    "The candidate demonstrates strong interpersonal and problem-solving skills. Suitable for customer-facing roles. Work experience aligns with position requirements.";

const CandidateEvaluation = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [responses, setResponses] = useState([]);
    const [aiComment, setAiComment] = useState("");

    useEffect(() => {
        if (selectedCandidate) {
            setResponses(mockResponses);
            setAiComment(mockAIComment);
        }
    }, [selectedCandidate]);

    const handleEvaluationSubmit = (evaluation) => {
        console.log("Submitted evaluation:", evaluation);
        // TODO: POST to backend
    };

    return (
         <div className="flex flex-col h-screen">
            {/* Header */}
            <Header />

        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar candidates={mockCandidates} onSelect={setSelectedCandidate} />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {selectedCandidate ? (
                    <>

                        {/* Candidate Details */}
                        <div className="mb-6 bg-white">
                            {/* Top Row with Photo + Basic Info + Share */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/images/photo.png"
                                        alt={selectedCandidate.name}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold">{selectedCandidate.name}</h2>
                                        <div className="flex flex-wrap gap-x-4 text-sm text-black mt-1">
                                            <span>{selectedCandidate.gender}</span>
                                            <span>Age {selectedCandidate.age}</span>
                                            <span>{selectedCandidate.experience?.length || 0} Years EXP</span>
                                            <span>{selectedCandidate.degree}</span>
                                            <span>ctc {selectedCandidate.ctc}</span>
                                            <span>Tel {selectedCandidate.contact}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center text-teal-500 font-semibold cursor-pointer gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 100-6 3 3 0 000 6zM9 12a3 3 0 100-6 3 3 0 000 6zm6 0a3 3 0 100-6 3 3 0 000 6zM9 16a3 3 0 100 6 3 3 0 000-6zm6 0a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                    SHARE
                                </div>
                            </div>

                            {/* 2-Column Info Layout */}
                            <div className="grid grid-cols-2 gap-y-2 gap-x-6 mt-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Experience</p>
                                    {selectedCandidate.experience?.map((item, idx) => (
                                        <p key={idx} className="text-black">
                                            {item.role} · {item.duration}
                                        </p>
                                    ))}
                                </div>

                                <div>
                                    <p className="text-gray-400">Education</p>
                                    <p className="text-black">{selectedCandidate.education}</p>
                                </div>

                                <div>
                                    <p className="text-gray-400">Resume</p>
                                    <a
                                        href={`/${selectedCandidate.resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black underline"
                                    >
                                        {selectedCandidate.resume}
                                    </a>
                                </div>

                                <div>
                                    <p className="text-gray-400">Preference</p>
                                    <p className="text-black">{selectedCandidate.preference}</p>
                                </div>
                            </div>
                        </div>

                        {/* Video + AI Feedback */}
                        <div className="flex space-x-6 mb-6">
                            <div className="w-2/3">
                                <VideoSection responses={responses} />
                            </div>

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
        </div>
    );
};

export default CandidateEvaluation;
