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
  open_date: string; // Añadimos la fecha de apertura
  close_date: string;
  allow_late_submissions: boolean;
}

interface StudentSubmissionViewProps {
  assignment: Assignment;
  submission: Submission | null;
}

export const StudentSubmissionView = ({ assignment, submission }: StudentSubmissionViewProps) => {

  const now = new Date();
  const openDate = new Date(assignment.open_date);
  const closeDate = new Date(assignment.close_date);

  const isNotYetOpen = now < openDate;
  const isOverdue = now > closeDate && !assignment.allow_late_submissions;

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

  // --- VISTA CUANDO EL QUIZ AÚN NO ESTÁ DISPONIBLE ---
  if (isNotYetOpen) {
    return (
      <div className="submission-status-view not-yet-open">
        <h3>Quiz No Disponible Aún</h3>
        <p>Este quiz estará disponible a partir del {openDate.toLocaleString()}.</p>
      </div>
    );
  }

  // --- VISTA CUANDO EL QUIZ HA VENCIDO ---
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