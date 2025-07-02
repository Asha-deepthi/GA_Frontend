import { useParams, useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import TopHeader from './components/TopHeader';
import AuthContext from "../Test_creation/contexts/AuthContext";
import BASE_URL from "../config";

const TestSubmission = () => {
    const { candidateTestId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userName = user?.name || 'Guest';
    const handleSubmit = async () => {
    console.log("Submit button clicked");
    try {
        const response = await fetch(`${BASE_URL}/test-creation/submit-test/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                candidate_test_id: candidateTestId,
            }),
        });

        const data = await response.json();
        console.log("API response:", data);

        if (response.ok) {
            alert("Test submitted successfully!");
            navigate("/thank-you");
        } else {
            alert("Submission failed: " + data.error);
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("Something went wrong while submitting the test.");
    }
};


    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="min-h-screen flex flex-col">
                <TopHeader userName={userName} />

                <div className="flex flex-col items-center justify-center flex-1 gap-4 px-2 py-10">
                    <img
                        src="/images/checkmark.png"
                        alt="Checkmark"
                        className="w-[350px] h-[250px] max-w-full"
                    />
                    <h2 className="text-center text-[#0F1417] font-bold text-[24px] leading-[32px] w-[928px] h-[35px]">
                        Submit Your Test?
                    </h2>
                    <p className="text-center text-[#0F1417] font-normal text-[16px] leading-[22px] w-[928px] h-[24px]">
                        Are you sure you want to submit your test? You won’t be able to make changes after this.
                    </p>

                    <div className="flex gap-4 mt-4">
                        <button onClick={() => navigate(-1)} className="w-[140px] h-[36px] rounded-[10px] bg-[#EBEDF2] text-black font-semibold">
                            Back
                        </button>
                        <button onClick={handleSubmit} className="w-[180px] h-[36px] rounded-[12px] bg-[#00A398] text-white font-semibold">
                            Confirm Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestSubmission;
