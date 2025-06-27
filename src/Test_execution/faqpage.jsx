import React, { useState } from 'react';

// This is a reusable component for each FAQ item.
// It manages its own state (whether it's open or closed).
// The initiallyOpen prop is used to match the screenshot where the first two items are open.
const AccordionItem = ({ question, answer, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <svg
          className={`chevron-icon ${isOpen ? 'open' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && (
        <div className="accordion-content">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

// This is the main component for the entire page.
const FaqPage = () => {
  // Data for the FAQ questions and answers
  const generalQuestions = [
    {
      question: 'What should I do if the test suddenly closes or my browser crashes?',
      answer: 'If your test closes unexpectedly, try to log back into GradArena immediately. The system should allow you to resume from where you left off. If you encounter any issues, contact our support team for assistance.',
      initiallyOpen: true,
    },
    {
      question: 'What happens if I lose internet connection during the test?',
      answer: 'The system is designed to handle temporary disconnections. Your progress is saved periodically. If you get disconnected, simply reconnect to the internet and resume the test. For prolonged issues, please contact support.',
      initiallyOpen: true,
    },
    {
      question: 'What are the system requirements for taking a test on GradArena?',
      answer: 'You will need a stable internet connection, a desktop or laptop computer with a working webcam and microphone, and a supported browser (latest versions of Chrome, Firefox, or Edge).',
    },
    {
      question: 'Can I take the test on a mobile device or tablet?',
      answer: 'No, for proctoring and security reasons, our tests must be taken on a desktop or laptop computer. Mobile devices and tablets are not supported.',
    },
    {
      question: 'Will my webcam and microphone be used during the test?',
      answer: 'Yes, our proctored tests require access to your webcam and microphone to ensure the integrity of the testing environment. You will be monitored during the test session.',
    },
    {
      question: 'How is my privacy protected when using GradArena?',
      answer: 'We take your privacy very seriously. All data, including video and audio recordings, is encrypted and stored securely. Access is restricted to authorized personnel for the purpose of reviewing test integrity.',
    },
    {
      question: 'What happens if I accidentally leave the test window?',
      answer: 'Navigating away from the test window may be flagged as a potential violation. The system will warn you. Repeatedly leaving the test window may result in your test being terminated.',
    },
    {
      question: 'What forms of identification are required to verify my identity?',
      answer: 'You will typically need a government-issued photo ID, such as a driver\'s license, passport, or national ID card. The specific requirements will be outlined in the test instructions.',
    },
    {
      question: 'Can I pause and resume the test if needed?',
      answer: 'Most tests on our platform are timed and cannot be paused. Please ensure you have an uninterrupted block of time to complete the assessment.',
    },
    {
      question: 'Who should I contact if I encounter technical issues during the test?',
      answer: 'You should contact our dedicated technical support team immediately. Contact details are available on the test-taking page and in your test invitation email.',
    },
    {
      question: 'Is it possible to reschedule my test if I face technical problems?',
      answer: 'In cases of verified, significant technical problems, rescheduling may be an option. Please contact the support team with details of your issue to see if you are eligible.',
    },
    {
      question: 'What items are allowed or prohibited during the test?',
      answer: 'Typically, your desk should be clear of all items except your computer and your ID. Prohibited items include phones, notes, books, and other electronic devices. Specific rules will be provided before you begin.',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: #ffffff;
          color: #1a202c; /* A dark gray for text */
        }

        .faq-page-wrapper {
          position: relative;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .decorative-shape {
          position: absolute;
          bottom: -50px;
          left: -80px;
          width: 300px;
          height: 300px;
          z-index: 0;
          opacity: 0.5;
        }

        .faq-page-container {
          position: relative;
          z-index: 1;
        }

        .top-color-bar {
          height: 5px;
          background: linear-gradient(90deg, #F97316, #FBBF24, #10B981);
        }
        
        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .logo-placeholder {
          width: 150px;
          height: 30px;
          background-color: #e2e8f0;
          border-radius: 4px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .faq-button {
          background-color: #EF4444; /* Red-500 */
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 9999px; /* Pill shape */
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .faq-button:hover {
          background-color: #DC2626; /* Red-600 */
        }

        .separator {
          width: 1px;
          height: 24px;
          background-color: #e2e8f0;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #3B82F6; /* Blue-500 for a placeholder color */
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .user-name {
          font-weight: 500;
        }

        .faq-main-content {
          max-width: 800px;
          margin: 3rem auto;
          padding: 0 1rem 5rem 1rem;
        }
        
        .faq-main-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .faq-main-content .intro-text {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.6;
          max-width: 700px;
          margin-bottom: 3rem;
        }

        .faq-main-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #111827;
        }

        .accordion-section {
          margin-bottom: 3rem;
        }

        .accordion-item {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 1rem;
          background-color: #f8fafc;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s;
        }

        .accordion-item:hover {
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          text-align: left;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          color: #374151;
        }

        .chevron-icon {
          transition: transform 0.3s ease;
          color: #6b7280;
        }

        .chevron-icon.open {
          transform: rotate(180deg);
        }

        .accordion-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .accordion-content p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #4b5563;
        }
        
        .technical-support-text {
            font-size: 1rem;
            color: #4b5563;
            line-height: 1.6;
            max-width: 700px;
        }
      `}</style>

      <div className="faq-page-wrapper">
        <div className="decorative-shape">
            {/* Simple SVG for the background shape */}
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#E0F2FE" d="M54.9,-49.5C69.3,-32.7,78,-9.6,76.2,12.2C74.4,34,62.1,54.6,44.9,65.5C27.7,76.4,5.6,77.6,-15.7,71.2C-37,64.8,-57.4,50.8,-68.2,31.7C-79,12.6,-80.1,-11.5,-70.7,-30.7C-61.2,-49.9,-41.2,-64.3,-22.1,-69.5C-3,-74.8,15.2,-71.1,32.3,-64.1C49.5,-57.1,50.6,-46.8,54.9,-49.5Z" transform="translate(100 100)" />
            </svg>
        </div>

        <div className="faq-page-container">
          <div className="top-color-bar"></div>
          <header className="faq-header">
            <div className="logo-placeholder"></div>
            <div className="header-right">
              <button className="faq-button">FAQs</button>
              <div className="separator"></div>
              <div className="user-profile">
                <div className="user-avatar">AJ</div>
                <span className="user-name">Arjun</span>
              </div>
            </div>
          </header>

          <main className="faq-main-content">
            <h1>Frequently Asked Questions</h1>
            <p className="intro-text">
              Welcome to the GradArena FAQ page! Here you'll find answers to common questions about our proctored testing software. We're committed to providing a smooth and secure testing experience. If you have any questions not covered here, please don't hesitate to contact our support team.
            </p>

            <div className="accordion-section">
              <h2>General Questions</h2>
              {generalQuestions.map((faq, index) => (
                <AccordionItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  initiallyOpen={faq.initiallyOpen}
                />
              ))}
            </div>

            <div className="technical-support-section">
              <h2>Technical Support</h2>
              <p className="technical-support-text">
                For any technical issues or support, please contact our dedicated support team. We're here to help ensure your testing experience is as smooth as possible.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default FaqPage;