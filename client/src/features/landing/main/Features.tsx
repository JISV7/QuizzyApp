import './Features.css';

export const Features = () => {
  return (
    <section id="features" className="features-section">
      <div className="container features-container">
        <h2>Herramientas Diseñadas para el <span className="highlight">Éxito</span></h2>
        <p className="section-description">
          Todo lo que necesitas para crear, distribuir y analizar quizzes de forma eficiente.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Creador de Quizzes Intuitivo</h3>
            <p>Diseña evaluaciones con preguntas de opción múltiple, verdadero/falso y más en cuestión de minutos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Feedback en Tiempo Real</h3>
            <p>Los estudiantes reciben sus resultados al instante, reforzando el aprendizaje en el momento.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Reportes y Analíticas</h3>
            <p>Analiza el rendimiento de tus estudiantes para identificar áreas de mejora y fortalezas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏦</div>
            <h3>Banco de Preguntas</h3>
            <p>Reutiliza preguntas de quizzes anteriores para crear nuevas evaluaciones rápidamente.</p>
          </div>
        </div>
      </div>
    </section>
  );
};