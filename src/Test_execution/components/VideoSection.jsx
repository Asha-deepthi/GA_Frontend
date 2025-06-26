import React, { useState, useEffect, useRef, useCallback } from "react";
import BASE_URL from "../../config";

function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const requiresManualEvaluation = (type) => {
  const lower = (type || "").toLowerCase();
  return ["subjective", "audio", "video","text"].includes(lower);
};

const groupBySection = (questions) => {
  const sections = {};
  questions.forEach((q) => {
    const secId = q.section_id || "unknown";
    if (!sections[secId]) {
      sections[secId] = {
        section_id: secId,
        section_name: q.direction || "Skill Evaluation",
        marks_per_question: q.marks_per_question || 1,
        questions: [],
      };
    }
    sections[secId].questions.push(q);
  });
  return Object.values(sections);
};

const VideoSection = ({ screenshots = [], responses = [] ,section }) => {
  const [marks, setMarks] = useState({});
  const [showAllScreenshots, setShowAllScreenshots] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const sections = groupBySection(responses || []);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const initialMarks = {};
    sections.forEach((section, sIdx) => {
      section.questions.forEach((q, qIdx) => {
        const key = `${sIdx}_${qIdx}`;
        if (q.marks_allotted !== undefined) {
          initialMarks[key] = q.marks_allotted.toString();
        } else if (requiresManualEvaluation(q.type)) {
          initialMarks[key] = '';
        }
      });
    });
    setMarks(initialMarks);
  }, [responses]);

  const saveMarksToBackend = async (answerId, marksValue) => {
    if (!answerId || marksValue === '' || isNaN(marksValue)) return;
    try {
      const res = await fetch(`${BASE_URL}/test-execution/manual-evaluate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer_id: answerId, marks: Number(marksValue) }),
      });
      const data = await res.json();
      if (!res.ok) console.error("Error saving marks:", data);
    } catch (err) {
      console.error("Failed to save marks:", err);
    }
  };

  const debounceSaveMarks = useCallback(
    debounce((answerId, val) => saveMarksToBackend(answerId, val), 500),
    []
  );

  const handleMarkChange = (sectionIdx, questionIdx, value) => {
    const key = `${sectionIdx}_${questionIdx}`;
    if (/^\d{0,2}$/.test(value) && Number(value) <= 10) {
      setMarks((prev) => ({ ...prev, [key]: value }));
      const answerId = sections[sectionIdx]?.questions[questionIdx]?.answer_id;
      if (answerId) debounceSaveMarks(answerId, value);
    }
  };

  const renderAnswer = (q) => {
    const answer = q.answer || {};
    switch ((q.type || "").toLowerCase()) {
      case "multiple-choice":
      case "fill-in-blanks":
      case "integer":
      case "subjective":
      case "text":
        return <span>{answer?.text || "No answer provided."}</span>;
      case "audio":
        return answer?.audioUrl ? (
          <audio controls src={answer.audioUrl} className="mt-2" />
        ) : (
          <span>No audio provided.</span>
        );
      case "video":
        return answer?.videoUrl ? (
          <video controls src={answer.videoUrl} className="mt-2 w-full" />
        ) : (
          <span>No video provided.</span>
        );
      default:
        return <span>{JSON.stringify(answer)}</span>;
    }
  };

 const renderProctoringScreenshots = () => {
  console.log("renderProctoringScreenshots called");
  console.log("screenshots:", screenshots);

  const webcamShots = screenshots
    .filter((s) => s.screenshot?.includes("webcam_"))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  console.log("webcamShots length:", webcamShots.length);

  const shotsToShow = showAllScreenshots ? webcamShots : webcamShots.slice(0, 3);

  console.log("shotsToShow length:", shotsToShow.length);
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h4 className="font-medium text-gray-700 mb-4">Proctoring Screenshots:</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shotsToShow.map((s, i) => {
          console.log("Screenshot URL:", s.screenshot);  // <-- Add here
          return (
            <div key={s?.id || i}>
              <img
                src={`http://127.0.0.1:8000${s.screenshot}`}
                className="w-full rounded mb-1"
              />
              <p className="text-xs text-gray-500">
                {new Date(s.timestamp).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
      {webcamShots.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAllScreenshots((p) => !p)}
            className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {showAllScreenshots ? "Hide Extra Screenshots" : "View All Screenshots"}
          </button>
        </div>
      )}
    </div>
  );
};


  //const currentSection = sections[activeSectionIndex];
  //const totalMarks = currentSection?.questions?.length * currentSection?.marks_per_question || 0;
  //const securedMarks = currentSection?.questions?.reduce((acc, q, qIdx) => {
    //const val = Number(marks[`${activeSectionIndex}_${qIdx}`]);
    //return acc + (isNaN(val) ? 0 : val);
  //}, 0);

  return (
    <div className="space-y-6">
      {renderProctoringScreenshots()}

      <div className="bg-white p-4 rounded shadow">
        {responses.map((q, qIdx) => {
          const key = `${activeSectionIndex}_${qIdx}`;
          return (
            <div key={q.id || qIdx} className="border rounded-lg p-4 shadow-sm mb-4 bg-gray-50">
              <h3 className="font-semibold mb-2 text-gray-800">
                Q{qIdx + 1}. {q.text}
              </h3>
              <div className="text-sm text-gray-700 mb-2">
  <span className="font-semibold">Answer:</span> {renderAnswer(q)}
  {(!requiresManualEvaluation(q.type) || q.marks_allotted !== undefined || marks[key] !== '') && (
    <div
  className={`mt-1 text-xs font-semibold ${
    Number(marks[key] || q.marks_allotted || 0) > 0 ? "text-green-700" : "text-red-600"
  }`}
>
  Marks Allotted: {marks[key] || q.marks_allotted || 0} / {section?.marks_per_question || 1}
</div>
  )}
</div>
              {requiresManualEvaluation(q.type) && (
                <div className="mt-2">
                  <label htmlFor={`marks-input-${key}`} className="text-sm font-medium text-gray-600">
                    Update Marks:
                  </label>
                  <input
                    id={`marks-input-${key}`}
                    type="number"
                    min="0"
                    max="10"
                    value={marks[key] || ''}
                    onChange={(e) => handleMarkChange(activeSectionIndex, qIdx, e.target.value)}
                    className="block mt-1 border rounded px-2 py-1 w-24 text-sm text-gray-800"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoSection;
