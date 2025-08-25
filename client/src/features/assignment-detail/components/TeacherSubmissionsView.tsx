import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherSubmissionsView.css';

// --- Interfaces ---
interface Submission {
  submission_id: number | null;
  student_id: number;
  first_name: string;
  last_name: string;
  submitted_at: string | null;
  grade: number | null;
}
interface TeacherSubmissionsViewProps {
  assignment: { total_points: number };
  submissions: Submission[];
}

// --- Sub-componente para la Fila ---
const SubmissionRow = ({ submission, totalPoints }: { submission: Submission; totalPoints: number }) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    if (submission.submission_id) {
      navigate(`/submissions/${submission.submission_id}`);
    }
  };

  return (
    <tr onClick={handleRowClick} className={submission.submission_id ? 'clickable-row' : ''}>
      <td>{submission.first_name} {submission.last_name}</td>
      <td>{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'Pendiente'}</td>
      <td className={`grade-cell ${submission.grade !== null ? 'graded' : 'pending'}`}>
        {submission.grade !== null ? `${submission.grade} / ${totalPoints}` : '—'}
      </td>
    </tr>
  );
};


// --- Componente Principal ---
export const TeacherSubmissionsView = ({ assignment, submissions }: TeacherSubmissionsViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) return submissions;
    return submissions.filter(s =>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [submissions, searchTerm]);

  return (
    <div className="teacher-submissions-container">
      <div className="view-header">
        <h3>Resultados de los Estudiantes</h3>
        <input
          type="text"
          placeholder="Buscar estudiante..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Fecha de Finalización</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((sub) => (
              <SubmissionRow key={sub.student_id} submission={sub} totalPoints={assignment.total_points} />
            ))
          ) : (
            <tr>
              <td colSpan={3} className="no-submissions-row">
                {submissions.length === 0 ? 'Ningún estudiante ha completado el quiz todavía.' : 'No se encontraron estudiantes.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};