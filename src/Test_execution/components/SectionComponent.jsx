import React, { useState, useEffect } from "react";
import MultipleChoiceComponent from "./MultipleChoiceComponent";
import FillInTheBlankComponent from "./FillInTheBlankComponent";
import IntegerComponent from "./IntegerComponent";
// import SubjectiveComponent from "./SubjectiveComponent";
// import AudioComponent from "./AudioComponent";
// import VideoComponent from "./VideoComponent";
// import CodeComponent from "./CodeComponent";

const SectionComponent = ({ section_id, apiurl }) => {
  const [sectionData, setSectionData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchSectionQuestions = async () => {
      try {
        const response = await fetch(`${apiurl}/fetch-section-questions/${section_id}/`);
        console.log("API response status:", response.status);
        if (!response.ok) throw new Error("Section not found");

        const data = await response.json();
        console.log("Fetched section data:", data);
        setSectionData(data);
        setTimeLeft(data.timer || 0);  // <-- Use 'timer' key here
      } catch (error) {
        console.error("Failed to fetch section questions:", error);
      }
    };

    fetchSectionQuestions();
  }, [section_id, apiurl]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          handleAutoSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, submitted]);

  const handleAutoSubmit = async () => {
    setSubmitted(true);
    console.log("Auto-submitting answers...");

    try {
      const response = await fetch(`${apiurl}/submit-section/${section_id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Auto-submitted by timer" }),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      console.log("Submission successful:", result);
    } catch (error) {
      console.error("Auto-submission failed:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const renderQuestion = (question) => {
    switch (question.question_type) {
      case "multiple_choice":
        return <MultipleChoiceComponent key={question.question_id} question={question} />;
      case "fill_in_the_blank":
        return <FillInTheBlankComponent key={question.question_id} question={question} />;
      case "integer":
        return <IntegerComponent key={question.question_id} question={question} />;
      // case "subjective":
      //   return <SubjectiveComponent key={question.question_id} question={question} />;
      // case "audio":
      //   return <AudioComponent key={question.question_id} question={question} />;
      // case "video":
      //   return <VideoComponent key={question.question_id} question={question} />;
      // case "code":
      //   return <CodeComponent key={question.question_id} question={question} />;
      default:
        return <p key={question.question_id}>Unknown question type</p>;
    }
  };

  if (!sectionData) return <div>Loading section questions...</div>;
  if (submitted) return <div>Time's up! Your answers have been submitted.</div>;

  const currentQuestion = sectionData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{sectionData.section_name}</h2>
        <p className="text-lg">Time Left: {formatTime(timeLeft)}</p>
      </div>

      {/* Question box with padding, border, rounded corners, shadow */}
      <div className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm max-w-3xl mx-auto">
        {renderQuestion(currentQuestion)}
      </div>

      <div className="flex justify-center gap-2 flex-wrap mb-4">
        {sectionData.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`px-4 py-2 rounded-full border ${
              index === currentQuestionIndex
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-between max-w-3xl mx-auto">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, sectionData.questions.length - 1)
            )
          }
          disabled={currentQuestionIndex === sectionData.questions.length - 1}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SectionComponent;
