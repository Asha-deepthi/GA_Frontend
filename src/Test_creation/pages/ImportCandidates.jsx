import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
  /*const initialCandidates = [
    { id: 1, name: 'Ethan Harper', email: 'ethan.harper@email.com', phone: '(555) 123-4567', isEditing: false },
    { id: 2, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', phone: '(555) 987-6543', isEditing: false },
    { id: 3, name: 'Noah Carter', email: 'noah.carter@email.com', phone: '(555) 246-8013', isEditing: false },
  ];*/
  
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
  
  const fileInputRef = useRef(null);

  const handleAddCandidate = () => {
    if (candidates.some(c => c.isEditing)) { alert("Please save or cancel the current candidate first."); return; }
    const newCandidate = { id: `new-${Date.now()}`, name: '', email: '', phone: '', isEditing: true, isSaved: false };
    setCandidates([...candidates, newCandidate]);
  };

  const handleCandidateChange = (id, field, value) => {
    setCandidates(prev => prev.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

    /*--- CHANGE: This function now saves a single candidate using fetch ---
  const handleSaveCandidate = async (id) => {
     const accessToken = sessionStorage.getItem("access_token");
    const candidateToSave = candidates.find(c => c.id === id);
    if (!candidateToSave.name || !candidateToSave.email) {
      alert("Name and Email are required.");
      return;
    }

    setIsSubmitting(true);
    try {
    const response = await fetch('http://localhost:8000/api/import-candidate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`},
      body: JSON.stringify({
          name: candidateToSave.name,
          email: candidateToSave.email,
          phone: candidateToSave.phone,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the backend (e.g., validation errors)
        const errorMsg = Object.values(data).join('\n');
        throw new Error(errorMsg || 'Failed to save candidate.');
      }
      
      // On success, update the local state
      setCandidates(prev => prev.map(c => 
          (c.id === id ? { ...c, isEditing: false, isSaved: true } : c)
      ));
      alert(data.message);

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };*/

  // JOB 1: CREATE the candidate user in the backend (no password, no email)
  const handleSaveCandidate = async (id) => {
    const accessToken = sessionStorage.getItem("access_token");
    const candidateToSave = candidates.find(c => c.id === id);
    if (!candidateToSave.name || !candidateToSave.email) {
      alert("Name and Email are required.");
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/test_creation/create-candidate/', {
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
  // --- END OF FIX ---
  
    const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsParsing(true);
    setTotalFiles(files.length);
    setFilesParsed(0);
    setParsingProgress(0);
    setFailedFiles([]);

    Array.from(files).forEach((file, index) => {
      setTimeout(() => {
        const newFilesParsed = index + 1;
        setFilesParsed(newFilesParsed);
        setParsingProgress((newFilesParsed / files.length) * 100);
        if (newFilesParsed === files.length) {
            setTimeout(() => setIsParsing(false), 500);
        }
      }, (index + 1) * 700);
    });
    event.target.value = null; // Allows re-uploading the same file
  };
  // JOB 2: ASSIGN candidates to the test and NAVIGATE to the next step
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
      fetch(`http://localhost:8000/api/test_creation/assign-test/`, {
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="text-teal-500 font-bold text-lg">■ GA Proctored Test</div>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600"><a href="#" className="hover:text-teal-500">Dashboard</a><a href="#" className="hover:text-teal-500">Tests</a><a href="#" className="hover:text-teal-500">Candidates</a><a href="#" className="text-teal-500 font-semibold">Create test</a></nav>
                <div className="flex items-center space-x-4"><div className="relative"><Icon name="notification" className="text-xl text-gray-500" /></div><div className="flex items-center space-x-2"><div className="h-8 w-8 rounded-full bg-gray-300"></div><span className="text-sm">Arjun Pawan ▾</span></div></div>
            </div>
        </header>

        <main className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-16"><Stepper currentStep={3} /></div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6">Import Candidates</h1>
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.doc,.docx"/>
                
                <button onClick={handleUploadClick} className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md inline-flex items-center space-x-2"><Icon name="upload" className="font-bold text-gray-500"/><span>Upload Resumes</span></button>

                {isParsing && (
                    <div className="mt-8">
                        <p className="text-sm font-medium mb-1">Parsing resumes...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${parsingProgress}%`}}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{filesParsed}/{totalFiles} resumes processed</p>
                    </div>
                )}

                <div className="mt-8 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-4">Email</div>
                        <div className="col-span-3">Phone Number</div>
                        <div className="col-span-1"></div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center">
                                {candidate.isEditing ? (
                                    <>
                                        <div className="col-span-4"><input type="text" placeholder="Name" value={candidate.name} onChange={(e) => handleCandidateChange(candidate.id, 'name', e.target.value)} className="w-full p-1 border rounded"/></div>
                                        <div className="col-span-4"><input type="email" placeholder="Email" value={candidate.email} onChange={(e) => handleCandidateChange(candidate.id, 'email', e.target.value)} className="w-full p-1 border rounded"/></div>
                                        <div className="col-span-3"><input type="tel" placeholder="Phone" value={candidate.phone} onChange={(e) => handleCandidateChange(candidate.id, 'phone', e.target.value)} className="w-full p-1 border rounded"/></div>
                                        <div className="col-span-1 flex space-x-2 justify-end"><button onClick={() => handleSaveCandidate(candidate.id)} className="text-green-500 hover:text-green-700" title="Save"disabled={isSubmitting}><Icon name="check" className="font-bold"/></button><button onClick={() => handleDeleteCandidate(candidate.id)} className="text-red-500 hover:text-red-700" title="Cancel"><Icon name="close" className="font-bold"/></button></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-4 font-medium text-gray-900">{candidate.name}</div>
                                        <div className="col-span-4 text-gray-500">{candidate.email}</div>
                                        <div className="col-span-3 text-gray-500">{candidate.phone}</div>
                                        <div className="col-span-1 flex justify-end"><button onClick={() => handleDeleteCandidate(candidate.id)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200" title="Delete Candidate"><Icon name="close" className="font-bold text-gray-500"/></button></div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddCandidate} className="w-full text-left px-6 py-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center space-x-2"disabled={isSubmitting}><Icon name="plus" className="bg-gray-200 rounded-full p-0.5"/><span>Add Candidate Manually</span></button>
                </div>
                
                {failedFiles.length > 0 && (<p className="mt-4 text-sm text-red-600">Failed to parse: {failedFiles.join(', ')}</p>)}
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