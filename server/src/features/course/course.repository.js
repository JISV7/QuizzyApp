import { pool } from '../../config/database.js';

/**
 * Crea un nuevo curso en la base de datos.
 * @param {object} courseData - Datos del curso.
 * @param {number} teacherId - ID del profesor que crea el curso.
 * @returns {Promise<object>} El curso recién creado.
 */
export const createCourse = async (courseData, teacherId) => {
  const { name, description, code } = courseData;
  const [result] = await pool.query(
    'INSERT INTO courses (name, description, code, teacher_id) VALUES (?, ?, ?, ?)',
    [name, description, code, teacherId]
  );
  const [course] = await pool.query('SELECT * FROM courses WHERE id = ?', [result.insertId]);
  return course[0];
};

/**
 * Busca un usuario por su nombre de usuario.
 * @param {string} username - El nombre de usuario a buscar.
 * @returns {Promise<object|null>} El usuario si se encuentra.
 */
export const findUserByUsername = async (username) => {
    const [rows] = await pool.query('SELECT id, role FROM users WHERE username = ?', [username]);
    return rows[0] || null;
};

/**
 * Inscribe a un estudiante en un curso.
 * @param {number} studentId - ID del estudiante.
 * @param {number} courseId - ID del curso.
 * @returns {Promise<object>} El resultado de la inscripción.
 */
export const enrollStudent = async (studentId, courseId) => {
    const [result] = await pool.query(
        'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
        [studentId, courseId]
    );
    return result;
};

/**
 * Finds a specific enrollment record for a student in a course.
 * @param {number} student_id - The ID of the student.
 * @param {number} course_id - The ID of the course.
 * @returns {Promise<object|null>} The enrollment record if found, otherwise null.
 */
export const findEnrollment = async (student_id, course_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
    [student_id, course_id]
  );
  return rows[0] || null;
};

/**
 * Verifica si un estudiante ya está inscrito en un curso.
 * @param {number} studentId - ID del estudiante.
 * @param {number} courseId - ID del curso.
 * @returns {Promise<boolean>}
 */
export const isStudentEnrolled = async (studentId, courseId) => {
    const [rows] = await pool.query(
        'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
        [studentId, courseId]
    );
    return rows.length > 0;
};

/**
 * Busca un curso por su ID y el ID del profesor.
 * Se usa para verificar que un profesor es el dueño del curso.
 * @param {number} courseId - ID del curso.
 * @param {number} teacherId - ID del profesor.
 * @returns {Promise<object|null>} El curso si se encuentra y coincide el profesor.
 */
export const findCourseByIdAndTeacher = async (courseId, teacherId) => {
  const [rows] = await pool.query(
    'SELECT * FROM courses WHERE id = ? AND teacher_id = ?',
    [courseId, teacherId]
  );
  return rows[0] || null;
};

export const findCourseByCode = async (code) => {
  if (!code) return null; // No buscar si el código es nulo o vacío
  const [rows] = await pool.query('SELECT * FROM courses WHERE code = ?', [code]);
  return rows[0] || null;
};

/**
 * Obtiene todos los cursos que imparte un profesor.
 * @param {number} teacherId - El ID del profesor.
 */
export const findCoursesByTeacherId = async (teacherId) => {
  const [rows] = await pool.query('SELECT * FROM courses WHERE teacher_id = ? ORDER BY created_at DESC', [teacherId]);
  return rows;
};

/**
 * Obtiene todos los cursos en los que un estudiante está inscrito.
 * @param {number} studentId - El ID del estudiante.
 */
export const findCoursesByStudentId = async (studentId) => {
  const sql = `
    SELECT c.* FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.student_id = ? AND e.enrollment_status = 'active'
    ORDER BY c.created_at DESC
  `;
  const [rows] = await pool.query(sql, [studentId]);
  return rows;
};

/**
 * Elimina un curso de la base de datos por su ID.
 * @param {number} courseId - El ID del curso a eliminar.
 */
export const deleteCourseById = async (courseId) => {
  const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [courseId]);
  return result;
};

/**
 * Busca un curso por su ID.
 * @param {number} courseId - El ID del curso a buscar.
 * @returns {Promise<object|null>} El curso si se encuentra.
 */
export const findCourseById = async (courseId) => {
  const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
  return rows[0] || null;
};

/**
 * Obtiene la lista de estudiantes inscritos en un curso.
 * @param {number} courseId - El ID del curso.
 * @returns {Promise<Array<object>>} La lista de estudiantes.
 */
export const findEnrolledStudentsByCourseId = async (courseId) => {
  const sql = `
    SELECT u.id, u.first_name, u.last_name, u.username, u.email 
    FROM users u
    JOIN enrollments e ON u.id = e.student_id
    WHERE e.course_id = ? AND e.enrollment_status = 'active'
    ORDER BY u.last_name, u.first_name;
  `;
  const [rows] = await pool.query(sql, [courseId]);
  return rows;
};

/**
 * Elimina la inscripción de uno o varios estudiantes de un curso.
 * @param {Array<number>} studentIds - Array de IDs de estudiantes.
 * @param {number} courseId - ID del curso.
 */
export const unenrollStudent = async (studentIds, courseId) => {
  const [result] = await pool.query(
    'DELETE FROM enrollments WHERE student_id IN (?) AND course_id = ?',
    [studentIds, courseId]
  );
  return result;
};