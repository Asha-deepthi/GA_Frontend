import { useEffect, useState } from 'react';
import MultipleChoiceComponent from './MultipleChoiceComponent';
import FillInTheBlankComponent from './FillInTheBlankComponent';
import IntegerComponent from './IntegerComponent';
import SubjectiveComponent from './SubjectiveComponent';
import AudioComponent from './AudioComponent';
import VideoComponent from './VideoComponent';
import useProctoring from './useProctoring';

const session_id = 12345;
const SECTION_DURATION = 5 * 60;

const SectionComponent = ({ section_id, onSectionComplete, answerApiUrl }) => {
  const { violationCount } = useProctoring({ sessionId: session_id, answerApiUrl });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersStatus, setAnswersStatus] = useState({});
  const [sectionType, setSectionType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(SECTION_DURATION);
  const [defaultTime, setDefaultTime] = useState(SECTION_DURATION);
  useEffect(() => {
    const exitFullscreenOnUnload = () => {
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
    };
    window.addEventListener("beforeunload", exitFullscreenOnUnload);
    return () => window.removeEventListener("beforeunload", exitFullscreenOnUnload);
  }, []);
  // Restore from backend
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/test-creation/fetch-section-questions/${section_id}/?session_id=${session_id}`);
        const data = await res.json();
        setQuestions(data.questions);
        setSectionType(data.section_type);
        setDefaultTime(data.section_duration); // <- New line
        // Fetch saved answers from backend
        const answersRes = await fetch(`http://127.0.0.1:8000/test-execution/get-answers/?session_id=${session_id}&section_id=${section_id}`);
        const answerData = await answersRes.json();
        const backendAnswers = {};
        answerData.forEach(ans => {
          backendAnswers[ans.question_id] = {
            answer: ans.answer_text || null,
            markedForReview: ans.marked_for_review,
            status: ans.status
          };
        });

        // Restore local answers (if any)
        const local = JSON.parse(localStorage.getItem(`answers_${section_id}`) || '{}');
        const merged = { ...backendAnswers, ...local };
        setAnswersStatus(merged);
        localStorage.setItem(`answers_${section_id}`, JSON.stringify(merged));
      } catch (err) {
        console.error('Error fetching section data:', err);
      }
    };
    fetchSectionData();
}, [section_id]);
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/test-creation/get-timer/?session_id=${session_id}&section_id=${section_id}`);
        const data = await res.json();
        const backendTime = data.remaining_time;

        const local = localStorage.getItem(`timer_${section_id}`);
        const timeToUse = backendTime != null
         ? backendTime
         : (local ? parseInt(local) : defaultTime);

        setTimeLeft(timeToUse);
        localStorage.setItem(`timer_${section_id}`, timeToUse);
      } catch (err) {
        console.error('Error fetching timer:', err);
        const local = localStorage.getItem(`timer_${section_id}`);
        setTimeLeft(local ? parseInt(local) : defaultTime);
      }
    };

    if (defaultTime !== null) {
    fetchTimer();
  }
}, [defaultTime, section_id]);
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => {
        const newTime = t - 1;
        localStorage.setItem(`timer_${section_id}`, newTime);
        // Save to backend every 10 seconds
      if (newTime % 10 === 0) {
        console.log("Saving timer with:", { session_id, section_id, newTime });
        fetch('http://127.0.0.1:8000/api/test-creation/save-timer/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            session_id: session_id,
            section_id: section_id,
            remaining_time: newTime
          })
        }).catch(err => console.error('Failed to save timer:', err));
      }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const updateAnswer = async (question_id, payload) => {
    const hasAnswer = payload.answer && payload.answer !== '';
    const status = payload.markedForReview
      ? (hasAnswer ? 'reviewed_with_answer' : 'reviewed')
      : (hasAnswer ? 'answered' : 'skipped');

    const newStatus = {
      ...answersStatus,
      [question_id]: {
        answer: hasAnswer ? payload.answer : null,
        markedForReview: payload.markedForReview,
        status
      }
    };

    setAnswersStatus(newStatus);
    localStorage.setItem(`answers_${section_id}`, JSON.stringify(newStatus));

    const question = questions.find(q => q.question_id === question_id);
    const body = new FormData();
    body.append('session_id', session_id);
    body.append('question_id', question_id);
    body.append('question_type', sectionType);
    if (hasAnswer) {
      if (typeof payload.answer === 'object' && payload.answer.type === 'audio') {
        body.append('audio_file', payload.answer.blob, payload.answer.filename);
      } else if (typeof payload.answer === 'object' && payload.answer.type === 'video') {
        body.append('video_file', payload.answer.blob, payload.answer.filename);
      } else {
        body.append('answer_text', payload.answer);
      }
    }
    body.append('marked_for_review', payload.markedForReview);

    try {
      await fetch('http://127.0.0.1:8000/test-execution/answers/', {
        method: 'POST',
        body
      });
    } catch (err) {
      console.error('Failed to send answer:', err);
    }
  };

  const handleFinalSubmit = async () => {
    for (const question of questions) {
      const existing = answersStatus[question.question_id];
      if (!existing || !existing.answer) {
        const body = new FormData();
        body.append('session_id', session_id);
        body.append('question_id', question.question_id);
        body.append('question_type', sectionType);
        body.append('marked_for_review', false);

        answersStatus[question.question_id] = {
          answer: null,
          markedForReview: false,
          status: 'skipped'
        };

        try {
          await fetch('http://127.0.0.1:8000/test-execution/answers/', {
            method: 'POST',
            body
          });
        } catch (err) {
          console.error('Failed to submit empty answer:', err);
        }
      }
    }

    setAnswersStatus({});
    localStorage.removeItem(`answers_${section_id}`);
    localStorage.removeItem(`timer_${section_id}`);
    alert("Section submitted!");
    if (onSectionComplete) onSectionComplete(section_id);
  };

  const getStatusColor = (question_id) => {
    const data = answersStatus[question_id];
    if (!data) return 'bg-gray-300';
    if (data.status === 'answered') return 'bg-green-500';
    if (data.status === 'reviewed_with_answer') return 'bg-orange-500';
    if (data.status === 'reviewed') return 'bg-violet-500';
    if (data.status === 'skipped') return 'bg-red-500';
    return 'bg-gray-300';
  };

  const renderQuestionComponent = () => {
    const question = questions[currentIndex];
    if (!question) return null;
    const props = {
      question,
      onAnswerUpdate: updateAnswer,
      currentStatus: answersStatus[question.question_id] || {},
      onNext: () => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
    };

    switch (sectionType) {
      case 'multiple_choice': return <MultipleChoiceComponent {...props} />;
      case 'fill_in_the_blank': return <FillInTheBlankComponent {...props} />;
      case 'integer': return <IntegerComponent {...props} />;
      case 'subjective': return <SubjectiveComponent {...props} />;
      case 'audio': return <AudioComponent {...props} />;
      case 'video': return <VideoComponent {...props} />;
      default: return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="text-right text-lg font-bold mb-4">
        <p className="text-sm text-red-600">Violations Detected: {violationCount}</p>
        Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {questions.map((q, index) => (
          <button
            key={q.question_id}
            className={`w-8 h-8 rounded-full text-white ${getStatusColor(q.question_id)}`}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="border p-4 rounded shadow">{renderQuestionComponent()}</div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Submit Section
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionComponent;