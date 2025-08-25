import { Router } from 'express';
import { register, login, logout } from './auth.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// --- Rutas Públicas ---
router.post('/register', register);
router.post('/login', login);

// --- Rutas Protegidas ---
router.post('/logout', verifyJWT, logout);

export default router;
