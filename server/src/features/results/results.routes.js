import { Router } from 'express';
import { getAssignmentResults, getMyCourseResults, getSubmissionDetails } from './results.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { courseParamsSchema, assignmentParamsSchema, submissionParamsSchema } from './results.validation.js';

const router = Router();

// All results routes require authentication
router.use(verifyJWT);

// --- Teacher Route ---
// Get all submissions for a specific quiz
router.get(
    '/assignments/:assignmentId/results',
    authorizeRoles('teacher'),
    validate(assignmentParamsSchema),
    getAssignmentResults
);


// --- Student Route ---
// Get all of my submissions/grades in a specific course
router.get(
    '/courses/:courseId/my-results',
    authorizeRoles('student'),
    validate(courseParamsSchema),
    getMyCourseResults
);

// --- Shared Route (Teacher & Student) ---
// Get the detailed breakdown of a single submission
router.get(
    '/submissions/:submissionId',
    validate(submissionParamsSchema),
    getSubmissionDetails
);


export default router;