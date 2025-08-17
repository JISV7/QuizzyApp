import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import './CreateAssignmentForm.css';

interface CreateAssignmentFormProps {
  courseId: string;
  onClose: () => void;
  onAssignmentCreated: () => void;
}

export const CreateAssignmentForm = ({ courseId, onClose, onAssignmentCreated }: CreateAssignmentFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('quiz'); // Default a quiz
  const [maxPoints, setMaxPoints] = useState(20);
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const assignmentData: any = {
        title,
        description,
        type,
        open_date: new Date(openDate).toISOString(),
        close_date: new Date(closeDate).toISOString(),
        allow_late_submissions: allowLateSubmissions,
      };

      if (type !== 'quiz') {
        assignmentData.max_points = Number(maxPoints);
      }

      await apiClient.post(`/courses/${courseId}/assignments`, assignmentData);
      onAssignmentCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error al crear la asignación.');
    }
  };

  return (
    <form className="create-assignment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Título de la Asignación</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Instrucciones (Opcional)</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Tipo</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="quiz">Quiz</option>
            {/*
            <option value="task">Tarea</option>
            <option value="exam">Examen</option>
            <option value="material">Material</option>
            */}
          </select>
        </div>
        {type !== 'quiz' && (
        <div className="form-group">
          <label htmlFor="maxPoints">Puntos Máximos</label>
          <input id="maxPoints" type="number" value={maxPoints} min={0} onChange={(e) => setMaxPoints(Number(e.target.value))} required />
        </div>
      )}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="openDate">Fecha de Apertura</label>
          <input id="openDate" type="datetime-local" value={openDate} onChange={(e) => setOpenDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="closeDate">Fecha de Cierre</label>
          <input id="closeDate" type="datetime-local" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} required />
        </div>
      </div>
      <div className="form-group-checkbox">
        <label htmlFor="allowLateSubmissions">Permitir entregas tardías</label>
        <input
          type="checkbox"
          id="allowLateSubmissions"
          checked={allowLateSubmissions}
          onChange={(e) => setAllowLateSubmissions(e.target.checked)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Crear</button>
      </div>
    </form>
  );
};