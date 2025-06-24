import React from 'react';
import { ChevronRight } from 'lucide-react';

const SectionItem = ({ title, progress, onClick, disabled, isActive }) => {
  const containerClasses = `
    flex items-center justify-between w-[320px] h-[56px] px-4 rounded 
    ${isActive ? 'bg-[#00A3981A] border border-[#00A398]' : 'border border-transparent'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
    ${isActive && !disabled ? 'text-[#0F1417] font-semibold' : ''}
    ${!isActive && !disabled ? 'text-[#64748B]' : ''}
    ${disabled ? 'text-gray-400' : ''}
  `;

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={containerClasses}
    >
      <div className="text-[16px] leading-[24px] font-[Lexend]">
        {title} <span className="ml-2">{progress}</span>
      </div>
      <div className="w-[28px] h-[28px] flex items-center justify-center">
        <ChevronRight size={24} color={disabled ? "#A0AEC0" : "#0F1417"} />
      </div>
    </div>
  );
};

export default SectionItem;
