import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/Navbar';

const InterviewDashboard = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('daily');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 3, 26));
  const [currentMonth, setCurrentMonth] = useState(3);
  const [currentYear, setCurrentYear] = useState(2025);
  const [activePage, setActivePage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const navigate = useNavigate();


  const userNames = [
    "John Smith", "Emma Johnson", "Michael Brown", "Olivia Davis",
    "William Wilson", "Sophia Martinez", "James Anderson", "Isabella Taylor",
    "Benjamin Thomas", "Mia Hernandez", "Jacob Moore", "Charlotte White"
  ];

  const candidatesData = [
    {
      id: "234(42)",
      name: "Ameer",
      role: "Help Desk Executive",
      department: "IT Department",
      date: "15 April 2025",
      status: "attended",
      checkin: "09:00",
      checkout: "09:15",
      completion: "15Min/ 30 min"
    },
    {
      id: "341(42)",
      name: "Sai",
      role: "Senior Executive",
      department: "Marketing",
      date: "15 April 2025",
      status: "absent",
      checkin: "09:00",
      checkout: "09:30",
      completion: "5m"
    },
    {
      id: "234(12)",
      name: "Siva",
      role: "Senior Manager",
      department: "Design",
      date: "15 April 2025",
      status: "passed",
      checkin: "10:30",
      checkout: "09:15",
      completion: "15Min/ 30 min"
    },
    {
      id: "234(21)",
      name: "Arjun",
      role: "Director",
      department: "Development",
      date: "15 April 2025",
      status: "rejected",
      checkin: "09:00",
      checkout: "10:00",
      completion: "60m/ 30 min"
    },
    {
      id: "234(42)",
      name: "Pavan",
      role: "Director",
      department: "Sales",
      date: "15 April 2025",
      status: "attended",
      checkin: "09:00",
      checkout: "09:15",
      completion: "15Min/ 30 min"
    },
    {
      id: "234(42)",
      name: "Jaya",
      role: "System coordinator",
      department: "IT Department",
      date: "15 April 2025",
      status: "attended",
      checkin: "8:50",
      checkout: "09:15",
      completion: "15Min/ 30 min"
    }
  ];

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const updateDateTime = () => {
    const now = new Date();
    
    // Format time
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const timeString = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
    setCurrentTime(timeString);
    
    // Format date
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const suffix = getDaySuffix(day);
    const dateString = `${day}${suffix} ${month} ${year}`;
    setCurrentDate(dateString);
  };

  useEffect(() => {
    // Set random user
    const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
    setCurrentUser(randomUser);
    
    // Update time initially and then every second
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
      if (!e.target.closest('.date-filter')) {
        setShowDatePicker(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getStatusBadgeClass = (status) => {
    const baseClass = "inline-block px-4 py-1 rounded-full text-xs text-center";
    switch (status) {
      case 'attended':
        return `${baseClass} bg-blue-100 text-blue-600`;
      case 'absent':
        return `${baseClass} bg-red-100 text-red-600`;
      case 'passed':
        return `${baseClass} bg-green-100 text-green-600`;
      case 'rejected':
        return `${baseClass} bg-gray-100 text-gray-600`;
      default:
        return baseClass;
    }
  };

  const filteredCandidates = candidatesData.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-300 cursor-default"></div>
      );
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = currentYear === selectedDate.getFullYear() &&
                        currentMonth === selectedDate.getMonth() &&
                        i === selectedDate.getDate();
      
      days.push(
        <div
          key={i}
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-gray-600 hover:bg-gray-100 ${
            isSelected ? 'bg-teal-600 text-white' : ''
          }`}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, i))}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  const formatSelectedDate = () => {
    const day = selectedDate.getDate();
    const month = selectedDate.toLocaleString('default', { month: 'long' });
    const year = selectedDate.getFullYear();
    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${month} ${year}`;
  };

  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleApplyDate = () => {
    setShowDatePicker(false);
    alert(`Date filter applied: ${formatSelectedDate()}`);
  };

  const handleSort = (column) => {
    alert(`Sorting by ${column}`);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page !== '...') {
      alert(`Going to page ${page}`);
    }
  };

  const handleApplyFilters = () => {
    alert('Advanced filters applied');
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilterStatus('');
    setFilterDepartment('');
    setFilterFromDate('');
    setFilterToDate('');
    alert('Filters reset');
  };
 /*const handleLogout = () => {
  localStorage.removeItem("authTokens");
  sessionStorage.removeItem("authTokens");
  setShowProfileMenu(false);
  navigate("/login");
};*/
const handleLogout = () => {
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
sessionStorage.removeItem('access_token');
sessionStorage.removeItem('refresh_token');

    // Navigate to login
    window.location.href = '/login';
  };

const handleNavClick = (navItem) => {
    const path = navItem.toLowerCase().replace(' ', ''); // e.g., 'createtest'
    setActiveNav(path); // Update style

    if (path === 'dashboard') {
        navigate('/dashboard');
    } else if (path === 'createtest') {
        navigate('/QuizCreationFlow');
    } else {
        // For other links like 'Tests' and 'Candidates'
        navigate(`/${path}`);
    }
  };
 return (
    <div className="min-h-screen bg-gray-50 text-gray-600 font-sans">
      <NavBar />
      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-5 mb-8">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-gray-400 text-2xl mb-3">☀</div>
            <div className="text-lg font-bold text-gray-600">{currentTime}</div>
            <div className="text-gray-500 text-xs">Excellent bright</div>
            <div className="font-bold mt-4">Today:</div>
            <div className="mt-1">{currentDate}</div>
            <div className="h-2 bg-teal-600 mt-4 rounded"></div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-1">90</div>
            <div className="text-gray-500 text-sm">Total Candidates</div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-1">72</div>
            <div className="text-gray-500 text-sm">Scheduled</div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-1">30</div>
            <div className="text-gray-500 text-sm">Attended</div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-1">18</div>
            <div className="text-gray-500 text-sm">Absent</div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-1">12</div>
            <div className="text-gray-500 text-sm">Passed</div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-1">18</div>
            <div className="text-gray-500 text-sm">Rejected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    activeFilter === 'daily' ? 'bg-white shadow-sm' : ''
                  }`}
                  onClick={ () => setActiveFilter('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    activeFilter === 'weekly' ? 'bg-white shadow-sm' : ''
                  }`}
                  onClick={ () => setActiveFilter('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    activeFilter === 'monthly' ? 'bg-white shadow-sm' : ''
                  }`}
                  onClick={ () => setActiveFilter('monthly')}
                >
                  Monthly
                </button>
              </div>
              
              <div className="relative date-filter">
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  onClick={ () => setShowDatePicker(!showDatePicker)}
                >
                  <span role="img" aria-label="calendar">📅</span> {formatSelectedDate()}
                </button>
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={handlePrevMonth}
                      >
                        ←
                      </button>
                      <div className="font-semibold">
                        {getMonthName()} {currentYear}
                      </div>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={handleNextMonth}
                      >
                        →
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      <div className="text-center text-xs text-gray-500 p-1">Sun</div>
                      <div className="text-center text-xs text-gray-500 p-1">Mon</div>
                      <div className="text-center text-xs text-gray-500 p-1">Tue</div>
                      <div className="text-center text-xs text-gray-500 p-1">Wed</div>
                      <div className="text-center text-xs text-gray-500 p-1">Thu</div>
                      <div className="text-center text-xs text-gray-500 p-1">Fri</div>
                      <div className="text-center text-xs text-gray-500 p-1">Sat</div>
                      {renderCalendar()}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-teal-600 text-white rounded text-sm"
                        onClick={handleApplyDate}
                      >
                        Apply
                      </button>
                      <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                        onClick={ () => setShowDatePicker(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                onClick={ () => setShowFilterModal(true)}
              >
                <span role="img" aria-label="search">🔍</span> Advanced Filter
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span role="img" aria-label="search">🔍</span>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">
                + Add Candidate
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={ () => handleSort('id')}
                    >
                      Candidate ID ↕
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={ () => handleSort('name')}
                    >
                      Name ↕
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={ () => handleSort('role')}
                    >
                      Role ↕
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={ () => handleSort('department')}
                    >
                      Department ↕
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={ () => handleSort('date')}
                    >
                      Date ↕
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={ () => handleSort('status')}
                    >
                      Status ↕
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(candidate.status)}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.checkin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.checkout}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.completion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCandidates.length}</span> of{' '}
                  <span className="font-medium">{candidatesData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                    <button
                      key={index}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        activePage === page
                          ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } ${index === 0 ? 'rounded-l-md' : ''} ${
                        index === 6 ? 'rounded-r-md' : ''
                      }`}
                      onClick={ () => handlePageChange(page)}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Advanced Filters</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={ () => setShowFilterModal(false) }
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="attended">Attended</option>
                  <option value="absent">Absent</option>
                  <option value="passed">Passed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="IT Department">IT Department</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
              <button
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default InterviewDashboard;