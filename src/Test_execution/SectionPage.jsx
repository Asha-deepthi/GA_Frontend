import React, { useState } from "react";
import SectionComponent from "./components/SectionComponent";

const apiurl = "http://localhost:8000/api/test-creation";

const sections = [
  { id: 1, name: "Section 1" },
  { id: 2, name: "Section 2" },
];

const SectionPage = () => {
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      {selectedSectionId ? (
        <>
          <button
            className="absolute top-4 left-4 px-4 py-2 bg-black text-white border border-black rounded hover:bg-white hover:text-black transition"
            onClick={() => setSelectedSectionId(null)}
          >
            ← Back to Sections
          </button>
          <SectionComponent section_id={selectedSectionId} apiurl={apiurl} />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Select a Section</h1>
          <div className="flex flex-col gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                className="px-6 py-3 text-lg bg-black text-white border border-black rounded hover:bg-white hover:text-black transition"
                onClick={() => setSelectedSectionId(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SectionPage;
