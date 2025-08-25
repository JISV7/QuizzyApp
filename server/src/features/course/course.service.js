import jwt from 'jsonwebtoken';
import { createCourse, findUserByUsername, enrollStudent, isStudentEnrolled, findCourseByCode, findCoursesByTeacherId, findCoursesByStudentId, findCourseByIdAndTeacher, deleteCourseById, findCourseById, unenrollStudent, findEnrolledStudentsByCourseId } from './course.repository.js';

/**
 * Lógica de negocio para crear un curso.
 * @param {object} courseData - Datos del curso.
 * @param {number} teacherId - ID del profesor.
 */
export const createNewCourse = async (courseData, teacherId) => {
  const finalCode = courseData.code || null;

  // Solo verificamos si el código ya existe si no es nulo.
  if (finalCode) {
    const existingCourse = await findCourseByCode(finalCode);
    if (existingCourse) {
      throw new Error('COURSE_CODE_EXISTS');
    }
  }

  const newCourse = await createCourse({ ...courseData, code: finalCode }, teacherId);
  return newCourse;
};

/**
 * Lógica de negocio para invitar a un estudiante.
 * @param {string} username - Nombre de usuario del estudiante.
 * @param {number} courseId - ID del curso.
 */
export const inviteStudentToCourse = async (username, courseId) => {
  // 1. Buscar al estudiante por su username
  const student = await findUserByUsername(username);
  if (!student) {
    throw new Error('STUDENT_NOT_FOUND');
  }
  if (student.role !== 'student') {
    throw new Error('USER_IS_NOT_A_STUDENT');
  }

  // 2. Verificar si el estudiante ya está inscrito
  const alreadyEnrolled = await isStudentEnrolled(student.id, courseId);
  if (alreadyEnrolled) {
    throw new Error('ALREADY_ENROLLED');
  }

  // 3. Inscribir al estudiante
  await enrollStudent(student.id, courseId);

  return { message: `Estudiante ${username} invitado al curso con éxito.` };
};

/**
 * Lógica para obtener los cursos de un usuario según su rol.
 */
export const fetchMyCourses = async (userId, userRole) => {
  if (userRole === 'teacher') {
    return await findCoursesByTeacherId(userId);
  }
  if (userRole === 'student') {
    return await findCoursesByStudentId(userId);
  }
  return []; // Devuelve vacío si el rol no es ni profesor ni estudiante
};

/**
 * Lógica para eliminar un curso.
 */
export const removeCourse = async (courseId, teacherId) => {
  // 1. Verificar que el profesor que intenta borrar es el dueño del curso
  const course = await findCourseByIdAndTeacher(courseId, teacherId);
  if (!course) {
    throw new Error('NOT_AUTHORIZED_OR_NOT_FOUND');
  }

  // 2. Eliminar el curso
  await deleteCourseById(courseId);
  return { message: 'Curso eliminado con éxito.' };
};

/**
 * Lógica para obtener los detalles de un curso específico.
 */
export const fetchCourseDetails = async (courseId, user) => {
  // 1. Verificamos si el curso existe
  const courseDetails = await findCourseById(courseId);
  if (!courseDetails) {
    throw new Error('COURSE_NOT_FOUND');
  }

  // 2. Si el curso existe, ahora verificamos los permisos.
  let hasPermission = false;
  if (user.role === 'teacher') {
    if (courseDetails.teacher_id === user.id) hasPermission = true;
  } else if (user.role === 'student') {
    const enrolled = await isStudentEnrolled(user.id, courseId);
    if (enrolled) hasPermission = true;
  }

  if (!hasPermission) {
    throw new Error('FORBIDDEN');
  }

  return courseDetails;
};

export const handleGetCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await fetchCourseDetails(courseId, req.user);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver este curso.' });
    }
    if (error.message === 'COURSE_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Curso no encontrado.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

/**
 * Lógica de negocio para obtener los estudiantes de un curso.
 */
export const fetchEnrolledStudents = async (courseId, teacherId) => {
  const course = await findCourseByIdAndTeacher(courseId, teacherId);
  if (!course) throw new Error('FORBIDDEN');
  return await findEnrolledStudentsByCourseId(courseId);
};

/**
 * Lógica de negocio para eliminar a un estudiante de un curso.
 */
export const removeStudentFromCourse = async (studentIds, courseId, teacherId) => {
  const course = await findCourseByIdAndTeacher(courseId, teacherId);
  if (!course) throw new Error('FORBIDDEN');

  if (!studentIds || studentIds.length === 0) {
    throw new Error('NO_STUDENTS_SELECTED');
  }

  const result = await unenrollStudent(studentIds, courseId);
  if (result.affectedRows === 0) throw new Error('STUDENT_NOT_IN_COURSE');
  
  return { message: 'Estudiantes eliminados del curso con éxito.' };
};

/**
 * Lógica para que un profesor genere un enlace de invitación temporal.
 */
export const generateCourseInvite = async (courseId, teacherId) => {
  const course = await findCourseByIdAndTeacher(courseId, teacherId);
  if (!course) {
    throw new Error('NOT_AUTHORIZED_OR_NOT_FOUND');
  }

  // Crear el payload del token con el ID del curso
  const payload = { courseId: Number(courseId) };

  // Firmar el token con una expiración de 24 horas
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET, // Usamos la misma clave secreta
    { expiresIn: '24h' }
  );
  
  // Devolver el enlace completo para el frontend
  const clientURL = process.env.CORS_ORIGIN;
  return `${clientURL}/join/${token}`;
};

/**
 * Lógica para que un estudiante se una a un curso usando el token.
 */
export const joinCourseWithInvite = async (inviteToken, studentId) => {
  try {
    // 1. Verificar el token (firma y expiración)
    const decoded = jwt.verify(inviteToken, process.env.JWT_SECRET);
    const { courseId } = decoded;

    // 2. Verificar que el estudiante no esté ya inscrito
    const alreadyEnrolled = await isStudentEnrolled(studentId, courseId);
    if (alreadyEnrolled) {
      throw new Error('ALREADY_ENROLLED');
    }

    // 3. Inscribir al estudiante
    await enrollStudent(studentId, courseId);

    // 4. Devolver el ID del curso para la redirección
    return { courseId };

  } catch (error) {
    // Si el token es inválido o expiró, jwt.verify lanzará un error
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      throw new Error('INVALID_OR_EXPIRED_TOKEN');
    }
    // Relanzar otros errores (como ALREADY_ENROLLED)
    throw error;
  }
};