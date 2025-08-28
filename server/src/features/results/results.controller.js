import * as ResultsService from './results.service.js';

/**
 * Handles request for a teacher to get results for an assignment.
 */
export const getAssignmentResults = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const results = await ResultsService.getResultsForAssignment(Number(assignmentId), req.user.id);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    const errorMap = {
      'ASSIGNMENT_NOT_FOUND': { status: 404, message: 'Asignación no encontrada.' },
      'UNAUTHORIZED': { status: 403, message: 'No tienes permiso para ver los resultados de esta asignación.' },
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    if (err.status === 500) console.error(error);
    res.status(err.status).json({ success: false, message: err.message });
  }
};

/**
 * Handles request for a student to get their results in a course.
 */
export const getMyCourseResults = async (req, res) => {
  try {
    const { courseId } = req.params;
    const results = await ResultsService.getMyResultsInCourse(Number(courseId), req.user.id);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    if (error.message === 'NOT_ENROLLED') {
      return res.status(403).json({ success: false, message: 'No estás inscrito en este curso.' });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

/**
 * Handles request to get the details of a single submission.
 */
export const getSubmissionDetails = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const details = await ResultsService.getSubmissionDetails(Number(submissionId), req.user);
        res.status(200).json({ success: true, data: details });
    } catch (error) {
        const errorMap = {
            'SUBMISSION_NOT_FOUND': { status: 404, message: 'Entrega no encontrada.' },
            'UNAUTHORIZED': { status: 403, message: 'No tienes permiso para ver esta entrega.' },
        };
        const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
        if (err.status === 500) console.error(error);
        res.status(err.status).json({ success: false, message: err.message });
    }
};