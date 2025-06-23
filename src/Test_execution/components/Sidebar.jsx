import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const Sidebar = ({ candidates, onSelect }) => {
  const [sortBy, setSortBy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [evaluationFilter, setEvaluationFilter] = useState("all");

  const getExperienceYears = (experienceArray) => {
  if (!Array.isArray(experienceArray)) return 0;

  let totalYears = 0;

  experienceArray.forEach(exp => {
    const match = exp.duration.match(/(\d{4})\s*-\s*(\d{4})/);
    if (match) {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        totalYears += end - start;
      }
    }
  });

  return totalYears;
};


  const filteredAndSortedCandidates = [...candidates]
    .filter((candidate) => {
      const matchesSearch = candidate.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        evaluationFilter === "all" ||
        candidate.evaluationStatus === evaluationFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience")
       return getExperienceYears(b.experience) - getExperienceYears(a.experience);
      if (sortBy === "age") return a.age - b.age;
      if (sortBy === "evaluation") {
        const order = { completed: 1, pending: 2, rejected: 3 };
        return (order[a.evaluationStatus] || 4) - (order[b.evaluationStatus] || 4);
      }
      return 0;
    });


  return (
    <div className="w-72 bg-white border-r p-4 overflow-y-auto relative">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search Candidate"
          className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter and Sort Buttons */}
      <div className="flex gap-2 mb-4 relative">
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700"
          >
            <SlidersHorizontal size={14} /> {evaluationFilter === "all" ? "All evaluations" : `Filtered: ${evaluationFilter}`}
          </button>

          {showFilterOptions && (
            <div className="absolute top-12 left-0 z-10 bg-white border shadow rounded-md w-44">
              {["all", "completed", "pending", "rejected"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setEvaluationFilter(option);
                    setShowFilterOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm capitalize"
                >
                  {option === "all" ? "All Evaluations" : option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortOptions(!showSortOptions)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700"
          >
            <ArrowUpDown size={14} /> Sort by
          </button>

          {showSortOptions && (
            <div className="absolute top-12 left-0 z-10 bg-white border shadow rounded-md w-40">
              {["age", "rating", "experience", "evaluation"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortBy(option);
                    setShowSortOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm capitalize"
                >
                  Sort by {option}
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-1 text-center">
            {sortBy ? `Sorted by ${sortBy}` : "No sort"}
          </p>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-2">
        {filteredAndSortedCandidates.length > 0 ? (
          filteredAndSortedCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.user}
              candidate={candidate}
              onClick={() => onSelect(candidate)}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center mt-4">No candidates found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
