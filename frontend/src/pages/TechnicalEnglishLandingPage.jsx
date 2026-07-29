import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BookIcon,
  BriefcaseIcon,
  CertificateIcon,
  CheckIcon,
  ClockIcon,
  GlobeIcon,
  LightbulbIcon,
  RocketIcon,
  UsersIcon,
} from '../utils/icons';

const PILLARS = [
  {
    icon: GlobeIcon,
    title: 'English for real tech teams',
    description:
      'Practica el vocabulario y las estructuras que sí aparecen en reuniones, tickets, demos y documentación técnica.',
  },
  {
    icon: BriefcaseIcon,
    title: 'Enfoque profesional',
    description:
      'Diseñado para estudiantes y perfiles junior que quieren participar con más seguridad en entornos laborales internacionales.',
  },
  {
    icon: LightbulbIcon,
    title: 'Aprendizaje aplicado',
    description:
      'Cada módulo aterriza el inglés en situaciones concretas: explicar bugs, hacer preguntas, documentar avances y defender ideas.',
  },
];

const OUTCOMES = [
  'Presentarte con claridad en entrevistas y llamadas técnicas.',
  'Leer documentación de producto, APIs y tickets con mejor comprensión.',
  'Escribir mensajes profesionales para Slack, email y reportes de avance.',
  'Participar en reuniones con confianza al describir problemas y soluciones.',
];

const MODULES = [
  'Technical foundations: vocabulario esencial de software, producto y colaboración.',
  'Standups and teamwork: actualizaciones de progreso, bloqueos, preguntas y seguimiento.',
  'Documentation flow: lectura y redacción de requerimientos, issues, changelogs y handoffs.',
  'Career mode: entrevistas, portafolio, CV y presencia profesional en inglés.',
];

export default function TechnicalEnglishLandingPage() {
  return (
    <main className="landing-page english-page">
      <section className="english-hero">
        <div className="container english-hero-grid">
          <div className="english-copy">
            <span className="english-eyebrow">CUGDL × growmo.tech</span>
            <h1>
              Curso Intensivo de <span>Inglés Técnico</span> para talento tech
            </h1>
            <p className="english-lead">
              Una nueva experiencia basada en este mismo proyecto, preparada para vivir con
              Supabase, Netlify y Railway igual que la original, pero enfocada en inglés
              práctico para trabajo real en tecnología.
            </p>

            <div className="pills-row">
              <span className="pill">
                <ClockIcon size="sm" />
                Intensivo por cohortes
              </span>
              <span className="pill">
                <UsersIcon size="sm" />
                Colaboración con growmo.tech
              </span>
              <span className="pill">
                <CertificateIcon size="sm" />
                Orientado a empleabilidad
              </span>
            </div>

            <div className="english-actions">
              <Link to="/preregistro" className="btn btn-primary btn-large">
                Quiero mi pre-registro
                <ArrowRightIcon size="sm" />
              </Link>
              <Link to="/registro-academico" className="btn btn-secondary btn-large">
                Acceso staff y coordinación
              </Link>
            </div>
          </div>

          <div className="english-hero-panel">
            <div className="english-panel-card">
              <div className="english-panel-top">
                <span className="english-panel-label">Live stack</span>
                <span className="english-panel-badge">ready</span>
              </div>
              <ul className="english-stack-list">
                <li>
                  <strong>Supabase</strong>
                  <span>registros, formularios, seguimiento y analítica académica</span>
                </li>
                <li>
                  <strong>Netlify</strong>
                  <span>hosting frontend y despliegue continuo</span>
                </li>
                <li>
                  <strong>Railway</strong>
                  <span>servicios backend, automatizaciones y procesos internos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="english-section">
        <div className="container">
          <div className="section-header english-section-header">
            <h2>Qué hace diferente a esta nueva página</h2>
            <p>
              Conserva la base operativa del proyecto original, pero cambia totalmente el enfoque
              de comunicación hacia inglés técnico, colaboración y crecimiento profesional.
            </p>
          </div>

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
              <RocketIcon size="lg" />
              <h3>Resultados esperados</h3>
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
              <h3>Estructura sugerida del programa</h3>
            </div>
            <ul className="english-module-list">
              {MODULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="english-cta-strip">
        <div className="container english-cta-inner">
          <div>
            <span className="english-eyebrow">Siguiente paso</span>
            <h2>Base lista para crecer hacia un proyecto completo</h2>
            <p>
              Esta landing ya posiciona la colaboración con growmo.tech y el nuevo enfoque del
              programa para que podamos seguir con formularios, backend y datos sobre la misma base.
            </p>
          </div>
          <Link to="/ingles-tecnico" className="btn btn-secondary btn-large">
            Ver landing de inglés técnico
          </Link>
        </div>
      </section>

      <footer className="footer english-footer">
        <div className="container">
          <p>© 2026 CUGDL × growmo.tech. Curso Intensivo de Inglés Técnico.</p>
        </div>
      </footer>
    </main>
  );
}
