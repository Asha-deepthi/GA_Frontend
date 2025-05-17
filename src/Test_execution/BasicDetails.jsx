import React, { useState } from 'react';
import { FaQuestionCircle } from "react-icons/fa";

const BasicDetails = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Data:', { name, email, phone });
    };

    return (
        <div className="w-screen h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden font-overpass">
            {/* Top Color Bar */}
            <div className="absolute top-0 left-0 w-full h-[10px] flex">
                <div className="flex-1 bg-red-500" />
                <div className="flex-1 bg-orange-400" />
                <div className="flex-1 bg-yellow-400" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-cyan-500" />
            </div>

            {/* FAQs Button */}
            <header
                className="flex items-center justify-between px-10 py-4 absolute"
                style={{
                    top: "50px",
                    left: "50%",
                    width: "90%",
                    maxWidth: "1250px",
                    transform: "translateX(-50%)",
                }}
            >
                <div className="w-36 h-6 rounded" style={{ background: '#00000033' }} />

                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center"
                        style={{
                            width: '107px',
                            height: '44px',
                            gap: '10px',
                            padding: '10px 22px 10px 20px',
                            background: '#E0302D0D',
                            border: '1px solid #E0302D',
                            borderRadius: '70px',
                        }}
                    >
                        <FaQuestionCircle
                            style={{
                                fontFamily: 'Font Awesome 6 Free',
                                fontWeight: 500,
                                fontSize: '18px',
                                lineHeight: '24px',
                                color: '#E0302D',
                            }}
                        />
                        <span
                            style={{
                                fontFamily: 'Overpass',
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '24px',
                                textAlign: 'center',
                                color: '#E0302D',
                            }}
                        >
                            FAQs
                        </span>
                    </button>

                    <div
                        style={{
                            width: '90px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                            padding: '8px',
                        }}
                    />
                </div>
            </header>

            {/* Heading */}
            <div className="text-center mt-16 px-4 max-w-full">
                <h1 className="text-2xl font-bold mb-2 text-black">
                    You're just steps away from your dream job.
                </h1>
                <p className="text-gray-600">
                    Mention the necessary details below to proceed!!
                </p>
            </div>

            {/* Form Box with Gradient Background */}
            <div
                className="border-r-4 border-b-4 border-teal-500 shadow-[-4px_-4px_10px_rgba(0,0,0,0.1)] rounded-xl mt-10 p-8 w-full max-w-md"
                style={{
                    background: `linear-gradient(0deg, rgba(0, 163, 152, 0.03), rgba(0, 163, 152, 0.03)), 
               #FFFFFF`
                }}
            >
                <h2 className="text-lg font-semibold mb-6 text-black">Fill the Basic Details</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-black">Your Name</label>
                        <input
                            type="text"
                            placeholder=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Email</label>
                        <input
                            type="email"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Phone No.</label>
                        <input
                            type="tel"
                            placeholder=""
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-700"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-end gap-2 pt-4">
                        <button
                            type="button"
                            className="px-6 py-2 text-teal-500 bg-white border border-teal-500 rounded-full hover:bg-teal-50 hover:border-teal-600 transition flex-grow sm:flex-grow-0"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition flex-grow sm:flex-grow-0"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BasicDetails;
