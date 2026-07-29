import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card">
          <h2>¿Listo para cambiar tu carrera?</h2>
          <p>
            Únete a cientos de estudiantes que ya están construyendo el futuro con Python.
            Las inscripciones están abiertas.
          </p>
          
          <div className="cta-features">
            <div className="cta-feature">
              <span className="feature-icon">✓</span>
              <span>Acceso a contenido de calidad premium</span>
            </div>
            <div className="cta-feature">
              <span className="feature-icon">✓</span>
              <span>Mentoría directa de profesionales</span>
            </div>
            <div className="cta-feature">
              <span className="feature-icon">✓</span>
              <span>Comunidad de desarrolladores activa</span>
            </div>
          </div>

          <Link to="/login" className="btn btn-primary btn-lg btn-cta">
            Inscríbete ahora
            <span className="btn-arrow">→</span>
          </Link>

          <p className="cta-note">Prueba completamente gratis por 7 días. Sin tarjeta de crédito requerida.</p>
        </div>
      </div>
    </section>
  );
}
