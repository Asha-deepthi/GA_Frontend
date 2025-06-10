import React, { useEffect, useState, useRef } from 'react';
import MultipleChoiceComponent from './MultipleChoiceComponent';
import FillInTheBlankComponent from './FillInTheBlankComponent';
import IntegerComponent from './IntegerComponent';
import SubjectiveComponent from './SubjectiveComponent';
import AudioComponent from './AudioComponent';
import VideoComponent from './VideoComponent';
import useProctoring from './useProctoring';
import Textcomponent from './Textcomponent';
import Passagecomponent from './Passagecomponent';
import Webcam from "react-webcam";
import TabSwitchAlert   from '../TabSwitchAlert';
import CameraOffAlert   from '../CameraOffAlert';
import LowNetworkAlert  from '../LowNetworkAlert';
import AudioAlert       from '../AudioAlert';
import VideoAlert       from '../VideoAlert';

const session_id = 12345;
const SECTION_DURATION = 5 * 60;

const SectionComponent = ({ section_id, onSectionComplete, answerApiUrl }) => {
  const [showTabSwitchAlert,   setShowTabSwitchAlert]   = useState(false);
  const [showLowNetworkAlert,  setShowLowNetworkAlert]  = useState(false);
  const [showLowAudioAlert,    setShowLowAudioAlert]    = useState(false);
  const [showLowVideoAlert,    setShowLowVideoAlert]    = useState(false);
  const [showCameraOffAlert,   setShowCameraOffAlert]   = useState(false);
 const { violationCount, webcamRef } = useProctoring({
    sessionId:          session_id,
    answerApiUrl,
    onTabSwitch:        () => setShowTabSwitchAlert(true),
    onFullscreenExit:   () => setShowTabSwitchAlert(true),
    onLowNetwork:       () => setShowLowNetworkAlert(true),
    onLowAudioQuality:  () => setShowLowAudioAlert(true),
    onLowVideoQuality:  () => setShowLowVideoAlert(true),
    onCameraOff:        () => setShowCameraOffAlert(true),
  });

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersStatus, setAnswersStatus] = useState({});
  const [sectionType, setSectionType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(SECTION_DURATION);
  const [defaultTime, setDefaultTime] = useState(SECTION_DURATION);

  const requestQueue = useRef([]);
  const isProcessingQueue = useRef(false);

  const processQueue = async () => {
    if (isProcessingQueue.current) return;
    isProcessingQueue.current = true;

    while (requestQueue.current.length > 0) {
      const { url, options } = requestQueue.current.shift();
      try {
        await fetch(url, options);
      } catch (err) {
        console.error('Request failed:', err);
      }
    }

    isProcessingQueue.current = false;
  };

  const enqueueRequest = (url, options) => {
    requestQueue.current.push({ url, options });
    processQueue();
  };

  useEffect(() => {
    const exitFullscreenOnUnload = () => {
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
      if (exit) exit.call(document).catch(() => { });
    };
    window.addEventListener("beforeunload", exitFullscreenOnUnload);
    return () => window.removeEventListener("beforeunload", exitFullscreenOnUnload);
  }, []);

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/test-creation/sections/${section_id}/questions/`);
        const data = await res.json();

        // Set questions directly, do NOT normalize or override again
        setQuestions(data);
        console.log('Fetched questions:', data);

        setSectionType(data[0]?.type || '');
        setDefaultTime((data[0]?.section?.time_limit || 5) * 60);

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

        // Merge with local answers if any
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
        if (newTime % 10 === 0) {
          enqueueRequest('http://127.0.0.1:8000/api/test-creation/save-timer/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: session_id,
              section_id: section_id,
              remaining_time: newTime
            })
          });
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const debounceTimeout = useRef(null);
  const latestAnswerPayload = useRef(null);

  const sendAnswer = () => {
    if (!latestAnswerPayload.current) return;

    const { question_id, body } = latestAnswerPayload.current;
    latestAnswerPayload.current = null;

    enqueueRequest('http://127.0.0.1:8000/test-execution/answers/', {
      method: 'POST',
      body,
    });
  };

  const debouncedSendAnswer = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(sendAnswer, 500);
  };

  const updateAnswer = (question_id, payload) => {
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

    const body = new FormData();
    body.append('session_id', session_id);
    body.append('question_id', question_id);
    body.append('question_type', sectionType);
    body.append('section_id', section_id);
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
    body.append('status', status);

    latestAnswerPayload.current = { question_id, body };
    debouncedSendAnswer();
  };

  const handleFinalSubmit = async () => {
    for (const question of questions) {
      const existing = answersStatus[question.id];
      if (!existing || !existing.answer) {
        const body = new FormData();
        body.append('session_id', session_id);
        body.append('question_id', question.id);
        body.append('question_type', sectionType);
        body.append('marked_for_review', false);
        body.append('section_id', section_id);
        body.append('answer_text', '');
        body.append('status', 'skipped');

        enqueueRequest('http://127.0.0.1:8000/test-execution/answers/', {
          method: 'POST',
          body,
        });

        answersStatus[question.id] = {
          answer: null,
          markedForReview: false,
          status: 'skipped'
        };
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
    if (!question) return <div>Loading question...</div>;

    const props = {
      question,
      onAnswerUpdate: updateAnswer,
      currentStatus: answersStatus[question.id] || {},
      onNext: () => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
    };

    switch (question.type) {
      case 'multiple-choice':
        return <MultipleChoiceComponent {...props} />;
      case 'fill-in-blanks':
        return <FillInTheBlankComponent {...props} />;
      case 'integer':
        return <IntegerComponent {...props} />;
      case 'subjective':
        return <SubjectiveComponent {...props} />;
      case 'audio':
        return <AudioComponent {...props} />;
      case 'video':
        return <VideoComponent {...props} />;
      case 'text':
        return <Textcomponent {...props} />;
      case 'passage':
      return <Passagecomponent {...props} />;
      default:
        return <div>Unsupported question type: {question.type}</div>;
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
            key={q.id}
            className={`w-8 h-8 rounded-full text-white ${getStatusColor(q.id)}`}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="border p-4 rounded shadow">{renderQuestionComponent()}</div>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={200}
        height={150}
        style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
      />

 {/* -------------- Alerts -------------- */}
      {showTabSwitchAlert && (
        <TabSwitchAlert
          onDismiss ={() => setShowTabSwitchAlert(false)}
          onContinue={()=> setShowTabSwitchAlert(false)}
        />
      )}

      {showLowNetworkAlert && (
        <LowNetworkAlert
          onDismiss     ={() => setShowLowNetworkAlert(false)}
          onReconnecting={()=> setShowLowNetworkAlert(false)}
        />
      )}

      {showLowAudioAlert && (
        <AudioAlert
          onDismiss={() => setShowLowAudioAlert(false)}
          onCheck  ={() => setShowLowAudioAlert(false)}
        />
      )}

      {showLowVideoAlert && (
        <VideoAlert
          onDismiss={()=> setShowLowVideoAlert(false)}
          onRestart={()=> setShowLowVideoAlert(false)}
        />
      )}

      {showCameraOffAlert && (
        <CameraOffAlert
          onDismiss={() => setShowCameraOffAlert(false)}
          onEnable ={() => setShowCameraOffAlert(false)}
        />
      )}
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
