import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const navigate = useNavigate(); 

  return (
    <div className="relative w-[1440px] h-[75px] bg-[#F0F0F1]">
      {/* Gray Box (Left) */}
      <div className="absolute top-[15px] left-[36px] w-[144.78px] h-[50px] bg-[#00000033]" />

      {/* Navigation Center */}
      <div className="absolute top-[25px] left-[243px] flex gap-[42px]">
        <div
          onClick={() => navigate("/dashboard")}
          className="w-[120px] h-[32px] cursor-pointer text-black text-[21px] font-lato font-normal leading-[32px] text-center flex items-center justify-center"
        >
          Home
        </div>

        {/* Evaluations (active) */}
        <div className="relative w-[120px] h-[52.88px] flex flex-col items-center justify-center">
          <div className="w-[120px] h-[32px] cursor-pointer text-[#00A398] text-[21px] font-lato font-black leading-[32px] flex items-center justify-center">
            Evaluations
          </div>
          <div className="w-[35px] h-[5px] bg-[#00A398] rounded-[10px] mt-[10px]" />
        </div>

        {/* Positions */}
        <div
         onClick={() => navigate("/importform")}
         className="w-[120px] h-[32px] cursor-pointer text-black text-[21px] font-lato font-normal leading-[32px] text-center flex items-center justify-center">
          Positions
        </div>
      </div>

      {/* Profile Section (Right) */}
      <div className="absolute top-[28px] left-[1250px] w-[130px] h-[30px] flex items-center justify-end">
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default Header;
