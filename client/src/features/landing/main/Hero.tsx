import { Link } from 'react-router-dom';
import './Hero.css';
import heroImage from '@/assets/quiz-hero-illustration.png'; 

export const Hero = () => {
  return (
    <main className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <p className="pre-headline">▷ Aprendizaje Interactivo</p>
          <h1>Quizzy</h1>
          <p className="description">
            La forma más sencilla para que los profesores creen quizzes dinámicos y para que los estudiantes disfruten el aprendizaje. ¡Evalúa en tiempo real y haz que cada lección cuente!
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Crear mi Primer Quiz →</Link>
            <button className="btn-demo">▷ Ver un Quiz de Ejemplo</button>
          </div>
          <div className="hero-guarantees">
            <span>✔ Plan Básico Gratuito</span>
            <span>✔ Resultados al Instante</span>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroImage} alt="Ilustración de estudiantes participando en un quiz" />
        </div>
      </div>
    </main>
  );
};