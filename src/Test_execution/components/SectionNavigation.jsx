import React, { useEffect, useState } from 'react';
import SectionItem from './SectionItem';

const SectionNavigation = ({ onSectionSelect, completedSections }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/test-creation/tests/1/sections/', {
       method: 'GET',
      //credentials: 'include', // Add if session auth
    })
      .then(res => res.json())
      .then(data => setSections(data?.sections || data || []))
      .catch(err => console.error('Error fetching sections:', err));
  }, []);

  return (
    <div className="px-4">
      <h2 className="text-[16px] font-bold mt-4 mb-2">Section Navigation</h2>
      {sections.length === 0 ? (
        <p className="text-sm text-gray-500">Loading sections...</p>
      ) : (
        sections.map((section) => {
          const progress = `${section.answered || 0}/${section.total || 0}`;
          const isCompleted = completedSections.includes(section.id);

          return (
            <SectionItem
              key={section.id}
              title={`Section ${section.id}`}
              progress={progress}
              onClick={() => !isCompleted && onSectionSelect(section.id)}
              disabled={isCompleted}
            />
          );
        })
      )}
    </div>
  );
};

export default SectionNavigation;
