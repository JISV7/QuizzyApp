import { useState, useEffect } from 'react';
import type { Question, NewQuestion, Option, NewOption } from './types';
import './QuestionForm.css';

interface QuestionFormProps {
  onSave: (question: NewQuestion | Question) => void;
  editingQuestion: Question | null;
  onCancelEdit: () => void;
}

const INITIAL_OPTION: NewOption = { option_text: '', is_correct: false };
const INITIAL_QUESTION: NewQuestion = {
  question_text: '',
  points: 10,
  options: [
    { ...INITIAL_OPTION },
    { ...INITIAL_OPTION }
  ]
};

export const QuestionForm = ({ onSave, editingQuestion, onCancelEdit }: QuestionFormProps) => {
  const [question, setQuestion] = useState<NewQuestion | Question>(INITIAL_QUESTION);

  // Cuando 'editingQuestion' cambia, actualizamos el estado del formulario
  useEffect(() => {
    if (editingQuestion) {
      setQuestion(editingQuestion);
    } else {
      setQuestion(INITIAL_QUESTION);
    }
  }, [editingQuestion]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuestion(prev => ({ ...prev, [name]: name === 'points' ? Number(value) : value }));
  };

  const handleOptionChange = (index: number, field: 'option_text' | 'is_correct', value: string | boolean) => {
    const newOptions = [...question.options];
    if (field === 'is_correct') {
      // Si marcamos una como correcta, desmarcamos las demás
      newOptions.forEach((opt, i) => opt.is_correct = i === index);
    } else {
      (newOptions[index] as any)[field] = value;
    }
    setQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setQuestion(prev => ({ ...prev, options: [...prev.options, { ...INITIAL_OPTION }] }));
  };
  
  const removeOption = (index: number) => {
    if (question.options.length <= 2) {
      alert('Debe haber al menos dos opciones.');
      return;
    }
    const newOptions = question.options.filter((_, i) => i !== index);
    // Si la opción eliminada era la correcta, la nueva correcta será la primera
    if (!newOptions.some(opt => opt.is_correct)) {
        if (newOptions.length > 0) {
            newOptions[0].is_correct = true;
        }
    }
    setQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones básicas
    if (!question.question_text.trim()) {
      alert('El texto de la pregunta no puede estar vacío.');
      return;
    }
    if (question.options.some(opt => !opt.option_text.trim())) {
      alert('Todas las opciones deben tener texto.');
      return;
    }
    if (!question.options.some(opt => opt.is_correct)) {
      alert('Debes marcar una opción como correcta.');
      return;
    }
    onSave(question);
    // No reseteamos el formulario aquí si estamos editando,
    // el useEffect se encargará cuando editingQuestion cambie a null.
  };

  return (
    <form onSubmit={handleSubmit} className="new-question-form">
      <h4>{editingQuestion ? 'Editar Pregunta' : 'Añadir Nueva Pregunta'}</h4>
      
      <div className="form-group">
        <label htmlFor="question_text">Texto de la pregunta</label>
        <input
          type="text"
          id="question_text"
          name="question_text"
          value={question.question_text}
          onChange={handleTextChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="points">Puntos</label>
        <input
          type="number"
          id="points"
          name="points"
          value={question.points}
          onChange={handleTextChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Opciones de respuesta</label>
        {question.options.map((opt, index) => (
          <div key={index} className="option-input-group">
            <input
              type="radio"
              name="correct_option"
              checked={opt.is_correct}
              onChange={(e) => handleOptionChange(index, 'is_correct', e.target.checked)}
              title="Marcar como correcta"
            />
            <input
              type="text"
              placeholder={`Opción ${index + 1}`}
              value={opt.option_text}
              onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
              required
            />
            <button type="button" onClick={() => removeOption(index)} className="btn-remove-option">×</button>
          </div>
        ))}
        <button type="button" onClick={addOption} className="btn-add-option">+ Añadir opción</button>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{editingQuestion ? 'Guardar Cambios' : 'Añadir Pregunta'}</button>
        {editingQuestion && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>Cancelar</button>
        )}
      </div>
    </form>
  );
};