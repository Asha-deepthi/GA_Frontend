import React, { useState } from 'react';
import MicrophoneStatus from './MicrophoneStatus';
import SectionNavigation from './SectionNavigation';

const SidebarLayout = ({ selectedSectionId, completedSections, onSelectSection, testId, candidateTestId, sections, }) => {
  return (
    <div className="w-[320px] h-[327px] bg-white shadow rounded-md">
      <MicrophoneStatus />
      <SectionNavigation
        selectedSectionId={selectedSectionId}
        completedSections={completedSections}
        onSectionSelect={onSelectSection}
        candidateTestId={candidateTestId}  
        testId={testId}
        sections={sections}
      />
    </div>
  );
};

export default SidebarLayout;
