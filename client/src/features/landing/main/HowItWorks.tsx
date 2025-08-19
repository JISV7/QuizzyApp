import './HowItWorks.css';
// Reemplaza estas imágenes por unas que representen los pasos
import imageStep1 from '@/assets/create-course.png';
import imageStep2 from '@/assets/design-quiz.png';
import imageStep3 from '@/assets/launch-quiz.png';

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-section">
      <div className="container how-container">
        <h2>Empieza en Menos de 5 Minutos</h2>
        <p className="section-description">
          Lanzar un quiz para tu clase nunca ha sido tan fácil.
        </p>
        <div className="how-steps">
          <div className="how-step">
            <div className="how-image-container">
              <img src={imageStep1} alt="Crear un curso y añadir estudiantes" />
              <span className="step-number">1</span>
            </div>
            <h3>Crea tu Curso</h3>
            <p>Configura tu clase y añade a tus estudiantes. ¡Reutiliza lo que ya tienes de StudyBooster!</p>
          </div>
          <div className="how-step">
            <div className="how-image-container">
              <img src={imageStep2} alt="Diseñar un quiz con preguntas y opciones" />
              <span className="step-number">2</span>
            </div>
            <h3>Diseña el Quiz</h3>
            <p>Añade preguntas, define las respuestas correctas y establece los límites de tiempo.</p>
          </div>
          <div className="how-step">
            <div className="how-image-container">
              <img src={imageStep3} alt="Estudiantes respondiendo el quiz en sus dispositivos" />
              <span className="step-number">3</span>
            </div>
            <h3>Lanza y Analiza</h3>
            <p>Envía el quiz a tus estudiantes y observa cómo llegan los resultados en tiempo real.</p>
          </div>
        </div>
      </div>
    </section>
  );
};