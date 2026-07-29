/**
 * DESIGN TOKENS 2025 - Curso Python GDG Guadalajara
 * 
 * Sistema de diseño completamente renovado con:
 * - Tipografía: JetBrains Mono + DM Sans
 * - Paleta: IDE Oscura Profesional (Dracula + Synthwave)
 * - Acentos: Neón Vibrante (Cyan, Lime, Magenta)
 * 
 * Estos tokens están también como CSS Variables en landing.css
 */

// ============================================================================
// COLOR TOKENS - Paleta IDE Oscura
// ============================================================================

export const COLORS = {
  // Backgrounds - Fondos Oscuros
  BG_PRIMARY: '#0d1117',           // Negro profundo (fondo main)
  BG_SECONDARY: '#161b22',         // Gris oscuro (cards, secciones)
  BG_TERTIARY: '#1c2128',          // Gris claro (inputs, detalles)
  BG_OVERLAY: 'rgba(13, 17, 23, 0.95)',  // Para overlays

  // Text - Texto Alto Contraste
  TEXT_PRIMARY: '#e6edf3',         // Blanco cálido (principal)
  TEXT_SECONDARY: '#8b949e',       // Gris (body, descripciones)
  TEXT_MUTED: '#6e7681',           // Gris oscuro (meta, disabled)

  // Borders - Sutiles pero Definidos
  BORDER_SUBTLE: '#30363d',        // Casi invisible
  BORDER_STRONG: '#444c56',        // Visible en interacción

  // ACENTOS NEÓN - Vibrantes y Atrayentes
  ACCENT_CYAN: '#00d9ff',          // Cyan fluorescente (primario)
  ACCENT_LIME: '#00ff41',          // Lime neón (éxito)
  ACCENT_MAGENTA: '#ff006e',       // Magenta vibrante (focus)
  ACCENT_ORANGE: '#ff6b35',        // Orange cálido (contraste)
  ACCENT_PURPLE: '#8b5cf6',        // Purple élite (secundario)
  ACCENT_BLUE: '#0099ff',          // Blue intenso (alternativo)

  // Status - Feedback
  SUCCESS: '#3fb950',              // Verde (cumplimiento)
  WARNING: '#d29922',              // Amarillo (precaución)
  DANGER: '#f85149',               // Rojo (error)
  INFO: '#79c0ff',                 // Azul (información)

  // Legacy fallbacks (compatibilidad)
  PRIMARY: '#00d9ff',              // Cyan (nuevo primario)
  PRIMARY_LIGHT: '#0099ff',        // Blue (hover)
  PRIMARY_DARK: '#0077bb',         // Blue oscuro (active)
};

// ============================================================================
// TYPOGRAPHY TOKENS - Tipografía Distintiva
// ============================================================================

export const TYPOGRAPHY = {
  // Fuentes Principales
  FONT_DISPLAY: '"JetBrains Mono", monospace',        // Títulos, display
  FONT_BODY: '"DM Sans", system-ui, sans-serif',      // Body text, UI
  FONT_CODE: '"JetBrains Mono", monospace',           // Código

  // Font Sizes Responsive (usando clamp para mobile-first)
  SIZE_XS: '12px',
  SIZE_SM: '13px',
  SIZE_BASE: '14px',
  SIZE_MD: '16px',
  SIZE_LG: '18px',
  SIZE_XL: '20px',
  SIZE_2XL: '24px',
  SIZE_3XL: '28px',
  SIZE_4XL: '36px',
  SIZE_5XL: '48px',

  // Font Weights
  WEIGHT_NORMAL: 400,
  WEIGHT_MEDIUM: 500,
  WEIGHT_SEMIBOLD: 600,
  WEIGHT_BOLD: 700,
  WEIGHT_EXTRABOLD: 800,

  // Line Heights
  LINE_TIGHT: 1.2,
  LINE_NORMAL: 1.5,
  LINE_RELAXED: 1.65,
  LINE_LOOSE: 1.8,
};

// ============================================================================
// SPACING TOKENS - Escala de 4px
// ============================================================================

export const SPACING = {
  XS: '4px',       // Mínima separación
  SM: '8px',       // Pequeña
  MD: '12px',      // Media
  LG: '16px',      // Estándar
  XL: '24px',      // Grande
  '2XL': '32px',   // Muy grande
  '3XL': '48px',   // Gigante
  '4XL': '64px',   // Entre secciones
};

// ============================================================================
// BORDER RADIUS TOKENS - Sutilmente Redondeados
// ============================================================================

export const BORDER_RADIUS = {
  NONE: '0px',
  SM: '6px',       // Mínima (inputs pequeños)
  MD: '8px',       // Media (botones)
  LG: '12px',      // Grande (cards)
  XL: '16px',      // Muy grande (hero)
  FULL: '999px',   // Píldoras, avatares
};

