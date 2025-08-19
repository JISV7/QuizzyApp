import type { Question } from '../types';
import './QuizQuestion.css';

interface QuizQuestionProps {
  question: Question;
  selectedOptionId?: number;
  onSelectAnswer: (questionId: number, selectedOptionId: number) => void;
}

export const QuizQuestion = ({ question, selectedOptionId, onSelectAnswer }: QuizQuestionProps) => {
  return (
    <div className="quiz-question-container">
      <div className="question-text">
        <span className="points-badge">{question.points} pts</span>
        <h2>{question.question_text}</h2>
      </div>
      <div className="options-grid">
        {question.options.map(option => (
          <button
            key={option.id}
            className={`option-card ${selectedOptionId === option.id ? 'selected' : ''}`}
            onClick={() => onSelectAnswer(question.id, option.id)}
          >
            <span className="option-text">{option.option_text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};