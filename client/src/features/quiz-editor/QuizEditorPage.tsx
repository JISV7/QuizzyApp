import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import './QuizEditorPage.css';
import { QuizEditor } from './components/QuizEditor';
import type { Question } from './components/types';

// --- Interfaces ---
interface Assignment {
  id: number;
  title: string;
  course_id: number;
  questions: Question[];
}

export const QuizEditorPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  // Obtenemos el usuario y el estado de carga de la autenticación
  const { user, isLoading: isAuthLoading } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignmentDetails = useCallback(async () => {
    if (!assignmentId) return;
    try {
      setLoading(true);
      const response = await apiClient.get(`/assignments/${assignmentId}`);
      setAssignment(response.data.data);
    } catch (err) {
      setError('No se pudo cargar la información del quiz.');
      console.error("Error fetching assignment details", err);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);
  
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (user?.role !== 'teacher') {
      setLoading(false);
      return;
    }
    fetchAssignmentDetails();
  }, [fetchAssignmentDetails, user, isAuthLoading]);

  if (isAuthLoading || loading) {
    return <div className="loading-state">Cargando editor...</div>;
  }

  if (user?.role !== 'teacher') {
    return (
      <div className="quiz-editor-layout">
        <div className="error-state">
          <h2>Acceso Denegado</h2>
          <p>Esta página solo está disponible para profesores.</p>
          <Link to="/dashboard" className="back-link">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return <div className="error-state">{error || 'No se encontró el quiz.'}</div>;
  }

  return (
    <div className="quiz-editor-layout">
      <div className="quiz-editor-container">
        <header className="quiz-editor-header">
          <Link to={`/assignments/${assignmentId}`} className="back-link">
            &larr; Volver a los detalles del Quiz
          </Link>
          <h1>Editor: {assignment.title}</h1>
        </header>
        <main>
          <QuizEditor
            initialQuestions={assignment.questions}
            assignmentId={assignmentId!}
          />
        </main>
      </div>
    </div>
  );
};