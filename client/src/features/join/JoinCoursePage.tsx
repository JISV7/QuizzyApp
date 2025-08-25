import { useEffect, useState, useRef } from 'react'; // Importamos useRef
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import './JoinCoursePage.css';

export const JoinCoursePage = () => {
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Uniéndote al curso...');
  const [error, setError] = useState('');
  
  // Este "guardián" se asegura de que la lógica solo se ejecute una vez
  const effectRan = useRef(false);

  useEffect(() => {
    // Si el guardián nos dice que ya se ejecutó, nos detenemos.
    if (effectRan.current === true) {
      return;
    }

    if (!inviteToken) {
      setError('No se proporcionó un token de invitación.');
      return;
    }

    const joinCourse = async () => {
      try {
        const response = await apiClient.post(`/courses/join/${inviteToken}`);
        const { courseId } = response.data.data;
        setStatus('¡Te has unido con éxito! Redirigiendo...');
        setTimeout(() => navigate(`/courses/${courseId}`), 2000);
      } catch (err: any) {
        // Ahora que solo se ejecuta una vez, el manejo de errores es más simple
        setError(err.response?.data?.message || 'Ocurrió un error.');
        setStatus('');
      }
    };

    joinCourse();

    // Activamos el guardián para futuras renderizaciones
    return () => {
      effectRan.current = true;
    };
  }, [inviteToken, navigate]); // Las dependencias no cambian

  return (
    <div className="join-page-container">
      <div className="join-card">
        {status && <h2>{status}</h2>}
        {error && (
          <>
            <h2 className="error-title">Error al Unirse al Curso</h2>
            <p className="error-message">{error}</p>
            <Link to="/dashboard" className="btn btn-secondary">Volver al Inicio</Link>
          </>
        )}
      </div>
    </div>
  );
};