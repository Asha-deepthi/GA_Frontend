import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// --- Global Styles for Body ---
const GlobalStyles = () => (
  <style>{`
    body {
      margin: 0;
      font-family: 'Segoe UI', 'Roboto', sans-serif;
      background-color: #ffffff;
      color: #333;
    }
  `}</style>
);

// --- Inline Styles Object ---
const styles = {
  reviewPageContainer: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  reviewHeader: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    position: 'relative',
    paddingBottom: '10px',
  },
  headerColorBar: {
    position: 'absolute',
    top: '-20px',
    left: '-10vw',
    right: '-10vw',
    height: '5px',
    background: 'linear-gradient(to right, #f1c40f, #e67e22, #e74c3c, #9b59b6, #3498db, #2ecc71)',
  },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' },
  logo: { display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
  logoSquare: { width: '12px', height: '12px', backgroundColor: '#00a79d', marginRight: '10px' },
  headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  faqButton: {
    backgroundColor: 'transparent',
    border: '1px solid #e74c3c',
    color: '#e74c3c',
    padding: '8px 15px',
    borderRadius: '20px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  userProfile: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e0e0' },
  reviewContent: { paddingTop: '30px' },
  reviewTitle: { fontSize: '2rem', fontWeight: 500, margin: '0 0 10px 0' },
  reviewSubtitle: { color: '#888', marginBottom: '30px' },
  progressSection: { marginBottom: '30px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontWeight: 500 },
  progressLabel: { color: '#555' },
  progressValue: { color: '#888' },
  progressBarContainer: { width: '100%', height: '8px', backgroundColor: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#00a79d', borderRadius: '4px', transition: 'width 0.5s ease-in-out' },
  toggleSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  toggleSwitch: { position: 'relative', display: 'inline-block', width: '50px', height: '28px', cursor: 'pointer' },
  toggleSlider: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '28px'
  },
  toggleSliderChecked: { backgroundColor: '#00a79d' },
  sliderCircle: {
    position: 'absolute',
    height: '20px',
    width: '20px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%'
  },
  sliderCircleChecked: { transform: 'translateX(22px)' },
  sectionGroup: { marginBottom: '30px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' },
  questionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f3f5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  questionStatusIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    marginRight: '15px'
  },
  answeredIcon: { backgroundColor: '#00a79d' },
  unansweredIcon: { backgroundColor: '#e74c3c' },
  questionDetails: { flexGrow: 1 },
  questionDetailsH4: { margin: '0 0 4px 0', fontWeight: 500 },
  questionDetailsP: { margin: 0, color: '#888', fontSize: '0.9rem' },
  editButton: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    color: '#555',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 500
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '50px',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '30px'
  },
  actionBtn: {
    border: 'none',
    padding: '12px 35px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500
  },
  btnPrimary: { backgroundColor: '#00a79d', color: '#ffffff' },
  btnSecondary: { backgroundColor: '#f1f3f5', border: '1px solid #e0e0e0', color: '#333' },
  decorativeShape: {
    position: 'fixed',
    bottom: '-80px',
    left: '-80px',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, #00a79d 0%, rgba(0,167,157,0) 70%)',
    opacity: 0.1,
    zIndex: -1
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    color: '#555'
  },
  errorStatus: { color: '#e74c3c' }
};

