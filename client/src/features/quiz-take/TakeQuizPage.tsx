import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { QuestionNavigator } from '@/features/quiz-take/components/QuestionNavigator';
import { QuizQuestion } from '@/features/quiz-take/components/QuizQuestion';
import { QuizResult } from '@/features/quiz-take/components/QuizResult';
import type { Question, Answer } from './types';
import './TakeQuizPage.css';

interface QuizDetails {
  title: string;
  questions: Question[];
}

export const TakeQuizPage = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  // Estados del componente
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submissionResult, setSubmissionResult] = useState<{ grade: number; maxPoints: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar las preguntas del quiz
  const fetchQuizQuestions = useCallback(async () => {
    try {
      const response = await apiClient.get(`/assignments/${assignmentId}/questions`);
      if (response.data.data.length === 0) {
        setError('Este quiz aún no tiene preguntas.');
      } else {
        setQuizDetails({
            title: "", // Placeholder
            questions: response.data.data
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudieron cargar las preguntas del quiz.');
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchQuizQuestions();
  }, [fetchQuizQuestions]);

  // Manejar la selección de una respuesta
  const handleSelectAnswer = (questionId: number, selectedOptionId: number) => {
    setAnswers(prevAnswers => {
      const existingAnswerIndex = prevAnswers.findIndex(a => a.question_id === questionId);
      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { question_id: questionId, selected_option_id: selectedOptionId };
        return updatedAnswers;
      }
      return [...prevAnswers, { question_id: questionId, selected_option_id: selectedOptionId }];
    });
  };

  // Enviar el quiz
  const handleSubmitQuiz = async () => {
    if (answers.length !== quizDetails?.questions.length) {
      alert('Por favor, responde todas las preguntas antes de entregar el quiz.');
      return;
    }
    if (!window.confirm('¿Estás seguro de que quieres entregar el quiz? No podrás cambiar tus respuestas.')) {
        return;
    }

    try {
      const payload = { answers };
      const response = await apiClient.post(`/assignments/${assignmentId}/submit`, payload);
      const maxPoints = quizDetails?.questions.reduce((sum, q) => sum + q.points, 0) || 100;
      setSubmissionResult({
          grade: response.data.data.grade,
          maxPoints: maxPoints
      });
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.message || 'No se pudo entregar el quiz.'}`);
    }
  };

  // Renderizado condicional
  if (isLoading) return <div className="quiz-status-container">Cargando quiz...</div>;
  if (error) return <div className="quiz-status-container error">{error}</div>;
  if (!quizDetails) return <div className="quiz-status-container">No se encontró el quiz.</div>;

  // Si ya se entregó, mostrar resultados
  if (submissionResult) {
    return (
        <QuizResult 
            score={submissionResult.grade} 
            maxPoints={submissionResult.maxPoints}
            onBackToCourses={() => navigate('/courses')}
        />
    );
  }

  const currentQuestion = quizDetails.questions[currentQuestionIndex];
  const allQuestionsAnswered = answers.length === quizDetails.questions.length;

  return (
    <div className="take-quiz-layout">
      <main className="take-quiz-main">
        <header className="quiz-header">
          <h1>{quizDetails.title}</h1>
          <p>Pregunta {currentQuestionIndex + 1} de {quizDetails.questions.length}</p>
        </header>

        <QuizQuestion
          question={currentQuestion}
          selectedOptionId={answers.find(a => a.question_id === currentQuestion.id)?.selected_option_id}
          onSelectAnswer={handleSelectAnswer}
        />

        <div className="quiz-navigation-buttons">
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary"
          >
            Anterior
          </button>
          {currentQuestionIndex < quizDetails.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="btn btn-primary"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              className="btn btn-primary btn-submit"
              title={!allQuestionsAnswered ? 'Debes responder todas las preguntas' : ''}
            >
              Entregar Quiz
            </button>
          )}
        </div>
      </main>

      <aside className="quiz-sidebar">
        <QuestionNavigator
          questions={quizDetails.questions}
          answers={answers}
          currentIndex={currentQuestionIndex}
          onQuestionSelect={setCurrentQuestionIndex}
        />
      </aside>
    </div>
  );
};