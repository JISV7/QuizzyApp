import type { Question } from './types';
import './QuestionList.css';

interface QuestionListProps {
  questions: Question[];
  onDelete: (id: number) => void;
  onEdit: (question: Question) => void;
}

export const QuestionList = ({ questions, onDelete, onEdit }: QuestionListProps) => {
  return (
    <>
      <h3>Preguntas Actuales ({questions.length})</h3>
      {questions.length > 0 ? (
        <div className="questions-container">
          {questions.map((q, index) => (
            <div key={q.id} className="question-view-card">
              <div className="question-header">
                <strong>{index + 1}. {q.question_text}</strong>
                <span>{q.points} pts</span>
              </div>
              <ul className="options-list">
                {q.options.map((opt, i) => (
                  <li key={opt.id || i} className={opt.is_correct ? 'correct-option' : ''}>
                    {opt.option_text}
                  </li>
                ))}
              </ul>
              <div className="question-actions">
                <button onClick={() => onEdit(q)} className="btn-action btn-edit">Editar</button>
                <button onClick={() => onDelete(q.id)} className="btn-action btn-delete">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-questions-message">Aún no hay preguntas en este quiz. ¡Añade la primera!</p>
      )}
    </>
  );
};