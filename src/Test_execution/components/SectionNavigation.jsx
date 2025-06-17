import React, { useEffect, useState } from 'react';
import SectionItem from './SectionItem';
import { useParams } from 'react-router-dom';

const SectionNavigation = ({ onSectionSelect, completedSections, candidateTestId }) => {
  const [sections, setSections] = useState([]);
  const { testId } = useParams();

  useEffect(() => {
    if (!testId || !candidateTestId) {
      console.error("Missing testId or candidateTestId.");
      return;
    }

    fetch(`http://localhost:8000/test-execution/candidate-section-progress/?test_id=${testId}&candidate_test_id=${candidateTestId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setSections(data || []))
      .catch((err) => console.error("Error fetching section progress:", err));
  }, [testId, candidateTestId]);

  return (
    <div className="px-4">
      <h2 className="text-[16px] font-bold mt-4 mb-2">Section Navigation</h2>
      {sections.length === 0 ? (
        <p className="text-sm text-gray-500">Loading sections...</p>
      ) : (
        sections.map((section) => {
          const progress = `${section.attempted_questions || 0}/${section.total_questions || 0}`;
          const isCompleted = completedSections.includes(section.section_id);

          return (
            <SectionItem
              key={section.section_id}
              title={section.section_name || `Section ${section.section_id}`}
              progress={progress}
              onClick={() => !isCompleted && onSectionSelect(section.section_id)}
              disabled={isCompleted}
            />
          );
        })
      )}
    </div>
  );
};

export default SectionNavigation;
