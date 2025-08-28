import { Link } from 'react-router-dom';
import './CourseCard.css';

interface Course {
  id: number;
  name: string;
  description: string;
  code: string;
}

interface CourseCardProps {
  course: Course;
  userRole?: 'student' | 'teacher';
  onDelete: (id: number) => void;
}

export const CourseCard = ({ course, userRole, onDelete }: CourseCardProps) => {
  return (
    <div className="course-card">
      <Link to={`/courses/${course.id}`} className="card-link-wrapper">
        <h3 className="card-course-name">{course.name}</h3>
        <p className="card-course-description">{course.description || 'Este curso no tiene una descripción.'}</p>
        {course.code && <span className="course-code">Código: <strong>{course.code}</strong></span>}
      </Link>
      {userRole === 'teacher' && (
        <button className="delete-course-btn" onClick={() => onDelete(course.id)}>
          🗑️
        </button>
      )}
    </div>
  );
};