import { Link } from 'react-router-dom';
import './StudentSubmissionView.css';

// --- Interfaces ---
interface Submission {
  id: number;
  grade: number | null;
}

interface Assignment {
  id: number;
  total_points: number;
  close_date: string;
  allow_late_submissions: boolean;
}

interface StudentSubmissionViewProps {
  assignment: Assignment;
  submission: Submission | null;
}

export const StudentSubmissionView = ({ assignment, submission }: StudentSubmissionViewProps) => {

  const isOverdue = new Date() > new Date(assignment.close_date) && !assignment.allow_late_submissions;

  // --- VISTA CUANDO EL QUIZ YA FUE COMPLETADO ---
  if (submission) {
    return (
      <div className="submission-status-view completed">
        <h3>¡Ya completaste este quiz!</h3>
        <p>Esta es tu calificación:</p>
        <div className="grade-display">
          <span className="grade-score">{submission.grade ?? 0}</span>
          <span className="grade-max">/ {assignment.total_points}</span>
        </div>
        <Link to={`/submissions/${submission.id}`} className="btn btn-secondary btn-review">
          Revisar mis respuestas
        </Link>
      </div>
    );
  }

  if (isOverdue) {
    return (
      <div className="submission-status-view overdue">
        <h3>Asignación Vencida</h3>
        <p>La fecha límite para entregar esta asignación ha pasado.</p>
      </div>
    );
  }

  // --- VISTA PARA INICIAR EL QUIZ ---
  return (
    <div className="submission-status-view start-quiz">
      <h3>¿Listo para empezar?</h3>
      <p>Haz clic en el botón para comenzar tu intento. ¡Mucha suerte!</p>
      <Link 
        to={`/assignments/${assignment.id}/take`} 
        className="btn btn-primary btn-start-quiz"
      >
        Comenzar Quiz
      </Link>
    </div>
  );
};