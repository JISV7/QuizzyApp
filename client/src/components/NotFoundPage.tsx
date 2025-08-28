import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  const { user } = useAuth();
  
  // El enlace de destino depende de si el usuario ha iniciado sesión o no
  const homePath = user ? '/dashboard' : '/';

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Página No Encontrada</p>
        <p className="not-found-description">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link to={homePath} className="btn btn-primary">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};