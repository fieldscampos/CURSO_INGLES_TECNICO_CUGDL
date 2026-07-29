import { 
  SettingsIcon, 
  SnakeIcon, 
  ChartIcon, 
  GlobeIcon, 
  RobotIcon, 
  AwardIcon 
} from '../utils/icons';

export default function RequirementsSection() {
  const outcomes = [
    {
      icon: SettingsIcon,
      title: 'Entorno Profesional',
      desc: 'Dominarás VS Code, Git/GitHub y entornos virtuales como lo hace un desarrollador real.'
    },
    {
      icon: SnakeIcon,
      title: 'Python Sólido',
      desc: 'Aprenderás variables, estructuras de control, funciones y lógica algorítmica desde cero.'
    },
    {
      icon: ChartIcon,
      title: 'Manipulación de Datos',
      desc: 'Trabajarás con datasets reales usando Pandas y extraerás insights valiosos.'
    },
    {
      icon: GlobeIcon,
      title: 'Tu Web App Desplegada',
      desc: 'Construirás una aplicación interactiva con Streamlit y la publicarás en la nube gratis.'
    },
    {
      icon: RobotIcon,
      title: 'Flujo con IA',
      desc: 'Integrarás asistentes de código IA (Copilot, Gemini) como los profes del 2026.'
    },
    {
      icon: AwardIcon,
      title: 'Certificación Oficial',
      desc: 'Obtendrás badge digital CUGDL × GDG Jalisco para tu LinkedIn + créditos de taller.'
    }
  ];

  return (
    <section className="requirements-section">
      <div className="container">
        <div className="section-header">
          <h2>Lo que Lograrás</h2>
          <p>Al finalizar el curso, tendrás skills reales de desarrollador profesional</p>
        </div>
        <div className="outcomes-grid">
          {outcomes.map((outcome, idx) => {
            const IconComponent = outcome.icon;
            return (
              <div key={idx} className="outcome-card">
                <div className="outcome-icon">
                  <IconComponent size="lg" />
                </div>
                <h3>{outcome.title}</h3>
                <p>{outcome.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
