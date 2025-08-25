import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import './SubmissionDetailPage.css';

// --- Interfaces ---
interface AnswerDetail {
  question_text: string;
  points_awarded: number;
  total_points: number;
  selected_option_text: string;
  correct_option_text: string;
  is_correct: boolean;
}

interface SubmissionDetails {
  id: number;
  grade: number;
  assignment_id: number;
  assignment_title: string;
  course_id: number;
  answers: AnswerDetail[];
}

export const SubmissionDetailPage = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await apiClient.get(`/submissions/${submissionId}`);
        setSubmission(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudo cargar la revisión del quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  if (loading) return <div className="status-container">Cargando revisión...</div>;
  if (error) return <div className="status-container error">{error}</div>;
  if (!submission) return null;

  return (
    <div className="submission-detail-layout">
      <div className="submission-detail-container">
        <header className="submission-detail-header">
          <Link to={`/assignments/${submission.assignment_id}`} className="back-link">&larr; Volver a la Asignación</Link>
          <h1>Revisión del Quiz: {submission.assignment_title}</h1>
          <div className="final-grade-summary">
            Calificación Final: <strong>{submission.grade} / {submission.answers.reduce((acc, a) => acc + a.total_points, 0)}</strong>
          </div>
        </header>
        <main className="answers-list">
          {submission.answers.map((answer, index) => (
            <div key={index} className={`answer-card ${answer.is_correct ? 'correct' : 'incorrect'}`}>
              <div className="question-header">
                <p><strong>{index + 1}. {answer.question_text}</strong></p>
                <span className="points">{answer.points_awarded} / {answer.total_points} pts</span>
              </div>
              <div className="answer-body">
                <p>Tu respuesta: <span className="student-answer">{answer.selected_option_text}</span></p>
                {!answer.is_correct && (
                  <p>Respuesta correcta: <span className="correct-answer">{answer.correct_option_text}</span></p>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};