import { Router } from 'express';
import {
  handleCreateAssignment,
  handleDeleteAssignment,
  handleGetAssignmentDetails,
  handleGetAssignmentsForCourse,
  handleSubmitQuiz,
} from './assignment.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createAssignmentSchema, submitQuizSchema } from './assignment.validation.js';

const router = Router();

// Todas las rutas de este router requieren que el usuario esté autenticado.
router.use(verifyJWT);

// --- Rutas de Profesores ---

// Crear una nueva asignación (quiz) en un curso
router.post(
  '/courses/:courseId/assignments',
  authorizeRoles('teacher'),
  validate(createAssignmentSchema),
  handleCreateAssignment
);

// Eliminar una asignación
router.delete(
  '/assignments/:assignmentId',
  authorizeRoles('teacher'),
  handleDeleteAssignment
);


// --- Rutas Comunes (Profesores y Estudiantes) ---

// Obtener todas las asignaciones de un curso
router.get(
  '/courses/:courseId/assignments',
  handleGetAssignmentsForCourse
);

// Obtener los detalles de una asignación específica
router.get(
  '/assignments/:assignmentId',
  handleGetAssignmentDetails
);


// --- Rutas de Estudiantes ---

// Entregar las respuestas de un quiz
router.post(
  '/assignments/:assignmentId/submit',
  authorizeRoles('student'),
  validate(submitQuizSchema),
  handleSubmitQuiz
);

export default router;