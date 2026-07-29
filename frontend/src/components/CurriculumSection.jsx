import { useState } from 'react';
import { 
  SettingsIcon, 
  SnakeIcon, 
  ChartIcon, 
  GlobeIcon, 
  RobotIcon, 
  RocketIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '../utils/icons';

const CURRICULUM = [
  {
    week: 'Semana 1',
    title: 'El Entorno Real y Primeros Pasos',
    subtitle: 'Setup & Basics',
    icon: SettingsIcon,
    topics: [
      'Instalación de Python, VS Code, Git y GitHub',
      'Tu primera línea de código: Hola Mundo',
      'Variables, tipos de datos (Strings, Integers, Floats, Booleans)',
      'Operadores y Lógica: Condicionales (if/else)',
      'Proyecto: Crea tu primer repositorio en GitHub'
    ]
  },
  {
    week: 'Semana 2',
    title: 'Estructuras y Lógica',
    subtitle: 'Core Programming',
    icon: SnakeIcon,
    topics: [
      'Estructuras de Datos: Listas y Diccionarios',
      'Iteraciones (Bucles): for y while',
      'Funciones: Creando bloques de código reutilizables',
      'Buenas prácticas: Código limpio y S.O.L.I.D.',
      'Proyecto: Construye un programa de terminal (calculadora financiera)'
    ]
  },
  {
    week: 'Semana 3',
    title: 'El Poder de los Datos',
    subtitle: 'Pandas & APIs',
    icon: ChartIcon,
    topics: [
      'Entornos virtuales (venv): Aislamiento de proyectos',
      'Librerías externas con pip',
      'Introducción a Pandas: DataFrames y Series',
      'Manipulación de datos: Lectura CSV, filtrado y limpieza',
      'Proyecto: Carga datasets reales y extrae conclusiones clave'
    ]
  },
  {
    week: 'Semana 4',
    title: 'Construyendo el Frontend',
    subtitle: 'Introducción a Streamlit',
    icon: GlobeIcon,
    topics: [
      'Transformar scripts en aplicaciones web interactivas',
      'Componentes UI: Títulos, textos, botones, sliders',
      'Conectar inputs del usuario con análisis de datos',
      'Buenas prácticas de diseño en Streamlit',
      'Proyecto: Crea tu primera web app interactiva'
    ]
  },
  {
    week: 'Semana 5',
    title: 'Deployment y Presentación',
    subtitle: 'Showcase Day',
    icon: RocketIcon,
    topics: [
      'Deploy en la nube (Streamlit Community Cloud) desde GitHub',
      'Documentación profesional (README.md)',
      'Código limpio y cómo presentar tu proyecto',
      'Cómo hablar de tu proyecto en una entrevista',
      'Evento de cierre: Showcase de todos tus proyectos'
    ]
  }
];

export default function CurriculumSection() {
  // Estado para manejar qué semana está expandida (-1 = ninguna, 0+ = semana específica)
  const [expandedWeek, setExpandedWeek] = useState(0);

  const toggleWeek = (idx) => {
    setExpandedWeek(expandedWeek === idx ? -1 : idx);
  };

  return (
    <section className="curriculum-section">
      <div className="container">
        <div className="section-header">
          <h2>Temario del Curso</h2>
          <p>5 semanas de contenido práctico diseñado para transformarte en desarrollador</p>
        </div>

        <div className="curriculum-timeline">
          {CURRICULUM.map((week, idx) => {
            const IconComponent = week.icon;
            const isExpanded = expandedWeek === idx;
            
            return (
              <div key={idx} className="curriculum-week">
                <div 
                  className="curriculum-card"
                  onClick={() => toggleWeek(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleWeek(idx);
                    }
                  }}
                >
                  <div className="curriculum-card-header">
                    <div className="curriculum-header-content">
                      <div className="curriculum-week-number">{idx + 1}</div>
                      <div className="curriculum-title-group">
                        <h3>{week.title}</h3>
                        <p className="week-subtitle">{week.subtitle}</p>
                      </div>
                    </div>
                    <div className="curriculum-icon-section">
                      <IconComponent size="lg" className="curriculum-section-icon" />
                      <div className="curriculum-toggle">
                        {isExpanded ? (
                          <ChevronUpIcon size="md" />
                        ) : (
                          <ChevronDownIcon size="md" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Topics - Se expanden/colapsan */}
                  {isExpanded && (
                    <div className="curriculum-topics-wrapper">
                      <ul className="curriculum-topics">
                        {week.topics.map((topic, topicIdx) => (
                          <li key={topicIdx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
