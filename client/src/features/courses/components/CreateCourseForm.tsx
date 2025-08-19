import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import './CreateCourseForm.css';

interface CreateCourseFormProps {
  onClose: () => void;
  onCourseCreated: () => void;
}

export const CreateCourseForm = ({ onClose, onCourseCreated }: CreateCourseFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/courses', { name, description, code });
      onCourseCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el curso.');
    }
  };

  return (
    <form className="create-course-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nombre del Curso</label>
        <input id="name" placeholder="Ej: Matemáticas 101" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Descripción (Opcional)</label>
        <textarea id="description" placeholder="Ej: Curso introductorio de álgebra y geometría." value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="code">Código de Acceso (Opcional)</label>
        <input id="code" placeholder="Ej: MATE101" value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Crear Curso
        </button>
      </div>
    </form>
  );
};