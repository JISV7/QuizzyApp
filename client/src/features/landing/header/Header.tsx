import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <header className="main-header">
      <nav className="container header-nav">
        <div className="logo">
          Quizzy
        </div>
        <ul className="nav-links">
          <li><a href="#features">Características</a></li>
          <li><a href="#how-it-works">Cómo Funciona</a></li>
          <li><a href="#testimonials">Testimonios</a></li>
        </ul>
        <div className="nav-actions">
          <Link to="/dashboard" className="btn btn-secondary">Iniciar Sesión</Link>
          <Link to="/register" className="btn btn-primary">Registrarse Gratis</Link>
        </div>
      </nav>
    </header>
  );
};