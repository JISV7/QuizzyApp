import { Link } from 'react-router-dom'; // No olvides el import si no está ya

export const DocsPage = () => {
  return (
    <div className="doc-section">
      <h2>Manuales de Usuario</h2>
      
      <div className="download-manual-section">
        <p>Para una referencia completa y detallada, puedes descargar nuestro manual de usuario en formato PDF.</p>
        <a 
          href="/Manual Usuario Quizzy.pdf" 
          download 
          className="btn btn-primary"
        >
          Descargar Manual (PDF)
        </a>
      </div>

      <div className="faq-mention-section">
          <p>Para respuestas rápidas a las dudas más comunes, también puedes consultar nuestras <Link to="/docs/faq">Preguntas Frecuentes (FAQ)</Link>.</p>
      </div>
      
      <div className="term-item">
        <h3>Para Profesores</h3>
        <p><strong>Crear un curso:</strong> Desde tu panel principal, haz clic en "Crear Curso". Una vez creado, podrás generar un <strong>enlace de invitación</strong> único para compartir con tus estudiantes.</p>
        <p><strong>Crear un Quiz:</strong> Dentro de un curso, selecciona "Crear Asignación" para acceder al editor. Allí podrás añadir el título, las preguntas y configurar las fechas de entrega.</p>
      </div>

      <div className="term-item">
        <h3>Para Estudiantes</h3>
        <p><strong>Unirse a un curso:</strong> Tu profesor te proporcionará un <strong>enlace de invitación</strong>. Simplemente abre ese enlace en el mismo navegador donde hayas iniciado sesión para unirte automáticamente.</p>
        <p><strong>Realizar un Quiz:</strong> Navega al curso, busca el quiz en la lista de "Asignaciones Pendientes" y haz clic en él para comenzar. ¡Asegúrate de completarlo antes de la fecha de cierre!</p>
      </div>
    </div>
  );
};