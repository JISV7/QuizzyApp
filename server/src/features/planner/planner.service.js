import { getPendingAssignmentsForStudent, getAssignmentsForTeacher } from './planner.repository.js';

/**
 * Asigna un color a cada tipo de evento para el calendario.
 * @param {string} type - El tipo de asignación ('quiz', etc.).
 * @returns {string} Un código de color hexadecimal.
 */
const getEventColor = (type) => {
  switch (type) {
    case 'quiz': return '#10B981'; // Verde
    default: return '#6B7280'; // Gris
  }
};

/**
 * Formatea una lista de asignaciones al formato de evento de FullCalendar.
 * @param {Array<object>} assignments - Lista de asignaciones desde la BD.
 * @returns {Array<object>} Lista de eventos para el calendario.
 */
const formatAssignmentsToEvents = (assignments) => {
  return assignments.map(assignment => ({
    id: `assignment-${assignment.id}`,
    title: `${assignment.courseName}: ${assignment.title}`,
    start: assignment.start,
    end: assignment.end,
    color: getEventColor(assignment.type),
    url: `/assignments/${assignment.id}`,
    extendedProps: {
      courseId: assignment.courseId,
      courseName: assignment.courseName,
      type: assignment.type,
    }
  }));
};

/**
 * Lógica de negocio para obtener los eventos del calendario de un estudiante.
 * @param {number} studentId - El ID del estudiante.
 */
export const fetchStudentCalendarEvents = async (studentId) => {
  const assignments = await getPendingAssignmentsForStudent(studentId);
  return formatAssignmentsToEvents(assignments);
};

/**
 * Lógica de negocio para obtener los eventos del calendario de un profesor.
 * @param {number} teacherId - El ID del profesor.
 */
export const fetchTeacherCalendarEvents = async (teacherId) => {
  const assignments = await getAssignmentsForTeacher(teacherId);
  return formatAssignmentsToEvents(assignments);
};