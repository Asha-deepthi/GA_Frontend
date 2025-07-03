import React from "react";

const CandidateCard = ({ candidate, onClick, isSelected }) => {
  const fullStars = Math.floor(candidate.rating);
  const halfStar = candidate.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  // Format experience string
  let experienceStr = "";
  if (Array.isArray(candidate.experience)) {
    experienceStr = `${candidate.experience.length} yrs EXP`;
  } else if (typeof candidate.experience === "string") {
    const parts = candidate.experience.split(":");
    experienceStr = parts.length > 1 ? `${parts[1].trim()}` : candidate.experience;
  } else {
    experienceStr = "N/A";
  }

  return (
    <div
     className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-150 ${
     isSelected ? "bg-teal-100 border border-teal-500 shadow" : "hover:bg-gray-100"
     }`}
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
          {candidate.gender} • Age {candidate.age} • {experienceStr}
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
