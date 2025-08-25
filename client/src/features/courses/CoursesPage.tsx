import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import { CourseCard } from './components/CourseCard';
import { Modal } from '@/components/Modal';
import { CreateCourseForm } from './components/CreateCourseForm';
import { Footer } from '@/components/Footer';
import './CoursesPage.css';

// Definimos una interfaz simple para el curso
interface Course {
  id: number;
  name: string;
  description: string;
  code: string;
}

export const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const { user } = useAuth();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/courses');
      setCourses(response.data.data);
    } catch (err) {
      setError('No se pudieron cargar los cursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  
  const handleDeleteConfirmation = (course: Course) => {
    setCourseToDelete(course);
  };

  const executeDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      await apiClient.delete(`/courses/${courseToDelete.id}`);
      setCourses(prevCourses => prevCourses.filter(c => c.id !== courseToDelete.id));
      setCourseToDelete(null); // Cierra el modal
    } catch (err) {
      alert('Error al eliminar el curso.'); // Podríamos usar un toast o un mensaje más elegante
      setCourseToDelete(null);
    }
  };

  if (loading) return <div className="loading-indicator">Cargando cursos...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="courses-page-layout">
      <div className="courses-page-container">
        <Link to="/dashboard" className="back-to-dashboard-link">&larr; Volver al Inicio</Link>
        
        <header className="courses-header">
          <h1>Mis Cursos</h1>
          {user?.role === 'teacher' && (
            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              + Crear Curso
            </button>
          )}
        </header>

        {courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                userRole={user?.role}
                onDelete={() => handleDeleteConfirmation(course)}
              />
            ))}
          </div>
        ) : (
          <div className="no-courses-message">
            <h3>Aún no hay cursos</h3>
            <p>{user?.role === 'teacher' ? '¡Crea tu primer curso para empezar!' : 'Aún no has sido añadido a ningún curso.'}</p>
          </div>
        )}

        {/* Modal para Crear Curso */}
        <Modal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          title="Crear un Nuevo Curso"
        >
          <CreateCourseForm 
            onCourseCreated={() => {
              setIsCreateModalOpen(false);
              fetchCourses();
            }}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Modal para Confirmar Eliminación */}
        <Modal
          isOpen={!!courseToDelete}
          onClose={() => setCourseToDelete(null)}
          title="Confirmar Eliminación"
        >
          {courseToDelete && (
            <div className="confirm-delete-modal">
              <p>¿Estás seguro de que quieres eliminar el curso "<strong>{courseToDelete.name}</strong>"?</p>
              <p className="warning-text">Esta acción es irreversible y se perderán todos los datos asociados.</p>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setCourseToDelete(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={executeDeleteCourse}>Sí, Eliminar</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
      <Footer />
    </div>
  );
};