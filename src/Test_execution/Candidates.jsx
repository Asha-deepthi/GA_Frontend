import React, { useState } from "react";
import Header from "./components/Header";

const candidates = [
  {
    date: "18/05/2025",
    testName: "UI/UX designer",
    name: "Ethan Harper",
    email: "ethan.harper@email.com",
    candidateId: "CAND-12345",
    status: "Completed",
    score: "85%",
    evaluation: "Pending",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  {
    date: "22/05/2025",
    testName: "Frontend Developer",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    candidateId: "CAND-67890",
    status: "Completed",
    score: "90%",
    evaluation: "Reviewed",
  },
  // Repeat/add more as needed
];

const CandidatesPage = () => {
  const [searchText, setSearchText] = useState("");
  const filteredCandidates = candidates.filter((c) => {
    const search = searchText.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.candidateId.toLowerCase().includes(search)
    );
  });
  return (
    <div className="min-h-screen  bg-gray-50 overflow-hidden">
      <Header />

      <div className="min-w-[1024px] max-w-7xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary 
              text-[#0F1417] text-[14px] leading-[21px] tracking-[0px] font-[400] font-['Public_Sans']"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr className=" w-[1200px] h-[88px] text-left text-[#0F1417] text-[14px] leading-[21px] tracking-[0px] font-[500] font-['Public_Sans']">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Test Name</th>
                <th className="px-4 py-3">Candidate Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Candidate ID</th>
                <th className="px-4 py-3">Test Status</th>
                <th className="px-4 py-3">Test Score %</th>
                <th className="px-4 py-3">Evaluation Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((c, idx) => (
                <tr
                  key={idx}
                  className="w-[1200px] h-[143px] border-t hover:bg-gray-50 transition-colors text-[14px] leading-[21px] tracking-[0px] font-[400] font-['Public_Sans'] text-[#0F1417]"
                >
                  <td className="px-4 py-3">{c.date}</td>
                  <td className="px-4 py-3">{c.testName}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-[#5C708A]">{c.email}</td>
                  <td className="px-4 py-3 text-[#5C708A]">{c.candidateId}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-[#EBEDF2] text-[#0F1417] text-xs font-semibold">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5C708A]">{c.score}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-[#EBEDF2] text-[#0F1417] text-xs font-semibold">
                      {c.evaluation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5C708A]">
                    <button className="hover:underline font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ):(
                <tr>
                      <td colSpan="9" className="text-center py-6 text-[#5C708A]">
                        No candidates found.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;
