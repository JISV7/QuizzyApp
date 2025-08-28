import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import './ManageStudentsForm.css';

interface ManageStudentsFormProps {
  courseId: string;
  onClose: () => void;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

export const ManageStudentsForm = ({ courseId, onClose }: ManageStudentsFormProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [usernameToInvite, setUsernameToInvite] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/students`);
      setStudents(response.data.data);
    } catch (err) {
      setError('No se pudo cargar la lista de estudiantes.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await apiClient.post(`/courses/${courseId}/invite`, { username: usernameToInvite });
      setSuccess(response.data.data.message);
      setUsernameToInvite('');
      fetchStudents(); // Refrescar la lista
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al invitar al estudiante.');
    }
  };

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleRemove = async () => {
    setError('');
    setSuccess('');
    try {
      await apiClient.delete(`/courses/${courseId}/students`, { data: { studentIds: selectedStudents } });
      setSuccess('Estudiantes eliminados correctamente.');
      setSelectedStudents([]);
      fetchStudents(); // Refrescar la lista
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar estudiantes.');
    }
  };

  return (
    <div className="manage-students-form">
      {/* Sección para invitar */}
      <div className="invite-section">
        <h4>Invitar Estudiante</h4>
        <form onSubmit={handleInvite} className="invite-form-content">
          <input 
            value={usernameToInvite} 
            onChange={(e) => setUsernameToInvite(e.target.value)} 
            placeholder="Nombre de usuario del estudiante" 
            required 
          />
          <button type="submit" className="btn btn-primary">Invitar</button>
        </form>
      </div>

      <hr />

      {/* Sección para eliminar */}
      <div className="remove-section">
        <h4>Estudiantes Inscritos ({students.length})</h4>
        {students.length > 0 ? (
          <>
            <ul className="students-list">
              {students.map(student => (
                <li key={student.id}>
                  <input 
                    type="checkbox" 
                    id={`student-${student.id}`} 
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                  <label htmlFor={`student-${student.id}`}>{student.first_name} {student.last_name} ({student.username})</label>
                </li>
              ))}
            </ul>
            <button onClick={handleRemove} className="btn btn-danger" disabled={selectedStudents.length === 0}>
              Eliminar Seleccionados ({selectedStudents.length})
            </button>
          </>
        ) : (
          <p className="no-students-message">Aún no hay estudiantes en este curso.</p>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};