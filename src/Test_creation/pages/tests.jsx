import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';

function Positions() {
  const navigate = useNavigate();

  const positions = [
    {
      id: 1,
      title: "Senior Digital Media Planner",
      description:
        "Work closely with agencies to develop strategies and integrated media planning to deliver measurable, impactful media plans and creative that deliver results and...",
      applications: 20,
      noResponse: 12,
      pending: 7,
      declined: 0,
      hired: 1,
    },
    {
      id: 2,
      title: "Senior Digital Media Planner",
      description:
        "Work closely with agencies to develop strategies and integrated media planning to deliver measurable, impactful media plans and creative that deliver results and...",
      applications: 20,
      noResponse: 12,
      pending: 7,
      declined: 0,
      hired: 1,
    },
    {
      id: 3,
      title: "Senior Digital Media Planner",
      description:
        "Work closely with agencies to develop strategies and integrated media planning to deliver measurable, impactful media plans and creative that deliver results and...",
      applications: 20,
      noResponse: 12,
      pending: 7,
      declined: 0,
      hired: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar imported here */}
      <NavBar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-5 py-8">
        {positions.map((position) => (
          <div
            key={position.id}
            className="bg-white p-6 rounded-lg shadow mb-6"
            onClick={() => navigate('/test-candidates')}
          >
            <div className="flex justify-between gap-8">
              {/* Left: Title & Description */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {position.title}
                </h3>
                <p className="text-sm text-gray-500 max-w-lg">
                  {position.description}
                </p>
              </div>

              {/* Right: Stats */}
              <div className="flex gap-12 flex-shrink-0">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {position.applications}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {position.noResponse}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">No Response</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {position.pending}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {position.declined}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Declined</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {position.hired}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Hired</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Positions;
