import React, { useState, useEffect, useRef, useCallback } from 'react';

// Debounce utility
function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const VideoSection = ({ screenshots = [], responses = [] }) => {
  const [marks, setMarks] = useState({});
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const initialMarks = {};
    responses.forEach((resp, i) => {
      // Use resp.marks_allotted (backend response field) instead of resp.marks
      if (resp.marks_allotted !== undefined && resp.marks_allotted !== null) {
        initialMarks[i] = resp.marks_allotted.toString();
      } else if (requiresManualEvaluation(resp.question_type)) {
        initialMarks[i] = ''; // show empty input for manual questions
      }
    });
    setMarks(initialMarks);
  }, [responses]);

  // Actual API call to save marks
  const saveMarksToBackend = async (answerId, marksValue) => {
    if (!answerId || marksValue === '' || isNaN(marksValue)) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/test-execution/manual-evaluate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer_id: answerId, marks: Number(marksValue) }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Error saving marks:", data);
      } else {
        console.log("Marks saved:", data);
      }
    } catch (err) {
      console.error("Failed to save marks:", err);
    }
  };

  // Debounced version of save
  const debounceSaveMarks = useCallback(
    debounce((answerId, val) => saveMarksToBackend(answerId, val), 500),
    []
  );

  // On marks input change
  const handleMarkChange = (index, value) => {
    // Accept only digits, or empty string for clearing input
    if (value === '' || /^\d{0,2}$/.test(value)) {
      setMarks(prev => ({ ...prev, [index]: value }));

      const answerId = responses[index]?.answer_id;
      if (answerId) {
        debounceSaveMarks(answerId, value);
      }
    }
  };

  const renderAnswer = (item) => {
    const { question_type, answer } = item;

    if (!answer || (typeof answer === "object" && Object.keys(answer).length === 0)) {
      return <span className="italic text-gray-500">No answer provided.</span>;
    }

    switch (question_type) {
      case "mcq":
        return <span>{answer.selectedOption || answer.text || answer || "No option selected."}</span>;

      case "fillintheblank":
      case "integer":
      case "subjective":
        return <span>{answer.text || answer || "No answer written."}</span>;

      case "audio":
        if (typeof answer === "string") {
          return <audio controls src={answer} className="mt-2" />;
        }
        return answer.audioUrl ? (
          <audio controls src={answer.audioUrl} className="mt-2" />
        ) : (
          <span>No audio response.</span>
        );

      case "video":
        if (typeof answer === "string") {
          return <video controls src={answer} className="w-full rounded-lg mt-2" />;
        }
        return answer.videoUrl ? (
          <video controls src={answer.videoUrl} className="w-full rounded-lg mt-2" />
        ) : (
          <span>No video response.</span>
        );

      default:
        return <span>{typeof answer === "string" ? answer : JSON.stringify(answer)}</span>;
    }
  };

  const requiresManualEvaluation = (type) => {
    if (!type || type === "unknown") return true;
    const lowerType = type.toLowerCase();
    return ["subjective", "audio", "video"].includes(lowerType);
  };

  return (
    <div className="space-y-6">
      {/* Proctoring Screenshots Section */}
      {screenshots.length > 0 && (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h4 className="font-medium text-gray-700 mb-2">Proctoring Screenshots:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[...screenshots]
              .sort(() => 0.5 - Math.random())
              .slice(0, 4)
              .map((screenshot, i) => (
                <img
                  key={screenshot.id || i}
                  src={screenshot.screenshot ? `http://127.0.0.1:8000${screenshot.screenshot}` : `/images/photo.png`}
                  alt={`Screenshot ${i + 1}`}
                  className="w-full h-auto border rounded"
                />
              ))}
          </div>
        </div>
      )}

      {/* Per-question responses */}
      {responses.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
          {/* Question */}
          <h3 className="font-semibold mb-2 text-gray-800">
            Q{index + 1}. {item.question}
          </h3>

          {/* Answer */}
          <div className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Answer:</span> {renderAnswer(item)}
          </div>

          {/* Show marks for all question types */}
          <div
            className={`mt-2 font-semibold ${
              (marks[index] === undefined || marks[index] === '' || Number(marks[index]) === 0)
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            Marks: {marks[index] !== undefined && marks[index] !== '' ? marks[index] : 'Not evaluated'}
          </div>

          {/* Show input only for manual eval questions */}
          {requiresManualEvaluation(item.question_type) && (
            <div className="mt-2">
              <label htmlFor={`marks-input-${index}`} className="text-sm font-medium text-gray-600">
                Update Marks:
              </label>
              <input
                id={`marks-input-${index}`}
                type="number"
                min="0"
                max="10"
                step="1"
                value={marks[index] !== undefined ? marks[index] : ''}
                onChange={e => handleMarkChange(index, e.target.value)}
                className="block mt-1 border rounded px-2 py-1 w-24 text-sm text-gray-800"
                aria-label={`Enter marks for question ${index + 1}`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoSection;
