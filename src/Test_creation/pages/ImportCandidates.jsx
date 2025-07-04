import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImportCandidatesModal from './ImportCandidatesModal'; 
import NavBar from '../components/Navbar'; 

// --- Icon Component (for placeholder icons) ---
const Icon = ({ name, className = '' }) => {
    const icons = {
        upload: '↑',
        plus: '+',
        check: '✓',
        close: '×',
        notification: '🔔',
        user: '👤'
    };
    return <span className={className}>{icons[name] || ''}</span>;
};

// --- Stepper Component ---
const Stepper = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Test Title" },
    { number: 2, label: "Set interview questions" },
    { number: 3, label: "Import candidates" },
    { number: 4, label: "Send Interview invitation" },
  ];
  return (
    <div className="w-full px-4 sm:px-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center text-center w-40">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${ isActive || isCompleted ? 'bg-teal-500 text-white' : 'border-2 border-gray-300 text-gray-400' }`}>
                  {isCompleted ? '✓' : step.number}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-semibold transition-all duration-300 break-words ${ isActive || isCompleted ? 'text-teal-600' : 'text-gray-400' }`}>{step.label}</p>
              </div>
              {index < steps.length - 1 && (<div className={`flex-auto border-t-2 transition-all duration-300 ${ isCompleted ? 'border-teal-500' : 'border-gray-300' }`}></div>)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const ImportCandidates = () => {
  const MAX_CANDIDATES = 5; 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const { testId } = useParams();
  const navigate = useNavigate();
  //const [candidates, setCandidates] = useState(initialCandidates);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [filesParsed, setFilesParsed] = useState(0);
  const [failedFiles, setFailedFiles] = useState([]);
  const [isImportModalOpen, setisImportModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAndSetCandidates();
}, [testId]);

const fetchAndSetCandidates = async () => {
    const accessToken = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(`http://localhost:8000/api/test-creation/tests/${testId}/assigned-candidates/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) throw new Error("Failed to fetch assigned candidates.");
        
        const assignments = await response.json();
        const formattedCandidates = assignments.map(assignment => ({
            id: assignment.candidate.email, // Using email as a unique key for display
            name: assignment.candidate.name,
            email: assignment.candidate.email,
            phone: assignment.candidate.phone,
            isEditing: false,
            isSaved: true,
            source: 'manual'
        }));
        setCandidates(formattedCandidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        // Not showing an alert here to avoid bothering the user on page load
    }
};

  // --- CHANGE 3: This is the handler for the new feature ---
  const handleImportFromTest = async (sourceTestId) => {
    setisImportModalOpen(false); // Close the modal
    setIsSubmitting(true); // Show loading state

    const accessToken = sessionStorage.getItem("access_token");
    try {
        // We call the new backend endpoint we created
        const response = await fetch(`http://localhost:8000/api/test-creation/tests/${testId}/import-candidates/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ source_test_id: sourceTestId })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to import candidates.");

        alert(result.message);
        fetchAndSetCandidates(); // This will refresh the table without a page reload

    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleAddCandidate = () => {
    if (candidates.some(c => c.isEditing)) { alert("Please save or cancel the current candidate first."); return; }
    const newCandidate = { id: `new-${Date.now()}`, name: '', email: '', phone: '', isEditing: true, isSaved: false };
    setCandidates([...candidates, newCandidate]);
  };

  const handleCandidateChange = (id, field, value) => {
    setCandidates(prev => prev.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleSaveCandidate = async (id) => {
    const accessToken = sessionStorage.getItem("access_token");
    const candidateToSave = candidates.find(c => c.id === id);
    if (!candidateToSave.name || !candidateToSave.email) {
      alert("Name and Email are required.");
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/test-creation/create-candidate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ name: candidateToSave.name, email: candidateToSave.email, phone: candidateToSave.phone })
      });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || 'Failed to save candidate.'); }
      setCandidates(prev => prev.map(c => (c.id === id ? { ...c, isEditing: false, isSaved: true } : c)));
      alert(data.message);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
   const handleDeleteCandidate = (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };
  
  // --- THIS IS THE FUNCTION THAT WAS MISSING ---
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
// REPLACE your old handleFileChange function with this new one:

const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const uploadedCandidatesCount = candidates.filter(c => c.source === 'upload').length;
    const slotsAvailable = MAX_CANDIDATES - uploadedCandidatesCount;

    if (slotsAvailable <= 0) {
        alert("You have already reached the maximum number of uploaded resumes.");
        return;
    }

    const filesToProcess = Array.from(files).slice(0, slotsAvailable);
    
    if (files.length > filesToProcess.length) {
        alert(`You can only upload ${slotsAvailable} more resumes. Only the first ${slotsAvailable} files will be processed.`);
    }

    setIsParsing(true);
    setTotalFiles(filesToProcess.length);
    setFilesParsed(0);
    setParsingProgress(0);
    setFailedFiles([]); // Clear previous failures at the start of a new upload

    filesToProcess.forEach((file, index) => {
        setTimeout(() => {
            // This part runs for every file, successful or not
            setFilesParsed(prevParsed => {
                const newParsedCount = prevParsed + 1;
                setParsingProgress((newParsedCount / filesToProcess.length) * 100);
                return newParsedCount;
            });

            // *** THE NEW LOGIC STARTS HERE ***
            // Simulate a failure if the filename includes "fail"
            if (file.name.toLowerCase().includes('fail')) {
                // FAILURE CASE: Add the file name to the failedFiles array
                setFailedFiles(prevFailed => [...prevFailed, file.name]);

            } else {
                // SUCCESS CASE: Create and add the new candidate as before
                const newCandidate = {
                    id: `file-${Date.now()}-${index}`,
                    name: file.name.replace(/\.[^/.]+$/, ""),
                    email: `${file.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
                    phone: `(555) 123-456${index}`,
                    isEditing: false,
                    isSaved: true,
                    source: 'upload'
                };
                setCandidates(prevCandidates => [...prevCandidates, newCandidate]);
            }
            // *** THE NEW LOGIC ENDS HERE ***

            // After the last file is processed, hide the temporary text
            if (index === filesToProcess.length - 1) {
                setTimeout(() => {
                    setIsParsing(false);
                }, 1000);
            }
        }, (index + 1) * 700);
    });
    
    event.target.value = null;
};
  const handleNext = async () => {
    const candidatesToAssign = candidates.filter(c => c.isSaved && !c.isEditing);
    if (candidatesToAssign.length === 0) {
        alert("Please create and save at least one candidate before proceeding.");
        return;
    }
    setIsSubmitting(true);
    let successfulAssignments = 0;
    const accessToken = sessionStorage.getItem("access_token");
    const assignmentPromises = candidatesToAssign.map(candidate =>
      fetch(`http://localhost:8000/api/test-creation/assign-test/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ test_id: testId, candidate_email: candidate.email })
      }).then(response => { if (response.ok) successfulAssignments++; })
    );
    await Promise.all(assignmentPromises);
    setIsSubmitting(false);

    if (successfulAssignments > 0) {
        alert(`${successfulAssignments} candidate(s) successfully assigned to the test.`);
        navigate(`/send-invitation/${testId}`); 
    } else {
        alert("No candidates were assigned. Please check for errors in the console.");
    }
  };

  const uploadedCandidatesCount = candidates.filter(c => c.source === 'upload').length;

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <NavBar />
      <ImportCandidatesModal
            isOpen={isImportModalOpen}
            onClose={() => setisImportModalOpen(false)}
            onImport={handleImportFromTest}
        />
        <main className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-16"><Stepper currentStep={3} /></div>

            <div>
                <h1 className="text-3xl font-bold mb-6">Import Candidates</h1>
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.doc,.docx"/>
                
                <button onClick={handleUploadClick} className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md inline-flex items-center space-x-2"><Icon name="upload" className="font-bold text-gray-500"/>
                <span>Upload Resumes</span></button>
                 <button 
                        onClick={() => setisImportModalOpen(true)}
                        className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md inline-flex items-center space-x-2"
                    >
                        <span>Import from Previous Test</span>
                    </button>

{/* --- Parsing Resumes Section --- */}
<div className="my-8">
    <p className="text-sm font-semibold mb-2 text-gray-800">
        {uploadedCandidatesCount}/{MAX_CANDIDATES} Resumes Uploaded
    </p>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
        {/* The main progress bar driven by the total uploaded candidates */}
        <div 
            className="bg-teal-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${(uploadedCandidatesCount / MAX_CANDIDATES) * 100}%` }}
        ></div>
    </div>
    
    {/* This is the temporary progress bar that shows DURING an upload animation */}
    {isParsing && (
        <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Processing {filesParsed}/{totalFiles} new resumes...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    // THIS IS THE KEY: Use the 'parsingProgress' state here
                    style={{width: `${parsingProgress}%`}}
                ></div>
            </div>
        </div>
    )}
</div>
                {/* --- Candidate Table Container --- */}
                <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Table Header */}
<div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white text-left text-sm font-semibold text-gray-900">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-4">Phone Number</div>
                        <div className="col-span-1"></div>
                    </div>
                    {/* Table Rows */}
                    <div className="divide-y divide-gray-200">
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center">
                                {candidate.isEditing ? (
                                    <>
                                        <div className="col-span-4"><input type="text" placeholder="Name" value={candidate.name} onChange={(e) => handleCandidateChange(candidate.id, 'name', e.target.value)} className="w-full p-1 border rounded"/></div>
                                        <div className="col-span-4"><input type="email" placeholder="Email" value={candidate.email} onChange={(e) => handleCandidateChange(candidate.id, 'email', e.target.value)} className="w-full p-1 border rounded"/></div>
                                        <div className="col-span-3"><input type="tel" placeholder="Phone" value={candidate.phone} onChange={(e) => handleCandidateChange(candidate.id, 'phone', e.target.value)} className="w-full p-1 border rounded"/></div>
                                        <div className="col-span-1 flex space-x-2 justify-end"><button onClick={() => handleSaveCandidate(candidate.id)} className="text-green-500 hover:text-green-700" title="Save" disabled={isSubmitting}><Icon name="check" className="font-bold"/></button><button onClick={() => handleDeleteCandidate(candidate.id)} className="text-red-500 hover:text-red-700" title="Cancel"><Icon name="close" className="font-bold"/></button></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-4 font-medium text-gray-900">{candidate.name}</div>
                                        <div className="col-span-4 text-gray-500">{candidate.email}</div>
                                        <div className="col-span-3 text-gray-500">{candidate.phone}</div>
                                        <div className="col-span-1 flex justify-end">
                                          {/* We don't show a delete button in view mode to match the design */}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Add Candidate Button (now outside the table) --- */}
                <button 
                    onClick={handleAddCandidate} 
                    className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg inline-flex items-center space-x-2 disabled:opacity-50"
                    disabled={isSubmitting || isParsing}
                >
                    <Icon name="plus" className="font-bold"/>
                    <span>Add Candidate Manually</span>
                </button>

                {/* --- Failed Files Message --- */}
                {failedFiles.length > 0 && (
                    <p className="mt-4 text-sm text-red-600">
                        Failed to parse: {failedFiles.join(', ')}
                    </p>
                )}
            </div>

            <div className="mt-8 flex justify-end">
                {/* --- CHANGE: The "Next" button is now functional --- */}
                <button 
                    onClick={handleNext} 
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Assigning...' : 'Next'}
                </button>
            </div>
        </main>
    </div>
  );
};
export default ImportCandidates;