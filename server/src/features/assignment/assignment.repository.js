import { pool } from '../../config/database.js';

// --- Funciones de Asignación (Assignment) ---

/**
 * Crea una nueva asignación en la base de datos.
 * @param {object} assignmentData
 * @param {number} courseId
 */
export const createAssignment = async (assignmentData, courseId) => {
  const { title, description, type, max_points, open_date, close_date, allow_late_submissions } = assignmentData;
  
  // Formatea fechas para MySQL
  const formatForMySQL = (isoString) => new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
  
  const sql = `
    INSERT INTO assignments (course_id, title, description, type, max_points, open_date, close_date, allow_late_submissions) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    courseId, title, description, type, max_points ?? null, formatForMySQL(open_date), formatForMySQL(close_date), !!allow_late_submissions
  ];
  
  const [result] = await pool.query(sql, params);
  const [assignment] = await pool.query('SELECT * FROM assignments WHERE id = ?', [result.insertId]);
  return assignment[0];
};

/**
 * Finds an assignment by its ID.
 * @param {number} assignmentId - The ID of the assignment.
 * @returns {Promise<object|null>} The assignment object or null if not found.
 */
export const findAssignmentById = async (assignmentId) => {
  const [rows] = await pool.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
  return rows[0] || null;
};

/**
 * Busca una asignación por título dentro de un curso para evitar duplicados.
 * @param {number} courseId
 * @param {string} title
 */
export const findAssignmentByTitleInCourse = async (courseId, title) => {
  const [rows] = await pool.query('SELECT * FROM assignments WHERE course_id = ? AND title = ?', [courseId, title]);
  return rows[0] || null;
};

/**
 * Obtiene todas las asignaciones de un curso.
 * @param {number} courseId
 */
export const findAssignmentsByCourseId = async (courseId) => {
  const [rows] = await pool.query('SELECT * FROM assignments WHERE course_id = ? ORDER BY open_date DESC', [courseId]);
  return rows;
};

/**
 * Elimina una asignación por su ID.
 * @param {number} assignmentId
 */
export const deleteAssignmentById = async (assignmentId) => {
  const [result] = await pool.query('DELETE FROM assignments WHERE id = ?', [assignmentId]);
  return result;
};

// --- Funciones de Entrega (Submission) ---

/**
 * Crea un nuevo registro de entrega (submission).
 * @param {object} submissionData
 * @param {object} connection - Conexión de BD para transacciones.
 */
export const createSubmission = async (submissionData, connection) => {
  const { assignmentId, studentId, grade } = submissionData;
  const db = connection || pool;
  const sql = "INSERT INTO submissions (assignment_id, student_id, submitted_at, grade) VALUES (?, ?, NOW(), ?)";
  const [result] = await db.query(sql, [assignmentId, studentId, grade]);
  return result.insertId;
};

/**
 * Guarda las respuestas específicas de un estudiante para una entrega.
 * @param {number} submissionId
 * @param {Array<object>} answers
 * @param {object} connection - Conexión de BD para transacciones.
 */
export const saveStudentAnswers = async (submissionId, answers, connection) => {
  if (answers.length === 0) return;
  const db = connection || pool;
  const values = answers.map(answer => [
    submissionId,
    answer.question_id,
    answer.selected_option_id,
    answer.is_correct,
    answer.points_awarded,
  ]);

  const sql = 'INSERT INTO student_quiz_answers (submission_id, question_id, selected_option_id, is_correct, points_awarded) VALUES ?';
  await db.query(sql, [values]);
};

/**
 * Obtiene las respuestas correctas de un quiz para calificar.
 * @param {number} assignmentId
 */
export const findCorrectAnswersForQuiz = async (assignmentId) => {
    const sql = `
        SELECT qq.id AS question_id, qo.id AS correct_option_id, qq.points 
        FROM quiz_questions qq
        JOIN question_options qo ON qq.id = qo.question_id
        WHERE qq.assignment_id = ? AND qo.is_correct = TRUE
    `;
    const [rows] = await pool.query(sql, [assignmentId]);

    return new Map(rows.map(row => [
      row.question_id, 
      { correct_option_id: row.correct_option_id, points: row.points }
    ]));
};

/**
 * Busca si un estudiante ya ha realizado una entrega para una asignación.
 * @param {number} studentId
 * @param {number} assignmentId
 */
export const findSubmissionByStudentAndAssignment = async (studentId, assignmentId) => {
    const [rows] = await pool.query('SELECT * FROM submissions WHERE student_id = ? AND assignment_id = ?', [studentId, assignmentId]);
    return rows[0] || null;
};

/**
 * Fetches all questions and their options for a given quiz (assignment).
 * @param {number} assignmentId - The ID of the assignment.
 * @returns {Promise<Array<object>>} A list of questions with their nested options.
 */
export const findQuestionsAndOptionsByAssignmentId = async (assignmentId) => {
    const [questions] = await pool.query('SELECT * FROM quiz_questions WHERE assignment_id = ?', [assignmentId]);

    for (const question of questions) {
        const [options] = await pool.query(
            'SELECT id, option_text, is_correct FROM question_options WHERE question_id = ?', 
            [question.id]
        );
        question.options = options;
    }
    return questions;
};

export const calculateTotalPointsForAssignment = async (assignmentId) => {
  const [result] = await pool.query(
    'SELECT SUM(points) AS total FROM quiz_questions WHERE assignment_id = ?',
    [assignmentId]
  );
  return result[0].total || 0;
};