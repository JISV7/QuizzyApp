import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './features/auth/auth.routes.js';
import courseRouter from './features/course/course.routes.js';
import assignmentRouter from './features/assignment/assignment.routes.js';
import resultsRouter from './features/results/results.routes.js';
import quizRouter from './features/quiz/quiz.routes.js';
import plannerRouter from './features/planner/planner.routes.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middlewares ---

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Rutas ---

app.get('/api/check', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API de Quizzy funcionando'
  });
});

app.use('/api', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api', assignmentRouter);
app.use('/api', quizRouter);
app.use('/api', resultsRouter);
app.use('/api', plannerRouter); 

export default app;