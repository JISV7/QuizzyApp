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
        <p>Si olvidas tu contraseña, puedes solicitar un restablecimiento a través de nuestra página de inicio de sesión. Te enviaremos un enlace seguro a tu correo electrónico registrado para que puedas establecer una nueva contraseña. Nunca te pediremos tu contraseña por correo electrónico.</p>
      </div>

       <div className="term-item">
        <h3>Infraestructura Segura</h3>
        <p>Nuestra infraestructura se aloja en proveedores de nube líderes en la industria que cumplen con los más altos estándares de seguridad física y de red.</p>
      </div>
    </div>
  );
};