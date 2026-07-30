import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BookIcon,
  BriefcaseIcon,
  CheckIcon,
  ClockIcon,
  GlobeIcon,
  LightbulbIcon,
  UsersIcon,
} from '../utils/icons';

const PILLARS = [
  {
    icon: GlobeIcon,
    title: 'Ingles para situaciones tech reales',
    description:
      'Practica frases y vocabulario para reuniones, tickets, documentacion, demos y colaboracion diaria.',
  },
  {
    icon: UsersIcon,
    title: 'Pensado para quienes van empezando',
    description:
      'Dirigido a estudiantes que aun no hablan ingles con soltura y quieren empezar a conversar con mas confianza.',
  },
  {
    icon: BriefcaseIcon,
    title: 'En colaboracion con growmo.tech',
    description:
      'La informacion del pre-registro ayudara al equipo a construir el ritmo y contenido semana por semana.',
  },
];

const OUTCOMES = [
  'Presentarte y hablar de tu perfil tecnico con mas claridad.',
  'Entender mejor conversaciones basicas de trabajo en tecnologia.',
  'Hacer preguntas, pedir ayuda y explicar avances en ingles simple.',
  'Tomar confianza para seguir practicando ingles tecnico fuera del curso.',
];

const MODULES = [
  'Semana 1: bases de conversacion y vocabulario tech esencial.',
  'Semana 2: hablar de tareas, herramientas, roles y procesos.',
  'Semana 3: reuniones, dudas, bloqueos y colaboracion diaria.',
  'Semana 4: documentacion, mensajes y contexto profesional.',
  'Semana 5: practica guiada para conversaciones reales.',
];

export default function TechnicalEnglishLandingPage() {
  return (
    <main className="landing-page english-page">
      <section className="english-hero">
        <div className="container english-hero-grid">
          <div className="english-copy">
            <span className="english-eyebrow">CUGDL x growmo.tech</span>
            <h1>
              Curso intensivo de <span>Ingles tecnico</span> para empezar a conversar
            </h1>
            <p className="english-lead">
              Un curso intensivo de 5 semanas para estudiantes que quieren comenzar a usar ingles
              en contextos de tecnologia, aun si hoy sienten que parten desde cero.
            </p>

            <div className="pills-row">
              <span className="pill">
                <ClockIcon size="sm" />
                5 semanas
              </span>
              <span className="pill">
                <UsersIcon size="sm" />
                Practica guiada
              </span>
              <span className="pill">
                <LightbulbIcon size="sm" />
                Enfoque conversacional tech
              </span>
            </div>

            <div className="english-actions">
              <Link to="/preregistro" className="btn btn-primary btn-large">
                Quiero mi pre-registro
                <ArrowRightIcon size="sm" />
              </Link>
            </div>
          </div>

          <div className="english-hero-panel">
            <div className="english-panel-card">
              <div className="english-panel-top">
                <span className="english-panel-label">Formato del curso</span>
                <span className="english-panel-badge">2026</span>
              </div>
              <ul className="english-stack-list">
                <li>
                  <strong>Inicio accesible</strong>
                  <span>No necesitas hablar ingles avanzado para comenzar.</span>
                </li>
                <li>
                  <strong>Contexto tecnico</strong>
                  <span>Contenido orientado a software, producto y colaboracion.</span>
                </li>
                <li>
                  <strong>Diseno iterativo</strong>
                  <span>El pre-registro ayudara a ajustar el curso semana a semana.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="english-section">
        <div className="container">
          <div className="english-pillars-grid">
            {PILLARS.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <article key={pillar.title} className="english-card">
                  <div className="english-card-icon">
                    <IconComponent size="lg" />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="english-section english-section-alt">
        <div className="container english-two-column">
          <div className="english-card english-list-card">
            <div className="english-list-heading">
              <CheckIcon size="lg" />
              <h3>Lo que buscamos construir</h3>
            </div>
            <ul className="english-check-list">
              {OUTCOMES.map((item) => (
                <li key={item}>
                  <CheckIcon size="sm" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="english-card english-list-card">
            <div className="english-list-heading">
              <BookIcon size="lg" />
              <h3>Ruta tentativa de 5 semanas</h3>
            </div>
            <ul className="english-module-list">
              {MODULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="footer english-footer">
        <div className="container">
          <p>© 2026 CUGDL x growmo.tech. Curso intensivo de Ingles tecnico.</p>
        </div>
      </footer>
    </main>
  );
}
