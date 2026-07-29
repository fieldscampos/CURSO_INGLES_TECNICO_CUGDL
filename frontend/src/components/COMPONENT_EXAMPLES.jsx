/**
 * EJEMPLOS DE EXTENSIÓN DE COMPONENTES
 * 
 * Este archivo muestra patrones para extender y personalizar
 * los componentes de la landing page.
 */

// ============================================================================
// EJEMPLO 1: Crear un componente FeatureCard reutilizable
// ============================================================================

export function FeatureCard({ icon, title, description, onClick, highlighted }) {
  return (
    <div 
      className={`feature-card ${highlighted ? 'featured' : ''}`}
      onClick={onClick}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// Uso:
// <FeatureCard 
//   icon="🎯" 
//   title="Enfoque Práctico" 
//   description="Aprende construyendo..."
//   highlighted
// />

// ============================================================================
// EJEMPLO 2: Crear sección de preguntas frecuentes (FAQ)
// ============================================================================

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: '¿Cuál es el horario del curso?',
    answer: 'Las clases son en vivo, lunes a viernes de 19:00 a 21:00 CST. También tendrás acceso a grabaciones.'
  },
  {
    question: '¿Necesito experiencia previa?',
    answer: 'No, está diseñado para principiantes absolutos. Solo necesitas una computadora y conexión a internet.'
  },
  {
    question: '¿Qué incluye la certificación?',
    answer: 'Certificado oficial de GDG reconocido a nivel internacional. Puedes compartirlo en LinkedIn y CV.'
  },
  // ... más preguntas
];

export function FAQSection() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <h2>Preguntas Frecuentes</h2>
        </div>
        
        <div className="faq-grid">
          {FAQ_ITEMS.map((item, idx) => (
            <div 
              key={idx}
              className={`faq-item ${expanded === idx ? 'expanded' : ''}`}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div className="faq-question">
                <h4>{item.question}</h4>
                <span className="faq-toggle">+</span>
              </div>
              {expanded === idx && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CSS a agregar en landing.css:
/*
.faq-section {
  padding: var(--space-4xl) var(--space-lg);
  background: var(--bg-primary);
}

.faq-grid {
  display: grid;
  gap: var(--space-md);
  max-width: 700px;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  cursor: pointer;
  transition: all var(--transition-base);
}

.faq-item:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.faq-item.expanded {
  background: var(--primary-bg);
  border-color: var(--primary);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.faq-toggle {
  font-size: 24px;
  color: var(--primary);
  transition: transform var(--transition-base);
}

.faq-item.expanded .faq-toggle {
  transform: rotate(45deg);
}

.faq-answer {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid rgba(36, 99, 235, 0.2);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 300px;
  }
}
*/

// ============================================================================
// EJEMPLO 3: Sección de instructores/mentores
// ============================================================================

const INSTRUCTORS = [
  {
    name: 'Juan Pérez',
    role: 'Lead Instructor',
    bio: 'Backend Engineer en Google, 10+ años en Python',
    avatar: '👨‍🏫',
    specialties: ['Python', 'Flask', 'PostgreSQL']
  },
  {
    name: 'María López',
    role: 'Co-Instructor',
    bio: 'Full Stack Developer, especialista en web apps',
    avatar: '👩‍🏫',
    specialties: ['Frontend', 'REST APIs', 'Testing']
  },
];

export function InstructorsSection() {
  return (
    <section className="instructors-section">
      <div className="container">
        <div className="section-header">
          <h2>Conoce a Nuestros Instructores</h2>
          <p>Aprende de profesionales con experiencia en la industria</p>
        </div>

        <div className="instructors-grid">
          {INSTRUCTORS.map((instructor, idx) => (
            <div key={idx} className="instructor-card">
              <div className="instructor-avatar">{instructor.avatar}</div>
              <h3>{instructor.name}</h3>
              <p className="instructor-role">{instructor.role}</p>
              <p className="instructor-bio">{instructor.bio}</p>
              <div className="instructor-badges">
                {instructor.specialties.map((skill, sidx) => (
                  <span key={sidx} className="badge">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EJEMPLO 4: Componente contador interactivo
// ============================================================================

import { useEffect, useState } from 'react';

export function CountUpNumber({ target, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="count-item">
      <div className="count-number">{count}+</div>
      <div className="count-label">{label}</div>
    </div>
  );
}

// Uso en benefits-stats:
// <CountUpNumber target={98} label="Satisfacción %" />
// <CountUpNumber target={500} label="Egresados" />

// ============================================================================
// EJEMPLO 5: Modal para video de presentación
// ============================================================================

export function VideoModal({ isOpen, onClose, videoId }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="video-container">
          <iframe
            width="100%"
            height="600"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Introducción al Curso"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

// CSS para modal:
/*
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  box-shadow: var(--shadow-lg);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-base);
}

.modal-close:hover {
  background: white;
  transform: rotate(90deg);
}
*/

// ============================================================================
// EJEMPLO 6: Newsletter subscription form
// ============================================================================

import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Enviar a API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <h3>Mantente Actualizado</h3>
          <p>Recibe noticias, tips de Python y descuentos exclusivos</p>
          
          {submitted ? (
            <p className="success-message">✓ ¡Gracias por suscribirte!</p>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Suscribirse
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EJEMPLO 7: Breadcrumb navigation
// ============================================================================

export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, idx) => (
        <span key={idx}>
          {idx > 0 && <span className="separator">/</span>}
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Uso:
// <Breadcrumb items={[
//   { label: 'Home', href: '/' },
//   { label: 'Cursos', href: '/courses' },
//   { label: 'Python' }
// ]} />

export default {
  FeatureCard,
  FAQSection,
  InstructorsSection,
  CountUpNumber,
  VideoModal,
  NewsletterSection,
  Breadcrumb
};
