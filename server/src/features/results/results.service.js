import * as ResultsRepository from './results.repository.js';
import { findAssignmentById } from '../assignment/assignment.repository.js';
import { findCourseById, findEnrollment } from '../course/course.repository.js';

/**
 * Business logic for a teacher to get all results for one of their quizzes.
 * @param {number} assignmentId - The ID of the assignment.
 * @param {number} teacherId - The ID of the teacher making the request.
 * @returns {Promise<Array<object>>}
 */
export const getResultsForAssignment = async (assignmentId, teacherId) => {
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error('ASSIGNMENT_NOT_FOUND');
  }
  
  const course = await findCourseById(assignment.course_id);
  if (!course || course.teacher_id !== teacherId) {
    throw new Error('UNAUTHORIZED');
  }

  // Ahora pasamos el ID del curso al repositorio
  return ResultsRepository.findSubmissionsByAssignment(assignmentId, course.id);
};

/**
 * Business logic for a student to get all their results in a course.
 * @param {number} courseId - The ID of the course.
 * @param {number} studentId - The ID of the student.
 * @returns {Promise<Array<object>>}
 */
export const getMyResultsInCourse = async (courseId, studentId) => {
    const enrollment = await findEnrollment(studentId, courseId);
    if (!enrollment) {
        throw new Error('NOT_ENROLLED');
    }
    return ResultsRepository.findSubmissionsByStudentInCourse(studentId, courseId);
};

/**
 * Business logic to get the details of a single submission.
 * @param {number} submissionId - The ID of the submission.
 * @param {object} user - The user making the request.
 * @returns {Promise<object>}
 */
export const getSubmissionDetails = async (submissionId, user) => {
    const submission = await ResultsRepository.findSubmissionDetailsById(submissionId);
    if (!submission) {
        throw new Error('SUBMISSION_NOT_FOUND');
    }

    // Security check: user must be the student who made the submission or the teacher of the course.
    if (user.role === 'student' && submission.student_id !== user.id) {
        throw new Error('UNAUTHORIZED');
    } else if (user.role === 'teacher') {
        const assignment = await findAssignmentById(submission.assignment_id);
        // Agregamos una validación para el caso de que la asignación no exista
        if (!assignment) throw new Error('UNAUTHORIZED'); 
        const course = await findCourseById(assignment.course_id);
        if (!course || course.teacher_id !== user.id) {
            throw new Error('UNAUTHORIZED');
        }
    }

    return submission;
};