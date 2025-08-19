import { Router } from 'express';
import { handleCreateCourse, handleDeleteCourse, handleGetEnrolledStudents, handleGetMyCourses, handleInviteStudent, handleRemoveStudent } from './course.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { handleGetCourseDetails } from './course.service.js';

const router = Router();

// Todas las rutas de cursos requieren autenticación
router.use(verifyJWT);

// Ruta para crear un curso (solo para profesores)
router.post('/', authorizeRoles('teacher'), handleCreateCourse);

// Ruta para invitar a un estudiante a un curso (profesores)
router.post('/:courseId/invite', authorizeRoles('teacher'), handleInviteStudent);

// Ruta para obtener los cursos del usuario logueado (estudiante o profesor)
router.get('/', handleGetMyCourses);

// Ruta para obtener los detalles de un curso
router.get('/:courseId', handleGetCourseDetails);

// Ruta para eliminar un curso (solo profesores)
router.delete('/:courseId', authorizeRoles('teacher'), handleDeleteCourse);
// Obtener la lista de estudiantes de un curso (profesores)
router.get('/:courseId/students', authorizeRoles('teacher'), handleGetEnrolledStudents);

// Eliminar a un estudiante de un curso (profesores)
router.delete('/:courseId/students', authorizeRoles('teacher'), handleRemoveStudent);

export default router;