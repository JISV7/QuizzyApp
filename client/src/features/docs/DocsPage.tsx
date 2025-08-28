export const DocsPage = () => {
  return (
    <div className="doc-section">
      <h2>Manuales de Usuario</h2>
      
      <div className="download-manual-section">
        <p>Para una referencia completa y sin conexión, puedes descargar nuestro manual de usuario en formato PDF.</p>
        <a 
          href="/Manual Usuario Quizzy.pdf" 
          download 
          className="btn btn-primary"
        >
          Descargar Manual (PDF)
        </a>
      </div>
      
      <div className="term-item">
        <h3>Para Profesores</h3>
        <p><strong>Crear un curso:</strong> Desde tu panel, haz clic en "Crear Nuevo Curso", asigna un nombre y, opcionalmente, un código de acceso único para tus estudiantes.</p>
        <p><strong>Crear un Quiz:</strong> Dentro de un curso, ve a la sección de "Asignaciones" y selecciona "Crear Asignación". Elige el tipo "Quiz" y configura sus detalles. Luego, entra al quiz para añadir preguntas.</p>
      </div>

      <div className="term-item">
        <h3>Para Estudiantes</h3>
        <p><strong>Unirse a un curso:</strong> Tu profesor te proporcionará un código de curso. En tu panel, selecciona "Unirse a un Curso" e introduce el código.</p>
        <p><strong>Realizar un Quiz:</strong> Navega al curso, encuentra el quiz en la lista de asignaciones y haz clic en él. Asegúrate de enviarlo antes de la fecha de cierre.</p>
      </div>
    </div>
  );
};