import React from "react";
import { FaArrowLeft, FaClock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { LuClock } from "react-icons/lu";
export default function CodeExecutionPage() {
  const navigate = useNavigate();
  const handleBack = () => navigate("/codingquestion");
  return (
    <div className="w-[1440px] h-screen overflow-x-auto bg-white">
      {/* Top Color Bar */}
      <div className="flex w-full h-[10px]">
        <div className="w-[288px] h-[10px] bg-red-500" />
        <div className="w-[288px] h-[10px] bg-orange-400" />
        <div className="w-[288px] h-[10px] bg-yellow-400" />
        <div className="w-[288px] h-[10px] bg-green-500" />
        <div className="w-[288px] h-[10px] bg-cyan-500" />
      </div>

      {/* Container */}
      <div className="w-[1394px] h-[857px] mx-auto mt-10 rounded-[20px] p-0 gap-[10px] flex flex-col">
        {/* Top Section with Back Button and Timer */}
        <div className="w-[1250px] h-[84px] px-[30px] pt-[20px] pb-[20px] flex justify-between items-center">
          <div className="w-[1036px] h-[24px] flex items-center gap-[155px]">
            <div className="w-[62.71px] h-[24px] flex items-center gap-[10px] rounded-full">
              <FaArrowLeft className="text-gray-600" />
              <span onClick={handleBack} className="text-sm text-gray-600">Back</span>
            </div>
          </div>
          <div className="w-[115px] h-[44px] flex items-center justify-center bg-[#E0302D0D] border border-[#E0302D] rounded-full px-[20px] py-[10px] gap-[10px]">
            <LuClock className="text-[#E0302D]" />
            <span className="text-[#E0302D] font-semibold">20:00</span>
          </div>
        </div>

        {/* Middle Section: Question and Compiler */}
        <div className="flex gap-[30px]">
          {/* Left: Question */}
          <div className="w-[396px] h-[686px] p-[30px] rounded-[10px] border border-[#00A3984D] bg-white">
            <p className="w-[336px] h-[210px] text-[20px] leading-[30px] font-[400] text-black font-[Overpass]">
              1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ?
            </p>
          </div>

          {/* Right: Compiler and Output */}
          <div className="w-[764px] h-[686px] p-[15px] rounded-[10px] gap-[15px] border border-[#00A3982E] bg-white bg-opacity-30 flex flex-col justify-between">
            {/* Compiler Section */}
            <div className="w-[734px] h-[487px] flex flex-col gap-[15px]">
              <img src="/images/compiler.png" alt="Compiler" className="w-[734px] h-[487px] rounded-[5px]" />
              <div className="w-full flex justify-end">
                <div className="w-[236px] h-[36px] flex gap-[15px]">
                  <button className="w-[81px] h-[36px] bg-[#8AC43F] text-white text-[14px] font-medium leading-[20px] whitespace-nowrap px-[24px] py-[8px] rounded-full">
                    Save
                  </button>
                  <button className="w-[140px] h-[36px] bg-[#F5901D] text-white text-[14px] font-medium leading-[20px] whitespace-nowrap px-[24px] py-[8px] rounded-full">
                    RUN the Code
                  </button>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="w-[734px] h-[154px] p-[10px] rounded-[5px] gap-[5px] border border-gray-300">
              <img src="/images/output.png" alt="Output" className="w-full h-full object-cover rounded-[5px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
