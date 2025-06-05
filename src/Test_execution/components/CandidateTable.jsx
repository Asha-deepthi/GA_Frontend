import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import CandidateRow from "./CandidateRow";

const designations = ["UI/UX Designer", "Frontend Developer", "Backend Engineer", "QA Tester", "Product Manager"];
const departments = ["Technology", "Design", "HR", "Marketing"];
const dates = ["16 April, 2025", "18 April, 2025", "22 April, 2025", "24 April, 2025", "30 April, 2025"];

const candidates = new Array(40).fill(null).map((_, i) => ({
  jobId: `AMZ-${String(i + 1).padStart(3, '0')}`,
  name: `Candidate ${i + 1}`,
  email: `candidate${i + 1}@email.com`,
  department: departments[i % departments.length],
  designation: designations[i % designations.length],
  mobile: "9999999999",
  interviewDate: dates[i % dates.length],
  avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
}));

const CandidateTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroupStart, setPageGroupStart] = useState(1);
  const itemsPerPage = 10;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
    setPageGroupStart(1);
  };

   const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation =
      selectedDesignations.length === 0 || selectedDesignations.includes(candidate.designation);

    const matchesDepartment =
      selectedDepartments.length === 0 || selectedDepartments.includes(candidate.department);

    const matchesDate =
      selectedDates.length === 0 || selectedDates.includes(candidate.interviewDate);

    return matchesSearch && matchesDesignation && matchesDepartment && matchesDate;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const currentCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextGroup = () => {
    if (pageGroupStart + 4 <= totalPages) {
      setPageGroupStart(pageGroupStart + 4);
      setCurrentPage(pageGroupStart + 4);
    }
  };

  const handlePrevGroup = () => {
    if (pageGroupStart - 4 >= 1) {
      setPageGroupStart(pageGroupStart - 4);
      setCurrentPage(pageGroupStart - 4);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-[95%] mx-auto mt-10 px-6 py-4 space-y-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            setPageGroupStart(1);
          }}
          placeholder="Search by Name or Job ID..."
          className="w-[350px] h-[50px] px-4 border rounded-md shadow-sm font-roboto text-[16px] focus:outline-none"
        />

        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-teal-500 text-white rounded-md px-4 py-2"
          >
            Filters
          </button>
          <button className="bg-[#00A2CA] text-white rounded-md px-4 py-2">Add Candidate</button>
          <button onClick={() => navigate("/evaluation")} className="bg-[#00A2CA] text-white rounded-md px-4 py-2">Evaluations</button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            isMulti
            options={designations.map(d => ({ value: d, label: d }))}
            className="w-[200px]"
            placeholder="Designation"
            onChange={(selected) => setSelectedDesignations(selected.map(s => s.value))}
          />
          <Select
            isMulti
            options={departments.map(d => ({ value: d, label: d }))}
            className="w-[200px]"
            placeholder="Department"
            onChange={(selected) => setSelectedDepartments(selected.map(s => s.value))}
          />
          <Select
            isMulti
            options={dates.map(d => ({ value: d, label: d }))}
            className="w-[200px]"
            placeholder="Interview Date"
            onChange={(selected) => setSelectedDates(selected.map(s => s.value))}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full table-auto font-roboto">
          <thead className="bg-gray-100 text-gray-700 text-left font-semibold text-[15px]">
            <tr className="h-[52px]">
              <th className="px-4 py-2">Job ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Designation</th>
              <th className="px-4 py-2">Mobile No</th>
              <th className="px-4 py-2">Interview Scheduled</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((c, i) => (
              <CandidateRow key={i} candidate={c} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={handlePrevGroup}
          disabled={pageGroupStart === 1}
          className="w-[30px] h-[30px] rounded-md border text-sm text-gray-500"
        >
          &larr;
        </button>

        {[...Array(4)].map((_, idx) => {
          const page = pageGroupStart + idx;
          if (page > totalPages) return null;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-[30px] h-[30px] rounded-md border font-roboto text-sm ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={handleNextGroup}
          disabled={pageGroupStart + 4 > totalPages}
          className="w-[30px] h-[30px] rounded-md border text-sm text-gray-500"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default CandidateTable;
