import { addQuestion, removeQuestion, updateQuestion, getQuestionsForStudent } from './quiz.service.js';

/**
 * Manejador para añadir una pregunta a un quiz.
 */
export const handleAddQuestionToQuiz = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const teacherId = req.user.id;
    const questionData = req.body;

    const newQuestion = await addQuestion(Number(assignmentId), questionData, teacherId);
    
    res.status(201).json({ success: true, data: newQuestion });

  } catch (error) {
    const errorMap = {
      'FORBIDDEN': { status: 403, message: 'No tienes permiso para modificar este quiz.' },
      'ASSIGNMENT_NOT_FOUND_OR_NOT_QUIZ': { status: 404, message: 'El quiz no fue encontrado.' },
      'TRANSACTION_FAILED': { status: 500, message: 'No se pudo añadir la pregunta.' },
      'FAILED_TO_FETCH_NEW_QUESTION': { status: 500, message: 'La pregunta se creó pero no se pudo recuperar.'}
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    if (err.status === 500) console.error(error);
    res.status(err.status).json({ success: false, message: err.message });
  }
};

/**
 * Manejador para que un estudiante obtenga las preguntas de un quiz.
 * Esta es la función que faltaba y causaba el error.
 */
export const handleGetQuizQuestionsForStudent = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.id;
    const questions = await getQuestionsForStudent(Number(assignmentId), studentId);
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    const errorMap = {
      'ASSIGNMENT_NOT_FOUND_OR_NOT_QUIZ': { status: 404, message: 'El quiz no fue encontrado.' },
      'NOT_ENROLLED': { status: 403, message: 'No estás inscrito en el curso de este quiz.' },
      'ALREADY_SUBMITTED': { status: 409, message: 'Ya has completado este quiz.' },
      'ASSIGNMENT_NOT_OPEN': { status: 403, message: 'Este quiz aún no está disponible.' }
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    if (err.status === 500) console.error(error);
    res.status(err.status).json({ success: false, message: err.message });
  }
};

/**
 * Manejador para eliminar una pregunta.
 */
export const handleDeleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const teacherId = req.user.id;
        const result = await removeQuestion(Number(questionId), teacherId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        const errorMap = {
            'FORBIDDEN': { status: 403, message: 'No tienes permiso para eliminar esta pregunta.' },
            'QUESTION_NOT_FOUND': { status: 404, message: 'Pregunta no encontrada.' },
        };
        const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
        if (err.status === 500) console.error(error);
        res.status(err.status).json({ success: false, message: err.message });
    }
};

/**
 * Manejador para actualizar una pregunta.
 */
export const handleUpdateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const teacherId = req.user.id;
        const questionData = req.body;
        const updatedQuestion = await updateQuestion(Number(questionId), questionData, teacherId);
        res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
        const errorMap = {
            'FORBIDDEN': { status: 403, message: 'No tienes permiso para editar esta pregunta.' },
            'QUESTION_NOT_FOUND': { status: 404, message: 'Pregunta no encontrada.' },
            'TRANSACTION_FAILED': { status: 500, message: 'No se pudo actualizar la pregunta.' },
        };
        const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
        if (err.status === 500) console.error(error);
        res.status(err.status).json({ success: false, message: err.message });
    }
};