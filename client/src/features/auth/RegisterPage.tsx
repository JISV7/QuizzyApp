import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './AuthForm.css';
import { Footer } from '@/components/Footer';

export const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      await register({ firstName, lastName, username, email, password, role });
      setSuccessMessage('¡Registro exitoso! Bienvenido a Quizzy.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la cuenta.');
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2>Crear una Cuenta</h2>
        <p className="auth-subtitle">Comienza tu aventura de aprendizaje hoy.</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Nombre</label>
            <input type="text" id="firstName" placeholder="Itachi" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellido</label>
            <input type="text" id="lastName" placeholder="Uchiha" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" id="username" placeholder="Ituchiii" value={username} onChange={(e) => setUsername(e.target.value)} required 
            />
          </div>


          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>


          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>


          <div className="form-group">
            <label htmlFor="role">Soy un...</label>
            <select id="role" className="form-group-input"value={role}onChange={(e) => setRole(e.target.value)} >
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
            </select>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          
          <button type="submit" className="auth-button">Crear Cuenta</button>
        </form>

        <p className="auth-switch-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
        <Footer></Footer>
      </div>
    </div>
  );
};