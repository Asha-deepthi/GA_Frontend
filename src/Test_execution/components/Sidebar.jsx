import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const Sidebar = ({ candidates, onSelect }) => {
  const [sortBy, setSortBy] = useState(null); // 'rating' | 'experience' | 'age' | null

  // Convert experience string like "Store Manager: 2018 - 2019" to number of years
  const getExperienceYears = (expStr) => {
    const match = expStr.match(/(\d{4})\s*-\s*(\d{4})/);
    return match ? parseInt(match[2]) - parseInt(match[1]) : 0;
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "experience")
      return getExperienceYears(b.experience) - getExperienceYears(a.experience);
    if (sortBy === "age") return a.age - b.age;
    return 0;
  });

  return (
    <div className="w-72 bg-white border-r p-4 overflow-y-auto">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search Candidate"
          className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* Filter and Sort Buttons */}
      <div className="flex gap-2 mb-4">
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700">
          <SlidersHorizontal size={14} /> All evaluations
        </button>
        <div className="relative">
          <button
            onClick={() =>
              setSortBy((prev) =>
                prev === "rating" ? "experience" : prev === "experience" ? "age" : "rating"
              )
            }
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700"
          >
            <ArrowUpDown size={14} /> Sort by
          </button>
          <p className="text-xs text-gray-400 mt-1 text-center">
            {sortBy ? `Sorted by ${sortBy}` : "No sort"}
          </p>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-2">
        {sortedCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onClick={() => onSelect(candidate)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
