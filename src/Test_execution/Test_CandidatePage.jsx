import React from "react";
import Header from './components/Header';
import CandidateTable from './components/CandidateTable';

const CandidatePage = () => {
    return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex justify-center">
          <CandidateTable />
        </div>
    </div>
  );
};

export default CandidatePage;
