import { pool } from '../../config/database.js';
import {
  createAssignment,
  findAssignmentById,
  findAssignmentByTitleInCourse,
  findAssignmentsByCourseId,
  deleteAssignmentById,
  findSubmissionByStudentAndAssignment,
  findCorrectAnswersForQuiz,
  createSubmission,
  saveStudentAnswers,
  calculateTotalPointsForAssignment,
} from './assignment.repository.js';
import { findCourseByIdAndTeacher, isStudentEnrolled, findCourseById } from '../course/course.repository.js';
import { calculateTotalPoints, countQuestionsByAssignmentId, findQuestionsByAssignmentId } from '../quiz/quiz.repository.js';


/**
 * Lógica de negocio para crear una nueva asignación.
 * @param {object} assignmentData - Datos de la asignación.
 * @param {number} courseId - ID del curso.
 * @param {number} teacherId - ID del profesor.
 */
export const createNewAssignment = async (assignmentData, courseId, teacherId) => {
  const course = await findCourseByIdAndTeacher(courseId, teacherId);
  if (!course) {
    throw new Error('FORBIDDEN');
  }

  const existingAssignment = await findAssignmentByTitleInCourse(courseId, assignmentData.title);
  if (existingAssignment) {
    throw new Error('ASSIGNMENT_TITLE_EXISTS');
  }

  return await createAssignment(assignmentData, courseId);
};

/**
 * Lógica para obtener todas las asignaciones de un curso.
 * @param {number} courseId
 * @param {number} userId
 * @param {string} userRole
 */
export const fetchAssignmentsForCourse = async (courseId, userId, userRole) => {
  if (userRole === 'teacher') {
    const course = await findCourseByIdAndTeacher(courseId, userId);
    if (!course) throw new Error('FORBIDDEN');
  } else { // student
    const enrolled = await isStudentEnrolled(userId, courseId);
    if (!enrolled) throw new Error('FORBIDDEN');
  }

  const assignments = await findAssignmentsByCourseId(courseId);

  for (const assignment of assignments) {
    if (assignment.type === 'quiz') {
      assignment.total_points = await calculateTotalPointsForAssignment(assignment.id);
    } else {
      assignment.total_points = assignment.max_points;
    }
  }
  
  return assignments;
};

/**
 * Lógica para obtener los detalles de una asignación.
 * @param {number} assignmentId
 * @param {object} user
 */
export const fetchAssignmentDetails = async (assignmentId, user) => {
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error('ASSIGNMENT_NOT_FOUND');
  }

  // Verificar permisos
  if (user.role === 'teacher') {
    const course = await findCourseByIdAndTeacher(assignment.course_id, user.id);
    if (!course) throw new Error('FORBIDDEN');
  } else { // student
    const enrolled = await isStudentEnrolled(user.id, assignment.course_id);
    if (!enrolled) throw new Error('FORBIDDEN');
  }

  if (assignment.type === 'quiz') {
    assignment.questions = await findQuestionsByAssignmentId(assignmentId);
    assignment.total_points = await calculateTotalPoints(assignmentId);
    assignment.question_count = await countQuestionsByAssignmentId(assignmentId);
  }

  return assignment;
};


/**
 * Lógica para eliminar una asignación.
 * @param {number} assignmentId
 * @param {number} teacherId
 */
export const removeAssignment = async (assignmentId, teacherId) => {
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error('ASSIGNMENT_NOT_FOUND');
  }

  const course = await findCourseByIdAndTeacher(assignment.course_id, teacherId);
  if (!course) {
    throw new Error('FORBIDDEN');
  }

  await deleteAssignmentById(assignmentId);
  return { message: 'Asignación eliminada con éxito.' };
};


/**
 * Lógica para procesar la entrega de un quiz.
 * @param {number} assignmentId
 * @param {Array<object>} studentAnswers
 * @param {number} studentId
 */
export const processQuizSubmission = async (assignmentId, studentAnswers, studentId) => {
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment || assignment.type !== 'quiz') {
    throw new Error('ASSIGNMENT_NOT_FOUND_OR_NOT_QUIZ');
  }

  const enrolled = await isStudentEnrolled(studentId, assignment.course_id);
  if (!enrolled) {
    throw new Error('NOT_ENROLLED');
  }

  const existingSubmission = await findSubmissionByStudentAndAssignment(studentId, assignmentId);
  if (existingSubmission) {
    throw new Error('ALREADY_SUBMITTED');
  }

  const now = new Date();
  const closeDate = new Date(assignment.close_date);

  if (now > closeDate && !assignment.allow_late_submissions) {
    throw new Error('ASSIGNMENT_CLOSED');
  }

  const correctAnswersMap = await findCorrectAnswersForQuiz(assignmentId);
  let totalScore = 0;
  const processedAnswers = studentAnswers.map(answer => {
    const correctAnswer = correctAnswersMap.get(answer.question_id);
    const isCorrect = correctAnswer?.correct_option_id === answer.selected_option_id;
    const pointsAwarded = isCorrect ? correctAnswer.points : 0;
    totalScore += pointsAwarded;
    return { ...answer, is_correct: isCorrect, points_awarded: pointsAwarded };
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const submissionId = await createSubmission({
        assignmentId,
        studentId,
        grade: totalScore
    }, connection);

    await saveStudentAnswers(submissionId, processedAnswers, connection);

    await connection.commit();

    return {
      message: 'Quiz entregado con éxito.',
      submissionId,
      grade: totalScore,
    };
  } catch (error) {
    await connection.rollback();
    console.error('Error al procesar la entrega del quiz:', error);
    throw new Error('SUBMISSION_FAILED');
  } finally {
    connection.release();
  }
};