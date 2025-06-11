import React from "react";
import TopHeader from './components/TopHeader';

const TestSubmission = ({ onSubmit, onBack }) => {
    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <TopHeader />

                {/* Centered Content */}
                <div className="flex flex-col items-center justify-center flex-1 gap-6 px-4 py-24">
                    <img
                        src="images/checkmark.png"
                        alt="Checkmark"
                        className="w-[643px] h-[450px] max-w-full"
                    />

                    <h2 className="text-center text-[#0F1417] font-bold text-[28px] leading-[35px] w-[928px] h-[35px] font-['Public_Sans']">
                        Submit Your Test?
                    </h2>

                    <p className="text-center text-[#0F1417] font-normal text-[16px] leading-[24px] w-[928px] h-[24px] font-['Public_Sans']">
                        Are you sure you want to submit your test? You won’t be able to make changes after this.
                    </p>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={onBack}
                            className="w-[187px] h-[40px] rounded-[12px] bg-[#EBEDF2] text-black font-semibold"
                        >
                            Back
                        </button>
                        <button
                            onClick={onSubmit}
                            className="w-[249px] h-[40px] rounded-[12px] bg-[#00A398] text-white font-semibold"
                        >
                            Confirm Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestSubmission;
