import React from 'react';

import { Bot } from "lucide-react";

const AIComment = ({ comment }) => {
  return (
    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded shadow-sm mb-6 flex items-start gap-3">
      <Bot className="text-blue-500" />
      <div>
        <p className="text-sm text-gray-700">{comment}</p>
      </div>
    </div>
  );
};

export default AIComment;
