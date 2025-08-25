import jwt from 'jsonwebtoken';
import { createNewCourse, fetchEnrolledStudents, fetchMyCourses, generateCourseInvite, inviteStudentToCourse, joinCourseWithInvite, removeCourse, removeStudentFromCourse } from './course.service.js';

export const handleCreateCourse = async (req, res) => {
  try {
    // El ID del profesor viene del middleware verifyJWT
    const teacherId = req.user.id;
    const course = await createNewCourse(req.body, teacherId);
    res.status(201).json({ success: true, message: "Curso creado con éxito", data: course });
  } catch (error) {
    if (error.message === 'COURSE_CODE_EXISTS') {
      return res.status(409).json({ success: false, message: "El código del curso ya está en uso." });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const handleInviteStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { username } = req.body;
    const result = await inviteStudentToCourse(username, courseId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorMessages = {
      'STUDENT_NOT_FOUND': { status: 404, message: 'Estudiante no encontrado.' },
      'USER_IS_NOT_A_STUDENT': { status: 400, message: 'El usuario no es un estudiante.' },
      'ALREADY_ENROLLED': { status: 409, message: 'El estudiante ya está inscrito en este curso.' }
    };
    const err = errorMessages[error.message] || { status: 500, message: 'Error interno del servidor.' };
    res.status(err.status).json({ success: false, message: err.message });
  }
};

export const handleGetMyCourses = async (req, res) => {
  try {
    const { id, role } = req.user;
    const courses = await fetchMyCourses(id, role);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const handleDeleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const result = await removeCourse(courseId, teacherId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'NOT_AUTHORIZED_OR_NOT_FOUND') {
      return res.status(403).json({ success: false, message: 'No autorizado para eliminar este curso o el curso no existe.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const handleGetEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const students = await fetchEnrolledStudents(courseId, teacherId);
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver los estudiantes de este curso.' });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const handleRemoveStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentIds } = req.body;
    const teacherId = req.user.id;
    const result = await removeStudentFromCourse(studentIds, courseId, teacherId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'NOT_AUTHORIZED') {
      return res.status(403).json({ success: false, message: 'No autorizado para gestionar los estudiantes de este curso.' });
    }
    if (error.message === 'STUDENT_NOT_IN_COURSE') {
      return res.status(404).json({ success: false, message: 'El estudiante no se encuentra inscrito en este curso.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const handleGenerateInvite = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const inviteLink = await generateCourseInvite(courseId, teacherId);
    res.status(200).json({ success: true, data: { inviteLink } });
  } catch (error) {
   if (error.message === 'NOT_AUTHORIZED') {
      return res.status(403).json({ success: false, message: 'No autorizado para gestionar invitaciones a este curso.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const handleJoinWithInvite = async (req, res) => {
  try {
    const { inviteToken } = req.params;
    const studentId = req.user.id;
    const result = await joinCourseWithInvite(inviteToken, studentId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    // Si hay un error, intentamos obtener el courseId del token para la redirección
    const { inviteToken } = req.params;
    let courseId = null;
    try {
      const decoded = jwt.decode(inviteToken);
      if (decoded && typeof decoded === 'object') {
        courseId = decoded.courseId;
      }
    } catch {}

    const errorMap = {
      // Añadimos el courseId a la respuesta de "ya inscrito"
      'ALREADY_ENROLLED': { status: 409, message: 'Ya estás inscrito en este curso.', data: { courseId } },
      'INVALID_OR_EXPIRED_TOKEN': { status: 400, message: 'El enlace de invitación no es válido o ha expirado.' }
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    res.status(err.status).json({ success: false, message: err.message, data: err.data });
  }
};