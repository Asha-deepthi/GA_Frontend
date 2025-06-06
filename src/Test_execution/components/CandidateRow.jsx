import React from "react";
import { Eye, Pencil, Trash } from "lucide-react";

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
        <button className="p-2 rounded-md bg-purple-100 text-purple-600">
        <Eye className="w-3 h-3" />
        </button>
        <button className="p-2 rounded-md bg-green-100 text-green-600">
        <Pencil className="w-3 h-3" />
        </button>
        <button className="p-2 rounded-md bg-red-100 text-red-600">
        <Trash className="w-3 h-3" />
        </button>
      </td>
    </tr>
  );
};

export default CandidateRow;
