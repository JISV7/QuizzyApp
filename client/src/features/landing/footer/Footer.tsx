import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="container footer-landing-container">
                {/* Columna "Acerca de" */}
                <div className="footer-landing-about">
                    <h3>Quizzy</h3>
                    <p>Creando experiencias de aprendizaje interactivas a través de quizzes dinámicos. Evalúa, aprende y compite.</p>
                </div>

                {/* Columna de Enlaces de Producto */}
                <div className="footer-landing-links">
                    <h4>Servicio</h4>
                    <ul>
                        <li><a href="#features">Características</a></li>
                        <li><a href="#how-it-works">Cómo funciona</a></li>
                        <li><a href="#testimonials">Testimonios</a></li>
                    </ul>
                </div>

                {/* Columna de Enlaces de Recursos */}
                <div className="footer-landing-links">
                    <h4>Recursos</h4>
                    <ul>
                        <li><Link to="/docs/manuals">Manual de Usuario</Link></li>
                        <li><Link to="/docs/contact">Contacto</Link></li>
                        <li><Link to="/docs/status">Estado del Sistema</Link></li>
                    </ul>
                </div>

                {/* Columna de Enlaces Legales */}
                <div className="footer-landing-links">
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="/docs/terms">Términos del Servicio</Link></li>
                        <li><Link to="/docs/privacy">Política de Privacidad</Link></li>
                        <li><Link to="/docs/security">Seguridad</Link></li>
                    </ul>
                </div>
            </div>

            {/* Barra inferior del footer */}
            <div className="footer-landing-bottom">
                <div className="container bottom-container">
                     <p>© 2025 Quizzy. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}