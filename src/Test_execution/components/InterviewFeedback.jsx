import React from 'react';

import { useState } from "react";

const InterviewFeedback = ({ onSubmit, initialData = {} }) => {
  const [score, setScore] = useState(initialData.score || 0);
  const [recommendation, setRecommendation] = useState(initialData.recommendation || "");
  const [comment, setComment] = useState(initialData.comment || "");

  const handleSubmit = () => {
    onSubmit({ score, recommendation, comment });
  };

  return (
    <div className="bg-white p-6 rounded shadow-sm space-y-4">
      <div>
        <label className="block font-medium">Score</label>
        <input
          type="number"
          max={100}
          min={0}
          value={score}
          onChange={e => setScore(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium">Recommendation</label>
        <div className="flex gap-4 mt-2">
          <label>
            <input
              type="radio"
              value="Pass"
              checked={recommendation === "Pass"}
              onChange={e => setRecommendation(e.target.value)}
            />{" "}
            Pass
          </label>
          <label>
            <input
              type="radio"
              value="No Pass"
              checked={recommendation === "No Pass"}
              onChange={e => setRecommendation(e.target.value)}
            />{" "}
            No Pass
          </label>
        </div>
      </div>

      <div>
        <label className="block font-medium">Comment</label>
        <textarea
          maxLength={1000}
          rows={5}
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Confirm
      </button>
    </div>
  );
};

export default InterviewFeedback;
