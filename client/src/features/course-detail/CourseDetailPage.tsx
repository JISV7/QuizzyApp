import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import { AssignmentCard } from './components/AssignmentCard';
import { Modal } from '@/components/Modal';
import { CreateAssignmentForm } from './components/CreateAssignmentForm';
import { ManageStudentsForm } from './components/ManageStudentsForm';
import { Footer } from '@/components/Footer';
import './CourseDetailPage.css';

// Interfaces para tipado
interface Course {
  id: number;
  name: string;
  description: string;
}
interface Assignment {
  id: number;
  title: string;
  type: 'task' | 'quiz' | 'material' | 'exam';
  close_date: string;
  max_points: number;
}

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isCreateAssignmentModalOpen, setCreateAssignmentModalOpen] = useState(false);
  const [isManageStudentsModalOpen, setManageStudentsModalOpen] = useState(false);

  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const fetchCourseData = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      //setError('');
      const [courseRes, assignmentsRes] = await Promise.all([
        apiClient.get(`/courses/${courseId}`),
        apiClient.get(`/courses/${courseId}/assignments`)
      ]);
      setCourse(courseRes.data.data);
      setAssignments(assignmentsRes.data.data);
    } catch (err) {
      setError('No se pudo cargar la información del curso.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleDeleteConfirmation = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
  };

  // Ejecuta la eliminación de la asignación
  const executeDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    try {
      await apiClient.delete(`/assignments/${assignmentToDelete.id}`);
      setAssignmentToDelete(null); // Cierra el modal
      fetchCourseData(); // Recarga la lista de tareas
    } catch (err) {
      setError('No se pudo eliminar la tarea.');
      setAssignmentToDelete(null); // Cierra el modal también en caso de error
    }
  };

  if (loading) return <div className="loading-indicator">Cargando detalles del curso...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="course-detail-layout">
      <div className="course-detail-container">
        <Link to="/courses" className="back-to-courses-link">&larr; Volver a Mis Cursos</Link>
        
        <header className="course-detail-header">
          <div className="course-info">
            <h1>{course?.name}</h1>
            <p>{course?.description}</p>
          </div>
          {user?.role === 'teacher' && (
            <div className="teacher-controls">
              <button className="btn btn-secondary" onClick={() => setManageStudentsModalOpen(true)}>
                👥 Gestionar Estudiantes
              </button>
              <button className="btn btn-primary" onClick={() => setCreateAssignmentModalOpen(true)}>
                + Crear Asignación
              </button>
            </div>
          )}
        </header>
        
        <main className="assignments-section">
          <h2>Contenido del Curso</h2>
          <div className="assignments-list">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  userRole={user?.role}
                  onDelete={handleDeleteConfirmation}
                />
              ))
            ) : (
              <div className="no-content-message">
                <p>Este curso aún no tiene quizzes.</p>
                {user?.role === 'teacher' && <p>¡Crea la primera asignación, tus alumnos están a la espera!</p>}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modales */}
      <Modal
        isOpen={isCreateAssignmentModalOpen}
        onClose={() => setCreateAssignmentModalOpen(false)}
        title="Crear Nueva Asignación"
      >
        <CreateAssignmentForm
          courseId={courseId!}
          onClose={() => setCreateAssignmentModalOpen(false)}
          onAssignmentCreated={fetchCourseData}
        />
      </Modal>

      <Modal
        isOpen={isManageStudentsModalOpen}
        onClose={() => setManageStudentsModalOpen(false)}
        title={`Gestionar Estudiantes en "${course?.name}"`}
      >
        <ManageStudentsForm
          courseId={courseId!}
          onClose={() => setManageStudentsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!assignmentToDelete}
        onClose={() => setAssignmentToDelete(null)}
        title="Confirmar Eliminación"
      >
        {assignmentToDelete && (
          <div className="confirm-delete-modal">
            <p>¿Estás seguro de que quieres eliminar la asignación "<strong>{assignmentToDelete.title}</strong>"?</p>
            <p className="warning-text">Esta acción no se puede deshacer.</p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setAssignmentToDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={executeDeleteAssignment}>Sí, Eliminar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};