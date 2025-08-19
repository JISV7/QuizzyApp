import { pool } from '../../config/database.js';

/**
 * Crea una nueva pregunta en la tabla `quiz_questions`.
 * @param {object} questionData - Datos de la pregunta.
 * @param {object} connection - Conexión de BD para transacciones.
 * @returns {Promise<number>} El ID de la pregunta creada.
 */
export const createQuestion = async (questionData, connection) => {
  const db = connection || pool;
  const { assignment_id, question_text, points } = questionData;
  const sql = 'INSERT INTO quiz_questions (assignment_id, question_text, points) VALUES (?, ?, ?)';
  const [result] = await db.query(sql, [assignment_id, question_text, points]);
  return result.insertId;
};

/**
 * Crea las opciones para una pregunta en la tabla `question_options`.
 * @param {number} questionId - El ID de la pregunta padre.
 * @param {Array<object>} options - Un array de objetos de opción.
 * @param {object} connection - Conexión de BD para transacciones.
 */
export const createOptions = async (questionId, options, connection) => {
  const db = connection || pool;
  const optionsValues = options.map(opt => [questionId, opt.option_text, opt.is_correct]);
  const sql = 'INSERT INTO question_options (question_id, option_text, is_correct) VALUES ?';
  await db.query(sql, [optionsValues]);
};

/**
 * Busca una pregunta por su ID y adjunta sus opciones.
 * @param {number} questionId - El ID de la pregunta.
 * @returns {Promise<object|null>} La pregunta con sus opciones.
 */
export const findQuestionWithOptionsById = async (questionId) => {
  const questionSql = 'SELECT id, question_text, points FROM quiz_questions WHERE id = ?';
  const [questionRows] = await pool.query(questionSql, [questionId]);

  if (questionRows.length === 0) {
    return null;
  }
  const question = questionRows[0];

  const optionsSql = 'SELECT id, option_text, is_correct FROM question_options WHERE question_id = ?';
  const [options] = await pool.query(optionsSql, [question.id]);
  
  question.options = options;
  return question;
};


/**
 * Busca una pregunta por su ID para verificar permisos.
 * @param {number} questionId
 */
export const findQuestionById = async (questionId) => {
    const [rows] = await pool.query('SELECT * FROM quiz_questions WHERE id = ?', [questionId]);
    return rows[0] || null;
};

/**
 * Elimina una pregunta por su ID.
 * @param {number} questionId
 */
export const deleteQuestionById = async (questionId) => {
    await pool.query('DELETE FROM quiz_questions WHERE id = ?', [questionId]);
};

/**
 * Actualiza el texto y los puntos de una pregunta.
 * @param {number} questionId
 * @param {string} text
 * @param {number} points
 * @param {object} connection
 */
export const updateQuestionTextAndPoints = async (questionId, text, points, connection) => {
    const db = connection || pool;
    const sql = 'UPDATE quiz_questions SET question_text = ?, points = ? WHERE id = ?';
    await db.query(sql, [text, points, questionId]);
};

/**
 * Elimina todas las opciones asociadas a una pregunta.
 * @param {number} questionId
 * @param {object} connection
 */
export const deleteOptionsByQuestionId = async (questionId, connection) => {
    const db = connection || pool;
    await db.query('DELETE FROM question_options WHERE question_id = ?', [questionId]);
};

/**
 * Busca todas las preguntas de un quiz (assignment) con sus opciones.
 * @param {number} assignmentId
 * @returns {Promise<Array<object>>}
 */
export const findQuestionsByAssignmentId = async (assignmentId) => {
  const questionsSql = 'SELECT id, question_text, points FROM quiz_questions WHERE assignment_id = ? ORDER BY id';
  const [questions] = await pool.query(questionsSql, [assignmentId]);

  const optionsFields = 'id, option_text, is_correct';
  for (const question of questions) {
    const optionsSql = `SELECT ${optionsFields} FROM question_options WHERE question_id = ?`;
    const [options] = await pool.query(optionsSql, [question.id]);
    question.options = options;
  }
  return questions;
};

/**
 * Cuenta las preguntas de un quiz
 * @param {number} assignmentId - ID de la asignación
 */
export const countQuestionsByAssignmentId = async (assignmentId) => {
  const [result] = await pool.query(
    'SELECT COUNT(*) AS count FROM quiz_questions WHERE assignment_id = ?',
    [assignmentId]
  );
  return result[0].count;
};

/**
 * Calcula la suma de puntos de todas las preguntas de un quiz
 * @param {number} assignmentId - ID de la asignación
 */
export const calculateTotalPoints = async (assignmentId) => {
  const [result] = await pool.query(
    'SELECT SUM(points) AS total FROM quiz_questions WHERE assignment_id = ?',
    [assignmentId]
  );
  return result[0].total || 0;
};