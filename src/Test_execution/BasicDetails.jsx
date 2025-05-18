import React, { useState } from 'react';

const FormPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    try {
      const response = await fetch('http://127.0.0.1:8000/test-execution/submit-details/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone_number: phone,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Details submitted successfully!');
        setName('');
        setEmail('');
        setPhone('');
      } else {
        alert('Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error submitting details:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="w-screen h-screen overflow-auto bg-white">
      {/* Top color bar */}
      <div className="w-full h-[10px] flex">
        <div className="flex-1 bg-[#C0392B]" />
        <div className="flex-1 bg-[#E67E22]" />
        <div className="flex-1 bg-[#F1C40F]" />
        <div className="flex-1 bg-[#27AE60]" />
        <div className="flex-1 bg-[#1ABC9C]" />
      </div>

      {/* Header */}
      <div className="w-[1250px] h-[44px] mt-[35px] ml-[95px] flex justify-between items-center">
        <div className="w-[197.78px] h-[40px] bg-gray-300 " />
        <button className="flex items-center justify-center w-[105px] h-[44px] border border-red-500 text-red-500 bg-red-50 rounded-full text-base font-medium">
          ❓ FAQs
        </button>
      </div>

      {/* Main Heading */}
      <div className="text-center mt-12">
        <h1 className="font-extrabold text-[40px] leading-[48px] font-[Overpass] text-black">
          You're just steps away from your dream job.
        </h1>
        <p className="font-normal text-[20px] leading-[28px] font-[Overpass] text-gray-600 mt-2">
          Mention the necessary details below to proceed!!
        </p>
      </div>

      {/* Form Box */}
      <div className="w-[600px] h-[501px] mt-12 mb-40 mx-auto bg-[#F7FCFC] border border-teal-100 rounded-[10px] shadow-lg relative">
        <div className="absolute top-0 right-0 w-[5px] h-full bg-teal-500 rounded-r-[10px]" />
        <div className="absolute bottom-0 left-0 w-full h-[5px] bg-teal-500 rounded-b-[10px]" />

        <div className="p-6 relative z-10">
          <p className="w-[515px] h-[36px] font-bold text-[28px] text-black leading-[36px] font-[Overpass] mb-6">
            Fill the Basic Details
          </p>

          {/* ✅ FORM STARTS HERE */}
          <form onSubmit={handleSubmit}>
            <div className="w-[515px] gap-[20px] flex flex-col">
              <div className="w-[515px] h-[72px] flex flex-col gap-[4px]">
                <label className="font-medium text-[14px] text-black leading-[20px] font-[Overpass]">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[515px] h-[48px] px-3 border border-gray-300 bg-white text-gray-700 rounded-[3px]"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="w-[515px] h-[72px] flex flex-col gap-[4px]">
                <label className="font-medium text-[14px] text-black leading-[20px] font-[Overpass]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[515px] h-[48px] px-3 border border-gray-300 bg-white text-gray-700 rounded-[3px]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="w-[515px] h-[72px] flex flex-col gap-[4px]">
                <label className="font-medium text-[14px] text-black leading-[20px] font-[Overpass]">Phone No.</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-[515px] h-[48px] px-3 border border-gray-300 bg-white text-gray-700 rounded-[3px]"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="w-[206px] h-[44px] gap-[10px] mt-12 ml-auto flex">
              <button
                type="button"
                className="w-[99px] h-[44px] border border-teal-600 bg-white text-teal-600 rounded-full px-[30px] py-[10px]"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-[97px] h-[44px] bg-[#00A398] text-white rounded-full px-[30px] py-[10px]"
              >
                Next
              </button>
            </div>
          </form>
          {/* ✅ FORM ENDS HERE */}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
