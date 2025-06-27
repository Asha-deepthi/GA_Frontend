import React, { useState, useEffect } from 'react';
import './SendInvitations.css'; // We'll create this CSS file next
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BASE_URL from "../../config";

// --- Helper Icon Components ---
const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const LinkIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
);

const SendInvitations = () => {
    const { testId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [invitationMessage, setInvitationMessage] = useState("You have been invited to take an online assessment. Please log in to our platform to begin your test.");
    const [expiryDate, setExpiryDate] = useState(new Date());

    const fetchAssignedCandidates = async () => {
        setIsLoading(true);
        const accessToken = sessionStorage.getItem("access_token");
        try {
            const response = await fetch(`${BASE_URL}/test-creation/tests/${testId}/assigned-candidates/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!response.ok) throw new Error("Failed to fetch candidates.");
            const data = await response.json();
            setCandidates(data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (testId) fetchAssignedCandidates();
    }, [testId]);

    const handleSendInvitations = async () => {
         if (!expiryDate) {
            alert("Please select a test expiry date and time.");
            return;
        }
        setIsSending(true);
        const accessToken = sessionStorage.getItem("access_token");
        try {
            const response = await fetch(`http://localhost:8000/api/test-creation/send-invitations/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ test_id: testId, message: invitationMessage,expiry_date: expiryDate.toISOString()})
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to send invitations.");
            alert(data.message);
            fetchAssignedCandidates(); // Refresh the list to show the new "SENT" status
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSending(false);
        }
    };
    return (
        <div className="invitations-page-container">
            {/* --- Header --- */}
            <header className="page-header">
                <div className="logo-container">
                    <span className="logo-icon">GA</span><span className="logo-text">GA Proctored Test</span>
                </div>
                <nav className="main-nav">
                    <a href="#">Dashboard</a><a href="#">Tests</a><a href="#">Candidates</a><a href="#" className="active">Create test</a>
                </nav>
                <div className="user-controls">
                    <button className="icon-button"><BellIcon /></button>
                    <div className="user-profile"><div className="avatar"></div><span>Arjun Pavan</span><span className="dropdown-arrow">▼</span></div>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="main-content">
                {/* --- Stepper --- */}
                <div className="stepper">
                    <div className="step"><div className="step-circle complete">✔</div><div className="step-label">Test Title</div></div>
                    <div className="connector complete"></div>
                    <div className="step"><div className="step-circle complete">✔</div><div className="step-label">Set interview questions</div></div>
                    <div className="connector complete"></div>
                    <div className="step"><div className="step-circle complete">✔</div><div className="step-label">Import candidates</div></div>
                    <div className="connector complete"></div>
                    <div className="step active"><div className="step-circle">4</div><div className="step-label">Send interview invitation</div></div>
                </div>

                <div className="invitations-wrapper">
                    <div className="invitations-header">
                        <h1>Send Invitations</h1>
                        <p>Customize your invitation message and send it to candidates.</p>
                    </div>

                    <div className="form-section">
                        <div className="form-group full-width">
                            <label htmlFor="invitation-message">Invitation Message</label>
                             <textarea id="invitation-message" rows="5" value={invitationMessage} onChange={(e) => setInvitationMessage(e.target.value)}></textarea>

                        </div>
                        <div className="form-group">
                            <label htmlFor="expiry-date">Test Expiry Date & Time</label>
                            <div className="input-with-icon">
                               <DatePicker
                                    selected={expiryDate}
                                    onChange={(date) => setExpiryDate(date)}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="date-picker-input" // Add a class for styling if needed
                                    placeholderText="Select Date & Time"
                                    minDate={new Date()} // Prevent selecting past dates
                                />
                                <span className="input-icon"><CalendarIcon /></span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="company-link">Company Link</label>
                            <div className="input-with-icon">
                                <input type="text" id="company-link" />
                                <span className="input-icon"><LinkIcon /></span>
                            </div>
                        </div>
                    </div>

                    <div className="candidate-list-section">
                        <h2>Candidate List</h2>
                        <div className="candidate-list-container">
                             <div className="candidate-list-header">
                                <span>Name</span>
                                <span>Email</span>
                                <span>Phone Number</span>
                                <span>Invitation Status</span>
                            </div>
{isLoading ? <p>Loading...</p> : candidates.map(assignment => (
    <div key={assignment.id} className="candidate-list-row">
        {/* Access name and email from the nested candidate object */}
        <span>{assignment.candidate.name}</span>
        <span>{assignment.candidate.email}</span>
        <span>{assignment.candidate.phone || 'N/A'}</span>
        <span className={`status-pill ${assignment.status.toLowerCase()}`}>{assignment.status}</span>
    </div>
))}
                        </div>
                    </div>

                    <div className="page-footer-actions">
                        <button className="btn btn-primary" onClick={handleSendInvitations} disabled={isSending}>
                            {isSending ? 'Sending...' : 'Send Invitations'}
                        </button>
                        <button className="btn btn-secondary">Preview Email</button>
                        <button className="btn btn-secondary">Download as CSV</button>
                        <button className="btn btn-secondary">Resend to Unsent</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SendInvitations;