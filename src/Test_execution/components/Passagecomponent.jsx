import React from 'react';
import MultipleChoiceComponent from './MultipleChoiceComponent';
import FillInTheBlankComponent from './FillInTheBlankComponent';
import IntegerComponent from './IntegerComponent';
import SubjectiveComponent from './SubjectiveComponent';
import AudioComponent from './AudioComponent';
import VideoComponent from './VideoComponent';

const PassageComponent = ({ question, onAnswerUpdate, currentStatus }) => {
  const { passage_text, text, sub_questions = [] } = question;

  const renderSubQuestion = (subQ) => {
    const handleSubAnswerUpdate = (answer, status) => {
      onAnswerUpdate(subQ.id, answer, status);
    };

    const props = {
      question: subQ,
      onAnswerUpdate: handleSubAnswerUpdate,
      currentStatus: currentStatus[subQ.id] || {},
      onNext: () => {}, // Can be customized if needed
    };

    switch (subQ.type) {
      case 'multiple-choice':
        return <MultipleChoiceComponent key={subQ.id} {...props} />;
      case 'fill-in-blanks':
        return <FillInTheBlankComponent key={subQ.id} {...props} />;
      case 'integer':
        return <IntegerComponent key={subQ.id} {...props} />;
      case 'subjective':
        return <SubjectiveComponent key={subQ.id} {...props} />;
      case 'audio':
        return <AudioComponent key={subQ.id} {...props} />;
      case 'video':
        return <VideoComponent key={subQ.id} {...props} />;
      default:
        return <div key={subQ.id}>Unsupported sub-question type: {subQ.type}</div>;
    }
  };

  return (
    <div className="space-y-4 border border-gray-300 rounded p-4 bg-gray-50">
      <div>
        {text && <p className="font-semibold italic mb-2">{text}</p>}
        {passage_text && (
          <>
            <h3 className="font-semibold mb-1">Passage:</h3>
            <p>{passage_text}</p>
          </>
        )}
      </div>
      <div className="space-y-4">
        {sub_questions.map(renderSubQuestion)}
      </div>
    </div>
  );
};

export default PassageComponent;
