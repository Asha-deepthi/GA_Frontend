import React, { useEffect, useState } from 'react';
import SectionItem from './SectionItem';

const SectionNavigation = ({
  onSectionSelect,
  completedSections,
  testId,
  candidateTestId,
  selectedSectionId,
  sections = [],
}) => {
  if (!Array.isArray(sections)) {
  console.error("Invalid sections data:", sections);
  return <p className="text-sm text-red-500">Sections data not available.</p>;
}

  if (sections.length === 0)
    return <p className="text-sm text-gray-500">No sections available.</p>;

  return (
    <div className="px-4">
      <h2 className="text-[16px] font-bold mt-4 mb-2">Section Navigation</h2>
      {sections.map((section) => {
        const progress = `${section.attempted_questions || 0}/${section.total_questions || 0}`;
        const isCompleted = completedSections.includes(section.section_id);

        return (
          <SectionItem
            key={section.section_id}
            title={
              isCompleted
                ? ` ${section.section_name || `Section ${section.section_id}`}`
                : section.section_name || `Section ${section.section_id}`
            }
            progress={progress}
            onClick={() => !isCompleted && onSectionSelect(section.section_id)}
            disabled={isCompleted}
            isActive={selectedSectionId === section.section_id}
          />
        );
      })}
    </div>
  );
};

export default SectionNavigation;
