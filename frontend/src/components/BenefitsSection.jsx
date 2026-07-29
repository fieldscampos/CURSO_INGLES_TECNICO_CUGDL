import { 
  TargetIcon, 
  BookIcon, 
  GlobeIcon, 
  UsersIcon, 
  CertificateIcon, 
  BriefcaseIcon 
} from '../utils/icons';

const BENEFITS = [
  {
    icon: TargetIcon,
    title: 'Enfoque Práctico',
    description: 'Aprende construyendo. Cada concepto incluye ejercicios y proyectos reales desde el día 1.'
  },
  {
    icon: BookIcon,
    title: 'Sin Requisitos Previos',
    description: 'Diseñado para principiantes. No necesitas experiencia previa en programación.'
  },
  {
    icon: GlobeIcon,
    title: 'Aplicaciones Web Modernas',
    description: 'Construye con Flask, entiende arquitecturas web y defiende tus proyectos.'
  },
  {
    icon: UsersIcon,
    title: 'Comunidad GDG',
    description: 'Aprende con otros estudiantes, crea conexiones y expande tu red de desarrolladores.'
  },
  {
    icon: CertificateIcon,
    title: 'Certificación Oficial',
    description: 'Obtén un certificado reconocido que puedas compartir en tu CV y LinkedIn.'
  },
  {
    icon: BriefcaseIcon,
    title: 'Preparación Laboral',
    description: 'Domina habilidades demandadas en la industria tech actual.'
  }
];

export default function BenefitsSection() {
  return (
    <section className="benefits-section">
      <div className="container">
        <div className="section-header">
          <h2>¿Por qué Python?</h2>
          <p>Python es el lenguaje más demandado para desarrollo web, data science y automatización</p>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map((benefit, idx) => {
            const IconComponent = benefit.icon;
            return (
              <div key={idx} className="benefit-card">
                <div className="benefit-icon">
                  <IconComponent size="lg" />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div className="benefits-stats">
          <div className="stat-item">
            <div className="stat-number"></div>
            <div className="stat-label"></div>
          </div>
          <div className="stat-item">
            <div className="stat-number"></div>
            <div className="stat-label"></div>
          </div>
          <div className="stat-item">
            <div className="stat-number"></div>
            <div className="stat-label"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
