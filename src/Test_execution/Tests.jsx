import React, { useState } from "react";
import Header from "./components/Header";
import { Search } from "lucide-react";

export const testData = [
    {
        title: "Software Engineer Assessment",
        date: "2024-03-15",
        assigned: 150,
        attended: 120,
        attempted: 110,
        progress: 75,
    },
    {
        title: "Product Manager Aptitude Test",
        date: "2024-03-20",
        assigned: 80,
        attended: 70,
        attempted: 65,
        progress: 90,
    },
    {
        title: "Marketing Specialist Skills Test",
        date: "2024-03-25",
        assigned: 100,
        attended: 90,
        attempted: 85,
        progress: 60,
    },
    {
        title: "Data Analyst Proficiency Exam",
        date: "2024-03-30",
        assigned: 120,
        attended: 100,
        attempted: 95,
        progress: 80,
    },
    {
        title: "UX Designer Evaluation",
        date: "2024-04-06",
        assigned: 60,
        attended: 50,
        attempted: 45,
        progress: 70,
    },
];

const Test = () => {
    const [searchText, setSearchText] = useState("");

    const filtered = testData.filter((t) =>
        t.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="min-h-screen  bg-gray-50 overflow-hidden">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search + Filters */}
                <div className="flex flex-col gap-3 mb-6">
                    {/* Search Bar */}
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Search  by test title"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-[#F5F7FA] text-sm text-[#5C708A] placeholder-[#5C708A] focus:outline-none"
                        />
                    </div>

                    {/* Dropdowns */}
                    <div className="flex gap-2">
                        <select
                            className="w-[124px] h-[48px] pl-4 pr-2 bg-[#F5F7FA] text-sm text-[#0F1417] rounded-full focus:outline-none cursor-pointer"
                        >
                            <option>Date range</option>
                            <option>This week</option>
                            <option>This month</option>
                        </select>

                        <select
                            className="w-[168px] h-[48px] pl-4 pr-2 bg-[#F5F7FA] text-sm text-[#0F1417] rounded-full focus:outline-none cursor-pointer"
                        >
                            <option>Evaluation Status</option>
                            <option>Pending</option>
                            <option>Reviewed</option>
                        </select>
                    </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr className=" w-[1200px] h-[88px] text-left text-[#0F1417] text-[14px] leading-[21px] tracking-[0px] font-[500] font-['Public_Sans']">
                                <th className="px-4 py-3 text-left">Test Title</th>
                                <th className="px-4 py-3 text-left">Test Date</th>
                                <th className="px-4 py-3 text-left">Number of Candidates Assigned</th>
                                <th className="px-4 py-3 text-left">Attended</th>
                                <th className="px-4 py-3 text-left">Attempted</th>
                                <th className="px-4 py-3 text-left">Evaluation Progress</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((test, idx) => (
                                    <tr
                                        key={idx}
                                        className="w-[1200px] h-[143px] border-t hover:bg-gray-50 transition-colors text-[14px] leading-[21px] tracking-[0px] font-[400] font-['Public_Sans'] text-[#0F1417]"
                                    >
                                        <td className="px-4 py-3">{test.title}</td>
                                        <td className="px-4 py-3">{test.date}</td>
                                        <td className="px-4 py-3">{test.assigned}</td>
                                        <td className="px-4 py-3">{test.attended}</td>
                                        <td className="px-4 py-3">{test.attempted}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 h-1 rounded">
                                                    <div
                                                        className="h-1 rounded"
                                                        style={{ width: `${test.progress}%`, backgroundColor: "#D4DBE3" }}
                                                    />

                                                </div>
                                                <span className="text-xs font-medium">
                                                    {test.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 space-x-2 text-sm" style={{ color: "#5C708A" }}>
                                            <button className="hover:underline">View Candidates</button>
                                            <span>|</span>
                                            <button className="hover:underline">
                                                Download Summary Report (PDF)
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-400">
                                        No results found.
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

export default Test;
