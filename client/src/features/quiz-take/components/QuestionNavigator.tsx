import type { Question, Answer } from '../types';
import './QuestionNavigator.css';

interface QuestionNavigatorProps {
  questions: Question[];
  answers: Answer[];
  currentIndex: number;
  onQuestionSelect: (index: number) => void;
}

export const QuestionNavigator = ({ questions, answers, currentIndex, onQuestionSelect }: QuestionNavigatorProps) => {
  const isAnswered = (questionId: number) => {
    return answers.some(a => a.question_id === questionId);
  };

  return (
    <div className="question-navigator">
      <h4>Preguntas</h4>
      <div className="navigator-grid">
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`
              navigator-item 
              ${currentIndex === index ? 'current' : ''}
              ${isAnswered(question.id) ? 'answered' : ''}
            `}
            onClick={() => onQuestionSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};