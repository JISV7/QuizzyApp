import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import './HomePage.css'; 

export const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; 
  }

  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        <div className="action-card">
          <header className="action-card-header">
            <h1>Bienvenido de nuevo a Quizzy, {user.first_name || user.username}!</h1>
            <p>¿A dónde iremos hoy?</p>
          </header>
          <div className="action-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/courses')}
            >
              Mis Cursos
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={logout}
            >
              Cerrar Sesión
            </button>
            En caso de necesitarlo, tu username es: {user.username}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};