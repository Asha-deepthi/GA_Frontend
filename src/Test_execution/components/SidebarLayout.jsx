import React from 'react';
import MicrophoneStatus from './MicrophoneStatus';
import SectionNavigation from './SectionNavigation';

const SidebarLayout = ({ selectedSectionId, completedSections, onSelectSection }) => {
  return (
    <div className="w-[320px] h-[327px] bg-white shadow rounded-md">
      <MicrophoneStatus />
      <SectionNavigation
        selectedSectionId={selectedSectionId}
        completedSections={completedSections}
        onSectionSelect={onSelectSection}
      />
    </div>
  );
};

export default SidebarLayout;
