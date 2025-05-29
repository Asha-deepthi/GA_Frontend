// SectionComponent.jsx
import React, { useState, useEffect } from "react";
import MultipleChoiceComponent from "./MultipleChoiceComponent";
import FillInTheBlankComponent from "./FillInTheBlankComponent";
import IntegerComponent from "./IntegerComponent";
import SubjectiveComponent from "./SubjectiveComponent";
import AudioComponent from "./AudioComponent";
import VideoComponent from "./VideoComponent";

const SectionComponent = ({ section_id, sessionId, apiurl, answerApiUrl, onComplete }) => {
  const [sectionData, setSectionData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchSectionQuestions = async () => {
      try {
        const response = await fetch(`${apiurl}/fetch-section-questions/${section_id}/`);
        if (!response.ok) throw new Error("Section not found");

        const data = await response.json();
        setSectionData(data);
        setTimeLeft(data.timer || 0);

        // Initialize answers state with empty answers and review flags
        const initialAnswers = {};
        data.questions.forEach((q) => {
          initialAnswers[q.question_id] = {
            answer: "",
            is_marked_for_review: false,
          };
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Failed to fetch section questions:", error);
      }
    };

    fetchSectionQuestions();
  }, [section_id, apiurl]);

  // Timer countdown and auto submit on 0
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, submitted]);

  console.log("sessionId in SectionComponent:", sessionId, typeof sessionId);

  const handleSubmit = async () => {
  if (submitted) return;
  setSubmitted(true);

  try {
    for (const [question_id, ansObj] of Object.entries(answers)) {
      const payload = {
        session: Number(sessionId),
        question: Number(question_id),
        answer_text: ansObj.answer || "",
        marked_for_review: ansObj.is_marked_for_review ?? false
      };

      console.log("Submitting answer payload:", payload);

      const response = await fetch(`${answerApiUrl}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error submitting answer for Q${question_id}:`, errorData);
        setSubmitted(false);
        return;
      }
    }

    if (onComplete) onComplete();
  } catch (err) {
    console.error("Bulk submit failed:", err);
    setSubmitted(false);
  }
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSaveAnswer = (question_id, answer, marked_for_review = false) => {
    setAnswers((prev) => ({
      ...prev,
      [question_id]: { answer, is_marked_for_review: marked_for_review },
    }));
  };


  const currentQuestion = sectionData?.questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      prev < sectionData.questions.length - 1 ? prev + 1 : prev
    );
  };

  const renderQuestion = (question) => {
    const savedAnswer = answers[question.question_id]?.answer || "";
    const savedMark = answers[question.question_id]?.is_marked_for_review || false;

    const commonProps = {
      question,
      savedAnswer,
      isMarkedForReview: savedMark,
      onSaveAnswer: handleSaveAnswer,
      onNext: handleNextQuestion,
    };

    switch (question.question_type) {
      case "multiple_choice":
        return <MultipleChoiceComponent key={question.question_id} {...commonProps} />;
      case "fill_in_the_blank":
        return <FillInTheBlankComponent key={question.question_id} {...commonProps} />;
      case "integer":
        return <IntegerComponent key={question.question_id} {...commonProps} />;
      case "subjective":
        return <SubjectiveComponent key={question.question_id} {...commonProps} />;
      case "audio":
        return <AudioComponent key={question.question_id} {...commonProps} />;
      case "video":
        return <VideoComponent key={question.question_id} {...commonProps} />;
      default:
        return <p key={question.question_id}>Unknown question type</p>;
    }
  };

  if (!sectionData) return <div>Loading section questions...</div>;

  if (submitted)
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-4">Your answers have been submitted.</h3>
        <p>Thank you! Moving to the next section...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{sectionData.section_name}</h2>
        <p className="text-lg">Time Left: {formatTime(timeLeft)}</p>
      </div>

      <div className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm max-w-3xl mx-auto">
        {renderQuestion(currentQuestion)}
      </div>

      <div className="flex justify-center gap-2 flex-wrap mb-4">
        {sectionData.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`px-4 py-2 rounded-full border ${index === currentQuestionIndex ? "bg-black text-white" : "bg-gray-200 text-black"
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-between max-w-3xl mx-auto mb-6">
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

      <div className="max-w-3xl mx-auto text-center">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`px-6 py-3 rounded text-white ${submitted ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
        >
          Submit Section
        </button>
      </div>
    </div>
  );
};

export default SectionComponent;
