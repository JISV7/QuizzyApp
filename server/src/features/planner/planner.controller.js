import { fetchStudentCalendarEvents, fetchTeacherCalendarEvents } from "./planner.service.js";

/**
 * Maneja la solicitud de eventos del calendario, delegando al servicio
 * correspondiente según el rol del usuario.
 */
export const handleGetCalendarEvents = async (req, res) => {
  try {
    const { id: userId, role } = req.user; // Obtenido del middleware verifyJWT
    let events;

    if (role === 'student') {
      events = await fetchStudentCalendarEvents(userId);
    } else if (role === 'teacher') {
      events = await fetchTeacherCalendarEvents(userId);
    } else {
      // Si hay otros roles o no se especifica, devolver un array vacío.
      events = [];
    }
    
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};