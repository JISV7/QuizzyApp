import { Link } from 'react-router-dom';
import './AssignmentCard.css';

// Tipos para las props
interface Assignment {
  id: number;
  title: string;
  type: 'task' | 'quiz' | 'material' | 'exam';
  close_date: string;
  max_points?: number;
  total_points: number
}

interface AssignmentCardProps {
  assignment: Assignment;
  userRole?: 'student' | 'teacher';
  onDelete: (assignment: Assignment) => void;
}

// Mapeo de tipos a iconos y textos para una mejor UI
const assignmentTypeDetails = {
  task: { icon: '📝', label: 'Tarea' },
  quiz: { icon: '❓', label: 'Quiz' },
  material: { icon: '📚', label: 'Material' },
  exam: { icon: '✍️', label: 'Examen' },
};

export const AssignmentCard = ({ assignment, userRole, onDelete }: AssignmentCardProps) => {
  const details = assignmentTypeDetails[assignment.type] || { icon: '📄', label: 'Actividad' };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Evita que el Link se active
    e.stopPropagation();
    onDelete(assignment);
  };

  return (
    <Link to={`/assignments/${assignment.id}`} className="assignment-card-link">
      <div className="assignment-card">
        <div className="assignment-icon">{details.icon}</div>
        <div className="assignment-info">
          <span className="assignment-type">{details.label}</span>
          <h4 className="assignment-title">{assignment.title}</h4>
          <p className="assignment-dates">
            Disponible hasta: {new Date(assignment.close_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div className="assignment-points">{assignment.total_points} pts</div>
        {userRole === 'teacher' && (
          <button 
            className="delete-assignment-btn" 
            onClick={handleDeleteClick}
          >
            ×
          </button>
        )}
      </div>
    </Link>
  );
};