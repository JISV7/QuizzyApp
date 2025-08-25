import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import { AssignmentCard } from './components/AssignmentCard';
import { Modal } from '@/components/Modal';
import { CreateAssignmentForm } from './components/CreateAssignmentForm';
import { ManageStudentsForm } from './components/ManageStudentsForm';
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
  total_points: number;
}

interface Submission {
  assignment_id: number;
}

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);

  const [isCreateAssignmentModalOpen, setCreateAssignmentModalOpen] = useState(false);
  const [isManageStudentsModalOpen, setManageStudentsModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const fetchCourseData = async () => {
    if (!courseId || !user) return;
    try {
      setLoading(true);
      setError(''); // Limpiar errores previos

      const promises = [
        apiClient.get(`/courses/${courseId}`),
        apiClient.get(`/courses/${courseId}/assignments`)
      ];
      
      if (user.role === 'student') {
        promises.push(apiClient.get(`/courses/${courseId}/my-results`));
      }

      const [courseRes, assignmentsRes, submissionsRes] = await Promise.all(promises);
      
      setCourse(courseRes.data.data);
      setAssignments(assignmentsRes.data.data);

      if (submissionsRes) {
        setMySubmissions(submissionsRes.data.data);
      }
    } catch (err: any) {
      // Usar el mensaje de error de la API o uno genérico
      setError(err.response?.data?.message || 'No se pudo cargar la información del curso.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId, user]);

  // Lógica para separar y ordenar asignaciones
  const { pendingAssignments, completedAssignments } = useMemo(() => {
    if (user?.role !== 'student') {
      const sorted = [...assignments].sort((a, b) => new Date(a.close_date).getTime() - new Date(b.close_date).getTime());
      return { pendingAssignments: sorted, completedAssignments: [] };
    }

    const completedIds = new Set(mySubmissions.map(sub => sub.assignment_id));
    const pending: Assignment[] = [];
    const completed: Assignment[] = [];

    assignments.forEach(assignment => {
      if (completedIds.has(assignment.id)) {
        completed.push(assignment);
      } else {
        pending.push(assignment);
      }
    });

    pending.sort((a, b) => new Date(a.close_date).getTime() - new Date(b.close_date).getTime());
    completed.sort((a, b) => new Date(b.close_date).getTime() - new Date(a.close_date).getTime());

    return { pendingAssignments: pending, completedAssignments: completed };
  }, [assignments, mySubmissions, user]);

  const handleDeleteConfirmation = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
  };

  const executeDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    try {
      await apiClient.delete(`/assignments/${assignmentToDelete.id}`);
      setAssignmentToDelete(null);
      fetchCourseData();
    } catch (err) {
      setError('No se pudo eliminar la tarea.');
      setAssignmentToDelete(null);
    }
  };

  if (loading) return <div className="loading-indicator">Cargando detalles del curso...</div>;
  
  if (error) {
    return (
      <div className="course-detail-layout">
        <div className="course-detail-container">
          <p className="error-message">{error}</p>
          <Link to="/courses" className="back-to-courses-link" style={{ marginTop: '20px' }}>&larr; Volver a Mis Cursos</Link>
        </div>
      </div>
    );
  }

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
            {pendingAssignments.length === 0 && completedAssignments.length === 0 ? (
              <div className="no-content-message">
                <p>Este curso aún no tiene asignaciones.</p>
              </div>
            ) : (
              <>
                {pendingAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    userRole={user?.role}
                    onDelete={handleDeleteConfirmation}
                    isCompleted={false}
                  />
                ))}

                {completedAssignments.length > 0 && (
                  <>
                    <h3 className="completed-assignments-header">Asignaciones Completadas</h3>
                    {completedAssignments.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        userRole={user?.role}
                        onDelete={handleDeleteConfirmation}
                        isCompleted={true}
                      />
                    ))}
                  </>
                )}
              </>
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