import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { handleGetCalendarEvents } from './planner.controller.js';

const router = Router();

// Ruta unificada para obtener los eventos del calendario.
// El controlador se encarga de la lógica de roles.
router.get(
  '/planner/events',
  verifyJWT,
  handleGetCalendarEvents
);

export default router;