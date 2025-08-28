import './CallToAction.css'

export const CallToAction = () => {
    return (
        <section className="cta-section">
            <div className="container cta-container">
                <h2>Transforma tus Evaluaciones <span className="highlightCTA">Hoy</span></h2>
                <p className="section-description">Únete a la comunidad de educadores que están haciendo el aprendizaje más dinámico y efectivo.</p>
                <div className="cta-actions">
                    <a href="/register" className="btn btn-primary">Empezar Gratis</a>
                </div>
            </div>
        </section>
    )
}