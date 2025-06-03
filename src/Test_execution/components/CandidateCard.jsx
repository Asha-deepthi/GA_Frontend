import React from "react";

const CandidateCard = ({ candidate, onClick }) => {
  const fullStars = Math.floor(candidate.rating);
  const halfStar = candidate.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div
      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <img
        src={candidate.avatar || "/avatar-placeholder.png"}
        alt={candidate.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{candidate.name}</h4>
        <p className="text-xs text-gray-500">
          {candidate.gender} • Age {candidate.age} • {candidate.experience.split(":")[1] || ""} EXP
        </p>
        <div className="text-yellow-500 text-xs mt-1">
          {"★".repeat(fullStars)}
          {halfStar ? "½" : ""}
          {"☆".repeat(emptyStars)}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
