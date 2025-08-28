import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // 1. Mientras se verifica el estado de autenticación, no mostramos nada
  if (isLoading) {
    return <div>Verificando autenticación...</div>;
  }

  // 2. Si no hay usuario después de la carga, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si el usuario está autenticado, renderiza la página solicitada
  return <Outlet />;
};