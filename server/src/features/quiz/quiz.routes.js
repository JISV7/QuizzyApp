import { Router } from 'express';
import {
  handleAddQuestionToQuiz,
  handleGetQuizQuestionsForStudent,
  handleDeleteQuestion,
  handleUpdateQuestion,
} from './quiz.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addQuestionSchema, updateQuestionSchema } from './quiz.validation.js';

const router = Router();

// Todas las rutas de este router requieren autenticación
router.use(verifyJWT);

// --- Rutas de Profesores ---

// Añadir una nueva pregunta a un quiz (que es una asignación)
router.post(
  '/assignments/:assignmentId/questions',
  authorizeRoles('teacher'),
  validate(addQuestionSchema),
  handleAddQuestionToQuiz
);

// Actualizar una pregunta existente
router.put(
  '/questions/:questionId',
  authorizeRoles('teacher'),
  validate(updateQuestionSchema),
  handleUpdateQuestion
);

// Eliminar una pregunta de un quiz
router.delete(
  '/questions/:questionId',
  authorizeRoles('teacher'),
  handleDeleteQuestion
);


// --- Ruta de Estudiantes ---

// Obtener todas las preguntas de un quiz para resolverlo
router.get(
  '/assignments/:assignmentId/questions',
  authorizeRoles('student'),
  handleGetQuizQuestionsForStudent
);

export default router;