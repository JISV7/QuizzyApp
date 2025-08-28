export const SecurityPage = () => {
  return (
    <div className="doc-section">
      <h2>Prácticas de Seguridad</h2>
      <p>La seguridad de tus datos es una prioridad máxima para nosotros.</p>

      <div className="term-item">
        <h3>Encriptación de Datos</h3>
        <p>Toda la comunicación entre tu navegador y nuestros servidores está protegida con encriptación SSL/TLS. Las contraseñas de los usuarios se almacenan utilizando algoritmos de hash seguros (bcrypt), lo que significa que nunca almacenamos tu contraseña en texto plano.</p>
      </div>

      <div className="term-item">
        <h3>Recuperación de Contraseña</h3>
        <p>Debido a nuestro sistema de encriptación, las contraseñas no se pueden recuperar. Si olvidas tu contraseña y no puedes acceder a tu cuenta, te recomendamos ponerte en contacto con nuestro equipo de soporte a través de la página de "Contacto" para que podamos evaluar tu situación y ayudarte.</p>
      </div>

       <div className="term-item">
        <h3>Infraestructura Segura</h3>
        <p>Nuestra infraestructura se aloja en proveedores de nube líderes en la industria que cumplen con los más altos estándares de seguridad física y de red.</p>
      </div>
    </div>
  );
};