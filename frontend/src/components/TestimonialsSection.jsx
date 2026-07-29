const TESTIMONIALS = [
  {
    name: 'María García',
    role: 'Estudiante de Ingeniería',
    text: 'Este curso cambió mi perspectiva sobre programación. Pasé de no saber nada a construir mi primer proyecto real en 5 semanas.',
    avatar: '👨‍💻'
  },
  {
    name: 'Carlos López',
    role: 'Emprendedor Tech',
    text: 'La estructura del curso es perfecta. Lo que me enseñaron lo aplicué inmediatamente en mi startup.',
    avatar: '👩‍💻'
  },
  {
    name: 'Ana Martínez',
    role: 'Profesional en Transición',
    text: 'No solo aprendí Python, aprendí cómo pensar como desarrollador. La comunidad de GDG fue invaluable.',
    avatar: '💼'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>Lo que Dicen Nuestros Estudiantes</h2>
          <p>Historias de transformación de personas que tomaron el curso</p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-header">
                <span className="testimonial-avatar">{testimonial.avatar}</span>
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
