import { pool } from '../../config/database.js';

/**
 * Fetches results for a specific assignment for all enrolled students.
 * It shows submission status for every student in the course.
 * Intended for teachers.
 * @param {number} assignmentId - The ID of the assignment.
 * @param {number} courseId - The ID of the course the assignment belongs to.
 * @returns {Promise<Array<object>>} A list of all enrolled students with their submission info.
 */
export const findSubmissionsByAssignment = async (assignmentId, courseId) => {
  const [rows] = await pool.query(`
    SELECT 
      u.id as student_id, 
      u.first_name, 
      u.last_name, 
      u.username,
      s.id as submission_id, 
      s.grade, 
      s.submitted_at
    FROM enrollments e
    JOIN users u ON e.student_id = u.id
    LEFT JOIN submissions s ON u.id = s.student_id AND s.assignment_id = ?
    WHERE e.course_id = ?
    ORDER BY u.last_name, u.first_name;
  `, [assignmentId, courseId]);
  return rows;
};

/**
 * Fetches all submissions for a specific student within a given course.
 * Intended for students to see their own grades.
 * @param {number} studentId - The ID of the student.
 * @param {number} courseId - The ID of the course.
 * @returns {Promise<Array<object>>} A list of submissions with assignment info.
 */
export const findSubmissionsByStudentInCourse = async (studentId, courseId) => {
  const [rows] = await pool.query(`
    SELECT 
      s.id, s.grade, s.submitted_at,
      a.id as assignment_id, a.title, a.max_points
    FROM submissions s
    JOIN assignments a ON s.assignment_id = a.id
    WHERE s.student_id = ? AND a.course_id = ?
    ORDER BY a.close_date DESC
  `, [studentId, courseId]);
  return rows;
};

/**
 * Fetches the detailed view of a single submission, including every answer.
 * @param {number} submissionId - The ID of the submission.
 * @returns {Promise<object|null>} The detailed submission object or null.
 */
export const findSubmissionDetailsById = async (submissionId) => {
    const [submissionRows] = await pool.query('SELECT * FROM submissions WHERE id = ?', [submissionId]);
    if (submissionRows.length === 0) {
        return null;
    }
    const submission = submissionRows[0];

    const [answers] = await pool.query(`
        SELECT 
            sqa.question_id, sqa.selected_option_id, sqa.is_correct, sqa.points_awarded,
            qq.question_text, qq.points as total_points,
            qo_selected.option_text as selected_option_text,
            (SELECT qo_correct.id FROM question_options qo_correct WHERE qo_correct.question_id = qq.id AND qo_correct.is_correct = TRUE) as correct_option_id,
            (SELECT qo_correct.option_text FROM question_options qo_correct WHERE qo_correct.question_id = qq.id AND qo_correct.is_correct = TRUE) as correct_option_text
        FROM student_quiz_answers sqa
        JOIN quiz_questions qq ON sqa.question_id = qq.id
        LEFT JOIN question_options qo_selected ON sqa.selected_option_id = qo_selected.id
        WHERE sqa.submission_id = ?
    `, [submissionId]);

    submission.answers = answers;
    return submission;
};