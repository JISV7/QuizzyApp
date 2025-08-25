import './Testimonials.css';

export const Testimonials = () => {
    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container testimonials-container">
                <h2>Lo que dicen los <span className="highlight">Educadores</span></h2>
                <p className="section-description">
                    Profesores y estudiantes ya están viendo los beneficios de un aprendizaje más interactivo.
                </p>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="author">
                            <div className="author-avatar">L</div>
                            <div className="author-info">
                                <h4>Lucía Fernández</h4>
                                <p>Profesora de Secundaria</p>
                            </div>
                        </div>
                        <p className="quote">"Quizzy me ahorra horas en corrección y me da una visión clara de qué temas necesitan refuerzo. Mis estudiantes están más comprometidos."</p>
                        <div className="rating">★★★★★</div>
                    </div>
                    <div className="testimonial-card">
                         <div className="author">
                            <div className="author-avatar">J</div>
                            <div className="author-info">
                                <h4>Javier Ríos</h4>
                                <p>Estudiante Universitario</p>
                            </div>
                        </div>
                        <p className="quote">"Los quizzes son rápidos y el feedback instantáneo es genial. Realmente ayuda a saber si entendiste la materia antes del examen final."</p>
                        <div className="rating">★★★★★</div>
                    </div>
                </div>
            </div>
        </section>
    )
}