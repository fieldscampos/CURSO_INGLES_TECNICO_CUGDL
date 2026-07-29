/**
 * SVG Icons Library - Minimalista y Plana
 * Todos los iconos son geométricos, clean y escalables
 */

// Tamaños por defecto
const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
};

/**
 * Componente base para renderizar iconos SVG
 */
export const Icon = ({ 
  name, 
  size = 'md', 
  color = 'currentColor', 
  className = '',
  ...props 
}) => {
  const sizeValue = typeof size === 'string' ? ICON_SIZES[size] : size;
  
  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-${name} ${className}`}
      {...props}
    >
      {ICON_PATHS[name]}
    </svg>
  );
};

/**
 * Iconos SVG - Paths de Feather Icons adaptados
 */
export const ICON_PATHS = {
  // ⚙️ → Engranaje / Configuración
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m5.08 0l4.24 4.24" />
    </>
  ),
  
  // 🐍 → Serpiente / Python
  snake: (
    <>
      <path d="M8 5c0-1.1.9-2 2-2s2 .9 2 2v3m0 6v3c0 1.1.9 2 2 2s2-.9 2-2v-8M6 14h12" />
      <circle cx="12" cy="9" r="1.5" />
    </>
  ),
  
  // 📊 → Gráfico / Analytics
  chart: (
    <>
      <line x1="3" y1="3" x2="3" y2="21" />
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="3" y1="15" x2="7" y2="15" />
      <line x1="8" y1="11" x2="12" y2="11" />
      <line x1="13" y1="7" x2="17" y2="7" />
      <line x1="18" y1="13" x2="21" y2="13" />
    </>
  ),
  
  // 🌐 → Globo / Web
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  
  // 🤖 → Robot / IA
  robot: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="7" y="7" width="3" height="3" />
      <rect x="14" y="7" width="3" height="3" />
      <path d="M9 15h6" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </>
  ),
  
  // 🎖️ → Certificado / Award
  award: (
    <>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8 14 12 17 16 14" />
      <line x1="12" y1="17" x2="12" y2="23" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </>
  ),
  
  // ⏱️ → Reloj / Tiempo
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  
  // 🎯 → Target / Objetivo
  target: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  
  // 📚 → Libro / Aprendizaje
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  
  // 👥 → Comunidad / Usuarios
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  
  // 📜 → Certificado / Diploma
  certificate: (
    <>
      <polyline points="21 15 16 11 2 11 7 15 7 19 17 19 17 15" />
      <polyline points="3 11 12 20 21 11" />
      <line x1="3" y1="11" x2="3" y2="19" />
      <line x1="21" y1="11" x2="21" y2="19" />
    </>
  ),
  
  // 💼 → Maletín / Trabajo
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 5V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </>
  ),
  
  // 🚀 → Cohete / Deploy
  rocket: (
    <>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </>
  ),
  
  // ✨ → Sparkle / Destacado
  sparkle: (
    <>
      <path d="M12 2C12 2 15 6 15 9s-3 7-3 7-3-4-3-7 3-7 3-7" />
      <path d="M12 9c0 0 3 3 6 3s7-3 7-3-3-3-6-3-7 3-7 3" />
      <path d="M12 9c0 0-3-3-6-3s-7 3-7 3 3 3 6 3 7-3 7-3" />
      <path d="M12 2c0 0-3 4-3 7s3 7 3 7 3-4 3-7-3-7-3-7" />
    </>
  ),
  
  // 💡 → Idea / Insight
  lightbulb: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </>
  ),
  
  // ▶️ → Play / Expandir
  chevronDown: (
    <>
      <polyline points="6 9 12 15 18 9" />
    </>
  ),
  
  // ◀️ → Collapse
  chevronUp: (
    <>
      <polyline points="18 15 12 9 6 15" />
    </>
  ),
  
  // ✓ → Checkmark
  check: (
    <>
      <polyline points="20 6 9 17 4 12" />
    </>
  ),
  
  // + → Plus
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  
  // → → Arrow
  arrowRight: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
};

/**
 * Componentes de iconos específicos pre-configurados
 */
export const SettingsIcon = (props) => <Icon name="settings" {...props} />;
export const SnakeIcon = (props) => <Icon name="snake" {...props} />;
export const ChartIcon = (props) => <Icon name="chart" {...props} />;
export const GlobeIcon = (props) => <Icon name="globe" {...props} />;
export const RobotIcon = (props) => <Icon name="robot" {...props} />;
export const AwardIcon = (props) => <Icon name="award" {...props} />;
export const ClockIcon = (props) => <Icon name="clock" {...props} />;
export const TargetIcon = (props) => <Icon name="target" {...props} />;
export const BookIcon = (props) => <Icon name="book" {...props} />;
export const UsersIcon = (props) => <Icon name="users" {...props} />;
export const CertificateIcon = (props) => <Icon name="certificate" {...props} />;
export const BriefcaseIcon = (props) => <Icon name="briefcase" {...props} />;
export const RocketIcon = (props) => <Icon name="rocket" {...props} />;
export const SparkleIcon = (props) => <Icon name="sparkle" {...props} />;
export const LightbulbIcon = (props) => <Icon name="lightbulb" {...props} />;
export const ChevronDownIcon = (props) => <Icon name="chevronDown" {...props} />;
export const ChevronUpIcon = (props) => <Icon name="chevronUp" {...props} />;
export const CheckIcon = (props) => <Icon name="check" {...props} />;
export const PlusIcon = (props) => <Icon name="plus" {...props} />;
export const ArrowRightIcon = (props) => <Icon name="arrowRight" {...props} />;

/**
 * Map de iconos por keyword para fácil búsqueda
 */
export const ICON_MAP = {
  setup: 'settings',
  config: 'settings',
  python: 'snake',
  data: 'chart',
  analytics: 'chart',
  web: 'globe',
  ai: 'robot',
  award: 'award',
  certificate: 'award',
  time: 'clock',
  duration: 'clock',
  goal: 'target',
  objective: 'target',
  learning: 'book',
  community: 'users',
  teamwork: 'users',
  certification: 'certificate',
  work: 'briefcase',
  deploy: 'rocket',
  launch: 'rocket',
};

export default Icon;
