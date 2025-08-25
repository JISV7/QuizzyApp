import { pool } from '../../config/database.js';
import { findAssignmentById, findSubmissionByStudentAndAssignment } from '../assignment/assignment.repository.js';
import { findCourseByIdAndTeacher, isStudentEnrolled } from '../course/course.repository.js';
import {
  createQuestion,
  createOptions,
  findQuestionsByAssignmentId,
  findQuestionById,
  deleteQuestionById,
  deleteOptionsByQuestionId,
  updateQuestionTextAndPoints,
  findQuestionWithOptionsById,
} from './quiz.repository.js';

/**
 * Lógica para añadir una pregunta con sus opciones a un quiz.
 * @param {number} assignmentId - El ID del quiz (asignación).
 * @param {object} questionData - Los datos de la pregunta y opciones.
 * @param {number} teacherId - El ID del profesor.
 * @returns {Promise<object>} La pregunta recién creada con sus opciones.
 */
export const addQuestion = async (assignmentId, questionData, teacherId) => {
  // 1. Verificar que el profesor es dueño del curso al que pertenece el quiz.
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment || assignment.type !== 'quiz') {
    throw new Error('ASSIGNMENT_NOT_FOUND_OR_NOT_QUIZ');
  }
  const course = await findCourseByIdAndTeacher(assignment.course_id, teacherId);
  if (!course) {
    throw new Error('FORBIDDEN');
  }

  // 2. Usar una transacción para asegurar que la pregunta y sus opciones se creen juntas.
  const connection = await pool.getConnection();
  let newQuestionId;

  try {
    await connection.beginTransaction();

    // Crear la pregunta y obtener su ID
    newQuestionId = await createQuestion(
      {
        assignment_id: assignmentId,
        question_text: questionData.question_text,
        points: questionData.points,
      },
      connection
    );

    // Crear las opciones asociadas a la pregunta
    await createOptions(newQuestionId, questionData.options, connection);

    await connection.commit();
    
    // 3. Después de crear, buscar y devolver la pregunta completa.
    const newQuestion = await findQuestionWithOptionsById(newQuestionId);
    if (!newQuestion) {
        // Esto no debería pasar si la transacción fue exitosa, pero es una buena práctica.
        throw new Error('FAILED_TO_FETCH_NEW_QUESTION');
    }
    return newQuestion;

  } catch (error) {
    await connection.rollback();
    console.error('Error al añadir la pregunta:', error);
    // Si el error es el que lanzamos nosotros, lo relanzamos.
    if (error.message === 'FAILED_TO_FETCH_NEW_QUESTION') {
        throw error;
    }
    throw new Error('TRANSACTION_FAILED');
  } finally {
    connection.release();
  }
};

/**
 * Lógica para que un estudiante obtenga las preguntas de un quiz.
 * @param {number} assignmentId - El ID del quiz.
 * @param {number} studentId - El ID del estudiante.
 */
export const getQuestionsForStudent = async (assignmentId, studentId) => {
  // 1. Verificar que el quiz existe.
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment || assignment.type !== 'quiz') {
    throw new Error('ASSIGNMENT_NOT_FOUND_OR_NOT_QUIZ');
  }

  // 2. Verificar que el estudiante está inscrito en el curso.
  const enrolled = await isStudentEnrolled(studentId, assignment.course_id);
  if (!enrolled) {
    throw new Error('FORBIDDEN');
  }

  // 3. Verificar que el estudiante no haya entregado ya el quiz.
  const existingSubmission = await findSubmissionByStudentAndAssignment(studentId, assignmentId);
  if (existingSubmission) {
      throw new Error('ALREADY_SUBMITTED');
  }

  // 4. Obtener las preguntas y opciones (sin revelar cuál es la correcta).
  return await findQuestionsByAssignmentId(assignmentId, false); // false = no mostrar is_correct
};

/**
 * Lógica para eliminar una pregunta.
 * @param {number} questionId - El ID de la pregunta.
 * @param {number} teacherId - El ID del profesor.
 */
export const removeQuestion = async (questionId, teacherId) => {
    const question = await findQuestionById(questionId);
    if (!question) {
        throw new Error('QUESTION_NOT_FOUND');
    }
    const assignment = await findAssignmentById(question.assignment_id);
    const course = await findCourseByIdAndTeacher(assignment.course_id, teacherId);
    if (!course) {
        throw new Error('FORBIDDEN');
    }
    await deleteQuestionById(questionId);
    return { message: 'Pregunta eliminada con éxito.' };
};

/**
 * Lógica para actualizar una pregunta y sus opciones.
 * @param {number} questionId - El ID de la pregunta.
 * @param {object} questionData - Los nuevos datos.
 * @param {number} teacherId - El ID del profesor.
 */
export const updateQuestion = async (questionId, questionData, teacherId) => {
    const question = await findQuestionById(questionId);
    if (!question) {
        throw new Error('QUESTION_NOT_FOUND');
    }
    const assignment = await findAssignmentById(question.assignment_id);
    const course = await findCourseByIdAndTeacher(assignment.course_id, teacherId);
    if (!course) {
        throw new Error('FORBIDDEN');
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Actualizar el texto y los puntos
        await updateQuestionTextAndPoints(questionId, questionData.question_text, questionData.points, connection);
        // Borrar opciones viejas y crear las nuevas
        await deleteOptionsByQuestionId(questionId, connection);
        await createOptions(questionId, questionData.options, connection);
        await connection.commit();
        
        // Devolvemos la pregunta actualizada
        const updatedQuestion = await findQuestionWithOptionsById(questionId);
        return updatedQuestion;

    } catch (error) {
        await connection.rollback();
        console.error('Error al actualizar la pregunta:', error);
        throw new Error('TRANSACTION_FAILED');
    } finally {
        connection.release();
    }
};