import { Link } from 'react-router-dom';
import CUGDLLogo from '../logos/Logos CUGDL-06.png';
import GrowmoLogo from '../logos/growmo.png';
import IndigoLogo from '../logos/indigo.png';
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
    title: 'Conversacion para equipos tech reales',
    description:
      'Practica el vocabulario y las estructuras que si aparecen en reuniones, tickets, demos y documentacion tecnica.',
  },
  {
    icon: BriefcaseIcon,
    title: 'Pensado para quienes empiezan',
    description:
      'Disenado para alumnos que aun no hablan ingles con soltura y quieren empezar a participar con mas seguridad en contextos profesionales.',
  },
  {
    icon: LightbulbIcon,
    title: 'Aprendizaje aplicado',
    description:
      'Cada modulo aterriza el ingles en situaciones concretas: explicar bugs, hacer preguntas, documentar avances y defender ideas.',
  },
];

const OUTCOMES = [
  'Presentarte con claridad en entrevistas, demos y llamadas tecnicas.',
  'Leer documentacion de producto, APIs y tickets con mejor comprension.',
  'Escribir mensajes profesionales para Slack, email y reportes de avance.',
  'Participar en conversaciones tecnicas con mas confianza al describir problemas y soluciones.',
];

const MODULES = [
  'Semana 1: bases de conversacion, presentaciones personales y vocabulario tech esencial.',
  'Semana 2: reuniones, standups, bloqueos, preguntas y seguimiento de tareas.',
  'Semana 3: lectura de documentacion, tickets, issues y mensajes de trabajo.',
  'Semana 4: explicacion de proyectos, stack, decisiones tecnicas y colaboracion.',
  'Semana 5: entrevistas, mock conversations y practica guiada para ganar soltura.',
];

export default function TechnicalEnglishLandingPage() {
  return (
    <main className="landing-page english-page">
      <section className="english-hero">
        <div className="container english-hero-grid">
          <div className="english-copy">
            <div className="english-branding">
              <div className="english-brand-primary">
                <img src={IndigoLogo} alt="Movimiento Indigo" className="english-indigo-logo" />
              </div>
              <div className="english-brand-collab">
                <img src={CUGDLLogo} alt="CUGDL" className="english-partner-logo english-partner-cugdl" />
                <span className="english-brand-separator">×</span>
                <img src={GrowmoLogo} alt="Growmo Tech" className="english-partner-logo english-partner-growmo" />
              </div>
            </div>
            <span className="english-eyebrow">CUGDL × growmo.tech</span>
            <h1>
              Curso Intensivo de <span>Ingles Tecnico</span> para empezar a conversar en tech
            </h1>
            <p className="english-lead">
              Un programa intensivo de 5 semanas para alumnos que aun no hablan ingles y
              quieren empezar a practicar ingles tecnico con mas confianza. La colaboracion
              entre CUGDL y growmo.tech esta enfocada en conversaciones reales para trabajo,
              entrevistas, documentacion y equipos de tecnologia.
            </p>

            <div className="pills-row">
              <span className="pill">
                <ClockIcon size="sm" />
                5 semanas intensivas
              </span>
              <span className="pill">
                <UsersIcon size="sm" />
                Colaboracion con growmo.tech
              </span>
              <span className="pill">
                <CertificateIcon size="sm" />
                Ingles tecnico desde cero
              </span>
            </div>

            <div className="english-actions">
              <Link to="/preregistro" className="btn btn-primary btn-large">
                Quiero mi pre-registro
                <ArrowRightIcon size="sm" />
              </Link>
              <Link to="/registro-academico" className="btn btn-secondary btn-large">
                Acceso staff y coordinacion
              </Link>
            </div>
          </div>

          <div className="english-hero-panel">
            <div className="english-panel-card">
              <div className="english-panel-top">
                <span className="english-panel-label">Enfoque del programa</span>
                <span className="english-panel-badge">5 weeks</span>
              </div>
              <ul className="english-stack-list">
                <li>
                  <strong>Speaking clubs guiados</strong>
                  <span>practica constante con otros alumnos en escenarios de tecnologia</span>
                </li>
                <li>
                  <strong>Mock interviews</strong>
                  <span>simulaciones para hablar de tu perfil, tu stack y tu experiencia</span>
                </li>
                <li>
                  <strong>Vocabulario tecnico real</strong>
                  <span>ingles usado en equipos internacionales, documentacion y colaboracion diaria</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="english-section">
        <div className="container">
          <div className="section-header english-section-header">
            <h2>Por que este curso puede destrabar a muchos alumnos</h2>
            <p>
              No esta pensado para perfeccion academica, sino para empezar a hablar, entender y
              participar mejor en contextos tech reales desde una base accesible.
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
              <h3>Lo que buscamos lograr</h3>
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
              <h3>Estructura del intensivo</h3>
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
          <p>© 2026 CUGDL × growmo.tech. Curso Intensivo de Ingles Tecnico.</p>
        </div>
      </footer>
    </main>
  );
}