const TestSummaryScreen = ({ session_id, section_id }) => {
  const [sections, setSections] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOnlyUnanswered, setShowOnlyUnanswered] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    if (!session_id || !section_id) {
      console.warn("session_id or section_id missing");
      return;
    }

    const API_URL = `http://127.0.0.1:8000/api/test-execution/get-answers/?session_id=${session_id}&section_id=${section_id}`;

    const fetchAnswers = async () => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/test-execution/get-answers/?session_id=${session_id}&section_id=${section_id}`
    );

    if (res.status === 404) {
      console.warn("No answers found for this section.");
      setAnswers([]);
      setSections([]);
      return;
    }

    if (!res.ok) throw new Error("Failed to fetch answers");

    const data = await res.json();
    console.log("Fetched answers:", data);
    setAnswers(data);

    // Group questions by section
    const sectionMap = {};
    data.forEach((q) => {
      const secId = q.section_id;
const secName = q.section;

if (!sectionMap[secId]) {
  sectionMap[secId] = {
    id: secId,
    name: secName,
    questions: []
  };
}

      sectionMap[secId].questions.push(q);
    });

    const sectionArray = Object.values(sectionMap);
    setSections(sectionArray);
  } catch (err) {
    console.error("Error fetching answers:", err);
    setError("Failed to load answers.");
  } finally {
    setLoading(false);
  }
};

    fetchAnswers();
  }, [session_id, section_id]);

  const { displayedSections, totalQuestions, answeredQuestions } = useMemo(() => {
    if (!sections?.length) return { displayedSections: [], totalQuestions: 0, answeredQuestions: 0 };

    let total = 0, answered = 0;
    const filteredSections = sections.map(section => {
      const filteredQuestions = section.questions || [];

      total += filteredQuestions.length;

      const answeredInSection = filteredQuestions.filter(q => q.answer !== null && q.answer !== '');
      answered += answeredInSection.length;

      const displayedQuestions = showOnlyUnanswered
        ? filteredQuestions.filter(q => q.answer === null || q.answer === '')
        : filteredQuestions;

      if (!displayedQuestions.length) return null;

      return {
        ...section,
        questions: displayedQuestions,
        answeredCount: answeredInSection.length
      };
    }).filter(Boolean);

    return { displayedSections: filteredSections, totalQuestions: total, answeredQuestions: answered };
  }, [sections, showOnlyUnanswered]);

  const progressPercentage = totalQuestions ? (answeredQuestions / totalQuestions) * 100 : 0;

  const handleEditClick = (questionId) => {
  if (!questionId) {
    console.warn("Invalid questionId:", questionId);
    return;
  }
  navigate(`/test/${session_id}/section/${section_id}/question/${questionId}`);
};

  const handleGoBack = () => {
    alert("Navigating back to test...");
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your test?")) {
      alert("Test submitted!");
      // actual submission logic here
    }
  };

  const handleFaqClick = () => {
    alert("FAQs Coming Soon...");
  };

  if (loading) return <div style={styles.statusContainer}><h2>Loading Summary...</h2></div>;
  if (error) return <div style={{ ...styles.statusContainer, ...styles.errorStatus }}><h2>{error}</h2></div>;

  return (
    <>
      <GlobalStyles />
      <div style={styles.reviewPageContainer}>
        <header style={styles.reviewHeader}>
          <div style={styles.headerColorBar}></div>
          <div style={styles.headerContent}>
            <div style={styles.logo}>
              <span style={styles.logoSquare}></span> GA Proctored Test
            </div>
            <div style={styles.headerActions}>
              <button style={styles.faqButton} onClick={handleFaqClick}>? FAQs</button>
              <div style={styles.userProfile}>
                <div style={styles.avatar}></div>
                <span>Candidate</span>
              </div>
            </div>
          </div>
        </header>

        <main style={styles.reviewContent}>
          <h1 style={styles.reviewTitle}>Review Your Answers</h1>
          <p style={styles.reviewSubtitle}>You can go back and edit any question before submitting.</p>

          <div style={styles.progressSection}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Progress</span>
              <span style={styles.progressValue}>{answeredQuestions}/{totalQuestions}</span>
            </div>
            <div style={styles.progressBarContainer}>
              <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div style={styles.toggleSection}>
            <span>Show only unanswered questions</span>
            <div style={styles.toggleSwitch} onClick={() => setShowOnlyUnanswered(prev => !prev)}>
              <div style={{ ...styles.toggleSlider, ...(showOnlyUnanswered && styles.toggleSliderChecked) }}>
                <span style={{ ...styles.sliderCircle, ...(showOnlyUnanswered && styles.sliderCircleChecked) }}></span>
              </div>
            </div>
          </div>

          {displayedSections.map((section) => (
  <div key={section.id} style={styles.sectionGroup}>

              <h3 style={styles.sectionTitle}>
                {section.name} ({section.answeredCount}/{section.questions.length} answered)
              </h3>
              {section.questions.map(q => (
                <div key={q.id} style={styles.questionItem}>
                  <div style={{
                    ...styles.questionStatusIcon,
                    ...(q.answer ? styles.answeredIcon : styles.unansweredIcon)
                  }}>
                    {q.answer ? '✓' : '✗'}
                  </div>
                  <div style={styles.questionDetails}>
                    <h4 style={styles.questionDetailsH4}>{q.title}</h4>
                    <p style={styles.questionDetailsP}>
                      {q.answer ? `Answer: ${q.answer}` : 'Not Answered'}
                    </p>
                  </div>
                  <button style={styles.editButton} onClick={() => handleEditClick(q.id)}>Edit</button>
                </div>
              ))}
            </div>
          ))}
        </main>

        <footer style={styles.reviewFooter}>
          <button style={{ ...styles.actionBtn, ...styles.btnSecondary }} onClick={handleGoBack}>Go Back to Test</button>
          <button style={{ ...styles.actionBtn, ...styles.btnPrimary }} onClick={handleSubmit}>Submit Test</button>
        </footer>
      </div>

      <div style={styles.decorativeShape}></div>
    </>
  );
};

export default TestSummaryScreen;
