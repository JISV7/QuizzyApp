import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import { StudentSubmissionView } from './components/StudentSubmissionView';
import { TeacherSubmissionsView } from './components/TeacherSubmissionsView';
import './AssignmentDetailPage.css';

// --- Interfaces para un tipado más seguro ---
interface Assignment {
  id: number;
  title: string;
  description: string;
  course_id: number;
  open_date: string;
  close_date: string;
  allow_late_submissions: boolean
  max_points: number;
  total_points: number;
  question_count?: number;
}

interface Submission {
  id: number;
  grade: number | null;
  submitted_at: string;
  student_id?: number;
  first_name?: string;
  last_name?: string;
  assignment_id?: number;
  title?: string;
}

export const AssignmentDetailPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- LÓGICA PARA NAVEGAR A LA PÁGINA DE EDICIÓN ---
  const handleEditQuestions = () => {
    navigate(`/assignments/${assignmentId}/edit`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!assignmentId || !user) return;

      try {
        setLoading(true);
        setError('');

        // 1. Obtener los detalles de la asignación (común para ambos roles)
        const assignmentRes = await apiClient.get(`/assignments/${assignmentId}`);
        const assignmentData: Assignment = assignmentRes.data.data;
        setAssignment(assignmentData);

        // 2. Obtener los datos de las entregas según el rol del usuario
        if (user.role === 'teacher') {
          const resultsRes = await apiClient.get(`/assignments/${assignmentId}/results`);
          setSubmissions(resultsRes.data.data);
        } else if (user.role === 'student') {
          // Para estudiantes, buscamos su entrega específica
          const myResultsRes = await apiClient.get(`/courses/${assignmentData.course_id}/my-results`);
          const studentSubmission = myResultsRes.data.data.find(
            (sub: Submission) => sub.assignment_id === Number(assignmentId)
          );
          setMySubmission(studentSubmission || null);
        }

      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar los datos de la asignación.');
        // Si no está autorizado, lo redirigimos
        if (err.response?.status === 403) {
            setTimeout(() => navigate('/dashboard'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, user, navigate]);

  if (loading) {
    return <div className="loading-state">Cargando detalles del quiz...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!assignment) {
    return <div className="error-state">No se encontró la asignación.</div>;
  }

  return (
    <div className="assignment-detail-layout">
      <div className="assignment-detail-container">
        <header className="assignment-header">
          <Link to={`/courses/${assignment.course_id}`} className="back-link">
            &larr; Volver al curso
          </Link>
          <h2>{assignment.title}</h2>
          <p>{assignment.description}</p>
          <div className="assignment-meta">
            <div className="meta-item">
              <strong>Disponible:</strong>
              <span>{new Date(assignment.open_date).toLocaleString()}</span>
            </div>
            <div className="meta-item">
              <strong>Cierra:</strong>
              <span>{new Date(assignment.close_date).toLocaleString()}</span>
            </div>
            <div className="meta-item">
              <strong>Preguntas:</strong>
              <span>{assignment.question_count || 0}</span>
            </div>
            <div className="meta-item">
                <strong>Puntos:</strong>
                <span>{assignment.total_points}</span>
              </div>
            {/* --- CONTENEDOR PARA PUNTOS Y BOTÓN DE EDICIÓN --- */}
            <div className="meta-item points-and-edit">
              {user?.role === 'teacher' && (
                <button onClick={handleEditQuestions} className="btn-edit-questions">
                  Editar Preguntas
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="assignment-body">
          {user?.role === 'student' && (
            <StudentSubmissionView 
              assignment={assignment} 
              submission={mySubmission}
            />
          )}
          
          {user?.role === 'teacher' && (
            <TeacherSubmissionsView 
              assignment={assignment}
              submissions={submissions}
            />
          )}
        </main>
      </div>
    </div>
  );
};