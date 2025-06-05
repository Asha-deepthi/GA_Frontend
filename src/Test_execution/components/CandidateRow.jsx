import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const CandidateRow = ({ candidate }) => {
  return (
    <tr className="border-b text-sm text-gray-700 font-roboto font-normal text-[14px] leading-[22px]">
      <td className="px-4 py-3">{candidate.jobId}</td>
      <td className="px-4 py-3 flex items-center gap-2">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="w-8 h-8 rounded-full"
        />
        {candidate.name}
      </td>
      <td className="px-4 py-3">{candidate.email}</td>
      <td className="px-4 py-3">{candidate.department}</td>
      <td className="px-4 py-3">{candidate.designation}</td>
      <td className="px-4 py-3">{candidate.mobile}</td>
      <td className="px-4 py-3">{candidate.interviewDate}</td>
      <td className="px-4 py-3 space-x-2 text-lg">
        <button className="text-blue-500 hover:text-blue-700">
          <FaEye />
        </button>
        <button className="text-green-500 hover:text-green-700">
          <FaEdit />
        </button>
        <button className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default CandidateRow;