// ============================================================================
// TRANSITION/ANIMATION TOKENS - Movimiento Inteligente
// ============================================================================

export const TRANSITIONS = {
  FAST: '150ms cubic-bezier(0.4, 0, 0.2, 1)',        // Hover rápido
  NORMAL: '300ms cubic-bezier(0.4, 0, 0.2, 1)',      // Animación estándar
  SMOOTH: '500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Suave
};

// ============================================================================
// BUTTON TOKENS - Estilos Predefinidos
// ============================================================================

export const BUTTON_STYLES = {
  PRIMARY: {
    background: 'linear-gradient(135deg, #00d9ff 0%, #0099ff 100%)',
    border: '1px solid #00d9ff',
    color: '#0d1117',
    fontSize: '14px',
    fontWeight: 700,
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
  },
  PRIMARY_LARGE: {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 700,
  },
  SECONDARY: {
    background: '#1c2128',
    border: '1px solid #8b5cf6',
    color: '#8b5cf6',
    fontSize: '14px',
    fontWeight: 600,
  },
};

// ============================================================================
// SHADOW/ELEVATION TOKENS - Profundidad
// ============================================================================

export const ELEVATIONS = {
  NONE: 'none',
  XS: '0 1px 2px rgba(0, 0, 0, 0.1)',
  SM: '0 4px 12px rgba(0, 0, 0, 0.2)',
  MD: '0 8px 24px rgba(0, 0, 0, 0.3)',
  LG: '0 16px 40px rgba(0, 0, 0, 0.4)',
  GLOW_CYAN: '0 0 20px rgba(0, 217, 255, 0.3)',
  GLOW_MAGENTA: '0 0 20px rgba(255, 0, 110, 0.3)',
};

// ============================================================================
// GRADIENTS - Combinaciones Armónicas
// ============================================================================

export const GRADIENTS = {
  CYAN_BLUE: 'linear-gradient(135deg, #00d9ff 0%, #0099ff 100%)',
  CYAN_MAGENTA: 'linear-gradient(120deg, #00d9ff 0%, #ff006e 90%)',
  PURPLE_MAGENTA: 'linear-gradient(135deg, #8b5cf6 0%, #ff006e 100%)',
  HERO_BG: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
};

// ============================================================================
// RESPONSIVE BREAKPOINTS - Mobile First
// ============================================================================

export const BREAKPOINTS = {
  MOBILE: '480px',        // Teléfonos pequeños
  MOBILE_LG: '640px',     // Teléfonos grandes
  TABLET: '768px',        // Tablets
  TABLET_LG: '1024px',    // Tablets grandes
  DESKTOP: '1280px',      // Desktop
};

// ============================================================================
// Z-INDEX TOKENS - Jerarquía Visual
// ============================================================================

export const Z_INDEX = {
  DEFAULT: 0,
  DROPDOWN: 10,
  STICKY: 50,
  FIXED: 100,
  MODAL_OVERLAY: 999,
  MODAL: 1000,
  TOOLTIP: 1100,
};

// ============================================================================
// ANIMATION KEYFRAMES - Definiciones
// ============================================================================

export const ANIMATIONS = {
  FADE_IN_UP: `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  SLIDE_IN_LEFT: `
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  GLOW: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(0, 217, 255, 0.3); }
      50% { box-shadow: 0 0 40px rgba(0, 217, 255, 0.6); }
    }
  `,
};

// ============================================================================
// EJEMPLOS DE USO
// ============================================================================

/**
 * EJEMPLO 1: Usar en estilos inline
 * 
 * <button style={{
 *   background: COLORS.ACCENT_CYAN,
 *   color: COLORS.BG_PRIMARY,
 *   padding: `${SPACING.MD} ${SPACING.LG}`,
 *   borderRadius: BORDER_RADIUS.MD,
 *   fontFamily: TYPOGRAPHY.FONT_BODY,
 *   fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
 *   transition: `all ${TRANSITIONS.FAST}`,
 * }}>
 *   Click me
 * </button>
 */

/**
 * EJEMPLO 2: Usar como CSS Variables (Recomendado)
 * 
 * // En landing.css ya están definidas como:
 * :root {
 *   --bg-primary: #0d1117;
 *   --accent-cyan: #00d9ff;
 *   --font-display: 'JetBrains Mono', monospace;
 *   // etc...
 * }
 * 
 * // En componentes:
 * .button {
 *   background: var(--accent-cyan);
 *   color: var(--bg-primary);
 * }
 */

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  TRANSITIONS,
  BUTTON_STYLES,
  ELEVATIONS,
  GRADIENTS,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATIONS,
};
