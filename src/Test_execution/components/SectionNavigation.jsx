import React, { useEffect, useState } from 'react';
import SectionItem from './SectionItem';

const SectionNavigation = ({ onSectionSelect, completedSections, testId, candidateTestId , selectedSectionId, refreshTrigger}) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSectionProgress = () => {
    if (!testId || !candidateTestId) {
      console.error("Missing testId or candidateTestId.");
      return;
    }

    setLoading(true);

    fetch(`http://localhost:8000/api/test-execution/candidate-section-progress/?test_id=${testId}&candidate_test_id=${candidateTestId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSections(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching section progress:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSectionProgress();
  }, [testId, candidateTestId, refreshTrigger]); // ✅ re-fetch when refreshTrigger changes

  if (loading) return <p className="text-sm text-gray-500">Loading sections...</p>;
  if (sections.length === 0) return <p className="text-sm text-gray-500">No sections available.</p>;

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
