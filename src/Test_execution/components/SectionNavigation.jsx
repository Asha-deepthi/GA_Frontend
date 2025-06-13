import React, { useEffect, useState } from 'react';
import SectionItem from './SectionItem';
import { useParams } from 'react-router-dom';

const SectionNavigation = ({ onSectionSelect, completedSections }) => {
  const [sections, setSections] = useState([]);
  const { testId } = useParams();
useEffect(() => {
    // 3. CHECK IF testId EXISTS BEFORE FETCHING
    if (!testId) {
      console.error("Test ID is missing from the URL.");
      return;
    }

    // 4. USE THE DYNAMIC testId IN THE FETCH URL
    fetch(`http://localhost:8000/api/test-creation/tests/${testId}/sections/`, {
       method: 'GET',
    })
      .then(res => {
        if (!res.ok) {
           // This will help you see the 404 error more clearly
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setSections(data?.sections || data || []))
      .catch(err => console.error('Error fetching sections:', err));
      
  }, [testId]); // <-- 5. ADD testId TO THE DEPENDENCY ARRAY
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
