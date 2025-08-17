import './Footer.css';

export const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="container footer-landing-container">
                <div className="footer-landing-about">
                    <h3>Quizzy</h3>
                    <p>Creando experiencias de aprendizaje interactivas a través de quizzes dinámicos. Evalúa, aprende y compite.</p>
                    {/* Aquí puedes agregar íconos de redes sociales en el futuro */}
                </div>
                <div className="footer-landing-links">
                    <h4>Producto</h4>
                    <ul>
                        <li><a href="#features">Características</a></li>
                        <li><a href="#">Precios</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                <div className="footer-landing-links">
                    <h4>Soporte</h4>
                    <ul>
                        <li><a href="#">Centro de Ayuda</a></li>
                        <li><a href="#">Contacto</a></li>
                        <li><a href="#">Comunidad</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-landing-bottom">
                <div className="container bottom-container">
                     <p>© 2025 Quizzy. Todos los derechos reservados.</p>
                    <div className="legal-links">
                        <a href="#">Privacidad</a>
                        <a href="#">Términos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}