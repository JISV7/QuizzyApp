import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import './PlannerPage.css';

export const PlannerPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Se llama al endpoint unificado, el backend se encarga del rol
        const response = await apiClient.get('/planner/events');
        
        if (response.data.success) {
          setEvents(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudieron cargar los eventos del calendario.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleEventClick = (clickInfo: any) => {
    clickInfo.jsEvent.preventDefault();
    if (clickInfo.event.url) {
      navigate(clickInfo.event.url);
    }
  };

  if (loading) {
    return <div className="planner-status">Cargando calendario...</div>;
  }

  if (error) {
    return <div className="planner-status error">{error}</div>;
  }
  
  if (!user) {
      return <div className="planner-status">Debes iniciar sesión para ver el calendario.</div>
  }

  return (
    <div className="planner-container">
      <Link to="/dashboard" className="back-to-dashboard-link">&larr; Volver al Inicio</Link>
      <h2>
        {user.role === 'student' 
          ? 'Calendario de Actividades Pendientes' 
          : 'Calendario de Actividades'}
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        events={events}
        eventClick={handleEventClick}
        locale="es"
        buttonText={{
          today:    'Hoy',
          month:    'Mes',
          week:     'Semana',
        }}
        height="auto"
      />
    </div>
  );
};