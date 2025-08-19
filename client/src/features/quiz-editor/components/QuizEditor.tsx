import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import './QuizEditor.css';
import { QuestionList } from './QuestionList';
import { QuestionForm } from './QuestionForm';
import type { Question, NewQuestion } from './types';

interface QuizEditorProps {
  assignmentId: string;
  initialQuestions: Question[];
}

export const QuizEditor = ({ assignmentId, initialQuestions }: QuizEditorProps) => {
  // El estado de las preguntas vive aquí.
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  // Estado para saber qué pregunta estamos editando.
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);


  /**
   * Maneja tanto la creación como la actualización de una pregunta.
   */
  const handleSaveQuestion = async (questionData: NewQuestion | Question) => {
    try {
      if ('id' in questionData && questionData.id) {
        // --- Actualizando una pregunta existente ---
        const response = await apiClient.put(`/questions/${questionData.id}`, questionData);
        const updatedQuestion = response.data.data;
        setQuestions(prev => 
          prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
        );
      } else {
        // --- Creando una nueva pregunta ---
        const response = await apiClient.post(`/assignments/${assignmentId}/questions`, questionData);
        const newQuestion = response.data.data;
        setQuestions(prev => [...prev, newQuestion]);
      }
      setEditingQuestion(null); // Limpiamos el formulario de edición
    } catch (err: any) {
        alert(`Error: ${err.response?.data?.message || 'No se pudo guardar la pregunta.'}`);
    }
  };

  /**
   * Elimina una pregunta de la lista.
   */
  const handleDeleteQuestion = async (questionId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
        try {
            await apiClient.delete(`/questions/${questionId}`);
            setQuestions(prev => prev.filter(q => q.id !== questionId));
        } catch (err: any) {
            alert(`Error: ${err.response?.data?.message || 'No se pudo eliminar la pregunta.'}`);
        }
    }
  };

  /**
   * Cancela la edición y limpia el formulario.
   */
  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  return (
    <div className="quiz-editor-grid">
      <div className="questions-list-section">
        <QuestionList 
          questions={questions}
          onDelete={handleDeleteQuestion}
          onEdit={setEditingQuestion} // Pasamos la función para empezar a editar
        />
      </div>
      <div className="add-question-section">
        <QuestionForm 
            onSave={handleSaveQuestion}
            editingQuestion={editingQuestion} // Pasamos la pregunta a editar (o null)
            onCancelEdit={handleCancelEdit}
        />
      </div>
    </div>
  );
};