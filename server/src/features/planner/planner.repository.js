import { pool } from '../../config/database.js';

/**
 * Obtiene todas las asignaciones pendientes de los cursos en los que un estudiante está inscrito.
 * Una asignación se considera pendiente si no existe una entrega (submission) asociada a ella
 * para el estudiante actual.
 * @param {number} studentId - El ID del estudiante.
 * @returns {Promise<Array<object>>} Un array de objetos de asignación pendientes.
 */
export const getPendingAssignmentsForStudent = async (studentId) => {
  const sql = `
    SELECT 
      a.id, 
      a.title, 
      a.close_date AS end, 
      a.open_date AS start,
      a.type, 
      c.name AS courseName, 
      c.id AS courseId
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    JOIN enrollments e ON a.course_id = e.course_id
    LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = ?
    WHERE e.student_id = ? 
      AND e.enrollment_status = 'active'
      AND s.id IS NULL;
  `;
  const [rows] = await pool.query(sql, [studentId, studentId]);
  return rows;
};

/**
 * Obtiene todas las asignaciones de los cursos que imparte un profesor.
 * @param {number} teacherId - El ID del profesor.
 * @returns {Promise<Array<object>>} Un array de objetos de asignación.
 */
export const getAssignmentsForTeacher = async (teacherId) => {
  const sql = `
    SELECT 
      a.id, 
      a.title, 
      a.close_date AS end, 
      a.open_date AS start,
      a.type, 
      c.name AS courseName, 
      c.id AS courseId
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    WHERE c.teacher_id = ?;
  `;
  const [rows] = await pool.query(sql, [teacherId]);
  return rows;
};