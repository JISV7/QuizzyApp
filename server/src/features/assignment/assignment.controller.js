import {
  createNewAssignment,
  fetchAssignmentDetails,
  fetchAssignmentsForCourse,
  processQuizSubmission,
  removeAssignment,
} from './assignment.service.js';

/**
 * Manejador para crear una nueva asignación.
 */
export const handleCreateAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    const assignment = await createNewAssignment(req.body, courseId, teacherId);

    res.status(201).json({
      success: true,
      message: "Asignación creada con éxito.",
      data: assignment
    });
  } catch (error) {
    const errorMap = {
      'FORBIDDEN': { status: 403, message: "Acceso prohibido. No eres el profesor de este curso." },
      'ASSIGNMENT_TITLE_EXISTS': { status: 409, message: "Ya existe una tarea con este título en el curso." }
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    if (err.status === 500) console.error(error);
    res.status(err.status).json({ success: false, message: err.message });
  }
};

/**
 * Manejador para obtener todas las asignaciones de un curso.
 */
export const handleGetAssignmentsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id: userId, role: userRole } = req.user;
    const assignments = await fetchAssignmentsForCourse(courseId, userId, userRole);
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ success: false, message: "No tienes permiso para ver este contenido." });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

/**
 * Manejador para obtener los detalles de una asignación.
 */
export const handleGetAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await fetchAssignmentDetails(assignmentId, req.user);
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    const errorMap = {
      'ASSIGNMENT_NOT_FOUND': { status: 404, message: 'Asignación no encontrada.' },
      'FORBIDDEN': { status: 403, message: 'No tienes permiso para ver esta asignación.' }
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    if (err.status === 500) console.error(error);
    res.status(err.status).json({ success: false, message: err.message });
  }
};

/**
 * Manejador para eliminar una asignación.
 */
export const handleDeleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const teacherId = req.user.id;
    const result = await removeAssignment(assignmentId, teacherId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorMap = {
      'ASSIGNMENT_NOT_FOUND': { status: 404, message: 'Asignación no encontrada.' },
      'FORBIDDEN': { status: 403, message: "Acceso prohibido. Solo el profesor del curso puede eliminar la asignación." }
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    if (err.status === 500) console.error(error);
    res.status(err.status).json({ success: false, message: err.message });
  }
};

/**
 * Manejador para la entrega de un quiz por parte de un estudiante.
 */
export const handleSubmitQuiz = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { answers } = req.body;
    const studentId = req.user.id;

    const result = await processQuizSubmission(Number(assignmentId), answers, studentId);
    
    res.status(201).json({ success: true, data: result });

  } catch (error) {
    const errorMap = {
      'ASSIGNMENT_NOT_FOUND_OR_NOT_QUIZ': { status: 404, message: 'El quiz no fue encontrado.' },
      'NOT_ENROLLED': { status: 403, message: 'No estás inscrito en el curso para entregar este quiz.' },
      'ALREADY_SUBMITTED': { status: 409, message: 'Ya has entregado este quiz.' },
      'ASSIGNMENT_CLOSED': { status: 403, message: 'La fecha límite para esta asignación ha pasado.' },
      'SUBMISSION_TRANSACTION_FAILED': { status: 500, message: 'Ocurrió un error al guardar tu entrega.' }
    };
    const err = errorMap[error.message] || { status: 500, message: 'Error interno del servidor.' };
    if (err.status === 500) console.error(error);
    res.status(err.status).json({ success: false, message: err.message });
  }
};