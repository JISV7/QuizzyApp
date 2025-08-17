import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UseCallback para que la función no se recree en cada render
  const fetchAssignmentDetails = useCallback(async () => {
    if (!assignmentId) return;
    try {
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
    fetchAssignmentDetails();
  }, [fetchAssignmentDetails]);

  if (loading) {
    return <div className="loading-state">Cargando editor...</div>;
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
            assignmentId={assignmentId!} 
            initialQuestions={assignment.questions || []}
          />
        </main>
      </div>
    </div>
  );
};