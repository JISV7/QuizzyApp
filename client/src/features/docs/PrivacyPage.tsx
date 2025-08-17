export const PrivacyPage = () => {
  return (
    <div className="doc-section">
      <h2>Política de Privacidad</h2>
      <p>En Quizzy, respetamos tu privacidad y nos comprometemos a protegerla.</p>

      <div className="term-item">
        <h3>Información que Recopilamos</h3>
        <p>Recopilamos información que nos proporcionas directamente, cuando creas una cuenta (nombre, correo electrónico, rol) y el contenido que generas (cursos, quizzes, respuestas).</p>
      </div>

      <div className="term-item">
        <h3>Cómo Usamos tu Información</h3>
        <p>Utilizamos la información para poder operar y mantener el servicio como una aplicación disponible desde la web, para comunicarnos contigo y recibir sugerencias, para procesar solicitudes y para personalizar tu experiencia. No compartimos tu información personal con terceros, excepto para cumplir con la ley.</p>
      </div>

      <div className="term-item">
        <h3>Seguridad de los Datos</h3>
        <p>Tomamos medidas razonables para proteger tu información contra pérdida, robo, uso indebido y acceso no autorizado. Todas las contraseñas se almacenan de forma encriptada.</p>
      </div>
    </div>
  );
};