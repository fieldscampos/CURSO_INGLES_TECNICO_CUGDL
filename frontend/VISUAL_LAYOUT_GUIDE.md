/**
 * VISUAL LAYOUT GUIDE
 * 
 * Este documento describe la estructura visual y el flujo de la landing page
 * rediseñada. Ideal para diseñadores, developers y stakeholders.
 */

export const LANDING_PAGE_STRUCTURE = {
  
  // ============================================================================
  // 1. HEADER (Sticky)
  // ============================================================================
  header: {
    height: '64px',
    background: 'white',
    components: [
      {
        name: 'Logo/Brand',
        content: '🐍 Python GDG Guadalajara',
        alignment: 'left',
        clickable: true,
        link: '/'
      },
      {
        name: 'Navigation',
        content: 'Login / Logout button',
        alignment: 'right',
        styling: 'minimal, understated'
      }
    ],
    sticky: true,
    shadow: 'subtle (xs)',
    z_index: 100
  },

  // ============================================================================
  // 2. HERO SECTION
  // ============================================================================
  hero: {
    height: 'min 600px',
    background: 'gradient(135deg, white → light-gray)',
    layout: '2 columns (desktop), 1 column (mobile)',
    columns: {
      left: {
        content_type: 'text',
        elements: [
          {
            type: 'kicker',
            text: 'CURSO DE PYTHON 2025',
            color: 'primary-blue',
            size: 'xs (13px)',
            weight: 'bold'
          },
          {
            type: 'h1',
            text: 'De cero a construir tu primera {aplicación web}',
            highlight: '{aplicación web}',
            size: '48px',
            weight: 'extrabold',
            line_height: '1.2'
          },
          {
            type: 'description',
            text: 'Intensivo de 5 semanas, práctico y orientado...',
            size: '16px',
            color: 'secondary-gray'
          },
          {
            type: 'pills',
            items: [
              '⏱️ 5 semanas',
              '🎯 Nivel principiante',
              '📜 Certificación oficial'
            ],
            spacing: 'inline with wrapping'
          },
          {
            type: 'cta-button',
            text: 'Comienza tu pre-registro →',
            color: 'primary-blue',
            size: 'large',
            hover_effect: 'lift + shadow'
          }
        ]
      },
      right: {
        content_type: 'visual',
        element: 'code-block',
        background: 'white with border',
        border_radius: 'lg',
        code: `from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "¡Bienvenido!"`,
        header: {
          title: 'app.py',
          badge: 'learning'
        }
      }
    },
    padding: 'massive (64px vertical)',
    animation: 'slide-in on load',
    background_decoration: 'floating circle gradient'
  },

  // ============================================================================
  // 3. CURRICULUM SECTION
  // ============================================================================
  curriculum: {
    height: 'auto',
    background: 'white',
    layout: 'responsive grid',
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1
    },
    section_header: {
      title: 'Plan de Estudios',
      subtitle: 'Una progresión cuidadosa desde básico hasta complejo',
      alignment: 'center',
      spacing: 'large'
    },
    cards: [
      {
        week: 1,
        title: 'Fundamentos de Python',
        icon: '🐍',
        duration: '5 días',
        state: 'collapsed by default',
        expanded_content: [
          'Variables y tipos de datos',
          'Control de flujo',
          'Funciones',
          'Estructuras de datos'
        ],
        interactive: 'click to expand',
        animation: 'expand-down'
      },
      {
        week: 2,
        title: 'POO',
        icon: '🏗️',
        // ... similar
      },
      // ... semanas 3-5
    ],
    card_styling: {
      background: 'light-gray',
      border: '1px solid subtle',
      border_radius: 'lg',
      padding: 'xl',
      hover_effect: 'lift + primary border + shadow',
      transition: 'smooth (250ms)'
    },
    padding: 'massive (64px vertical)',
    gap: 'lg (16px)'
  },

  // ============================================================================
  // 4. BENEFITS SECTION
  // ============================================================================
  benefits: {
    height: 'auto',
    background: 'gradient(180deg, light-gray → white)',
    layout: 'responsive grid',
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1
    },
    section_header: {
      title: '¿Por qué Python?',
      subtitle: 'Python es el lenguaje más demandado para...',
      alignment: 'center'
    },
    cards: [
      {
        icon: '🎯',
        title: 'Enfoque Práctico',
        description: 'Aprende construyendo...',
        hover_animation: 'lift + primary border'
      },
      {
        icon: '📚',
        title: 'Sin Requisitos Previos',
        description: 'Diseñado para principiantes...'
      },
      // ... más beneficios
    ],
    card_styling: {
      background: 'white',
      border: '1px solid border-color',
      border_radius: 'lg',
      padding: '2xl (32px)',
      text_alignment: 'center',
      icon_size: '42px',
      icon_animation: 'bounce (infinite)'
    },
    stats_section: {
      layout: 'horizontal grid',
      items: [
        { number: '98%', label: 'Tasa de Satisfacción' },
        { number: '500+', label: 'Egresados Certificados' },
        { number: 'GDG', label: 'Reconocimiento Global' }
      ],
      background: 'primary-blue bg (light)',
      border: '1px primary-blue (light)',
      border_radius: 'lg',
      padding: '2xl (32px)'
    },
    padding: 'massive (64px vertical)'
  },

  // ============================================================================
  // 5. TESTIMONIALS SECTION
  // ============================================================================
  testimonials: {
    height: 'auto',
    background: 'white',
    layout: 'responsive grid',
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1
    },
    section_header: {
      title: 'Lo que Dicen Nuestros Estudiantes',
      subtitle: 'Historias de transformación...',
      alignment: 'center'
    },
    cards: [
      {
        avatar: '👨‍💻',
        name: 'María García',
        role: 'Estudiante de Ingeniería',
        quote: '"Este curso cambió mi perspectiva..."',
        rating: '⭐⭐⭐⭐⭐',
        hover_effect: 'lift + shadow'
      }
      // ... más testimonios
    ],
    card_styling: {
      background: 'light-gray',
      border: '1px subtle',
      border_radius: 'lg',
      padding: '2xl (32px)',
      hover_animation: 'lift + primary border'
    },
    padding: 'massive (64px vertical)'
  },

  // ============================================================================
  // 6. CTA SECTION (Call To Action)
  // ============================================================================
  cta: {
    height: 'auto',
    background: 'gradient(135deg, primary-blue → primary-dark)',
    layout: 'centered single card',
    max_width: '600px',
    card: {
      background: 'rgba(white, 0.1) with backdrop-filter blur',
      border: '1px rgba(white, 0.2)',
      border_radius: 'xl (16px)',
      padding: '4xl (64px horizontal), 2xl (32px vertical)',
      elements: [
        {
          type: 'h2',
          text: '¿Listo para cambiar tu carrera?',
          color: 'white',
          size: '36px',
          weight: 'extrabold'
        },
        {
          type: 'description',
          text: 'Únete a cientos de estudiantes...',
          color: 'rgba(white, 0.9)',
          size: '16px'
        },
        {
          type: 'features_list',
          items: [
            '✓ Acceso a contenido premium',
            '✓ Mentoría de profesionales',
            '✓ Comunidad activa'
          ],
          text_alignment: 'left',
          spacing: 'md'
        },
        {
          type: 'cta-button',
          text: 'Inscríbete ahora →',
          background: 'white (inverted)',
          color: 'primary-blue',
          size: 'large',
          width: '100% max 400px'
        },
        {
          type: 'note',
          text: 'Prueba gratis por 7 días. Sin tarjeta requerida.',
          color: 'rgba(white, 0.7)',
          size: 'sm (13px)'
        }
      ]
    },
    animation: 'slide-up on scroll',
    padding: 'massive (64px vertical)'
  },

  // ============================================================================
  // 7. FOOTER
  // ============================================================================
  footer: {
    height: 'auto',
    background: 'white',
    border_top: '1px subtle',
    padding: '2xl (32px)',
    alignment: 'center',
    content: '© 2025 GDG Guadalajara × CUGDL. Todos los derechos reservados.',
    text_color: 'secondary-gray',
    text_size: '14px'
  }
};

// ============================================================================
// COLOR REFERENCE GUIDE
// ============================================================================
export const COLOR_USAGE = {
  backgrounds: {
    primary: '#ffffff',      // Main backgrounds
    secondary: '#f4f7fb',    // Section alternates
    hover: '#e8ecf2'         // Hover states
  },
  text: {
    primary: '#1f2937',      // Main text, headings
    secondary: '#6b7280',    // Descriptions, subtitles
    muted: '#9ca3af'         // Disabled, hints
  },
  accent: {
    primary: '#2463eb',      // Buttons, links
    hover: '#1a52cb',        // Hover state
    light: '#f0f6ff'         // Badge backgrounds
  }
};

// ============================================================================
// ANIMATION REFERENCE
// ============================================================================
export const ANIMATIONS = {
  entrance: [
    'slideInLeft',   // Elements from left
    'slideInRight',  // Elements from right
    'slideUp',       // Elements from bottom
    'fadeIn'         // Opacity fade
  ],
  interactive: [
    'hover-lift',    // Cards lift on hover
    'expand-down',   // Accordion expand
    'bounce',        // Icon bounce (infinite)
    'float'          // Background float (infinite)
  ],
  timing: {
    fast: '150ms',   // Quick interactions
    normal: '250ms', // Standard animations
    slow: '350ms'    // Longer animations
  }
};

// ============================================================================
// RESPONSIVE BREAKPOINTS VISUAL
// ============================================================================
export const RESPONSIVE_LAYOUT = `
Desktop (1024px+)
┌─────────────────────────────────┐
│  HEADER                         │
├─────────────────────────────────┤
│ HERO: [Text Left | Code Right]  │
├─────────────────────────────────┤
│ CURRICULUM: [Week1] [Week2] [W3]│
├─────────────────────────────────┤
│ BENEFITS: [B1] [B2] [B3]        │
│           [B4] [B5] [B6]        │
├─────────────────────────────────┤
│ TESTIMONIALS: [T1] [T2] [T3]    │
├─────────────────────────────────┤
│ CTA: [Full Width Button]        │
├─────────────────────────────────┤
│ FOOTER                          │
└─────────────────────────────────┘

Tablet (768px - 1024px)
┌─────────────────────────┐
│ HEADER (compact)        │
├─────────────────────────┤
│ HERO: [Text above Code] │
├─────────────────────────┤
│ CURRICULUM: [W1][W2]    │
│             [W3][W4]    │
│             [W5]        │
├─────────────────────────┤
│ BENEFITS: [B1] [B2]     │
│           [B3] [B4]     │
│           [B5] [B6]     │
├─────────────────────────┤
│ TESTIMONIALS: [T1]      │
│               [T2]      │
│               [T3]      │
├─────────────────────────┤
│ CTA                     │
├─────────────────────────┤
│ FOOTER                  │
└─────────────────────────┘

Mobile (<768px)
┌──────────────┐
│ HEADER       │
├──────────────┤
│ HERO: Text   │
│      Code    │
├──────────────┤
│ CURRICULUM:  │
│ Week 1       │
│ Week 2       │
│ ... etc      │
├──────────────┤
│ BENEFITS:    │
│ Benefit 1    │
│ Benefit 2    │
│ ... etc      │
├──────────────┤
│ TESTIMONIAL1 │
│ TESTIMONIAL2 │
│ TESTIMONIAL3 │
├──────────────┤
│ CTA          │
├──────────────┤
│ FOOTER       │
└──────────────┘
`;

// ============================================================================
// SPACING VISUALIZATION
// ============================================================================
export const SPACING_SCALE = {
  xs: '4px',     // ████
  sm: '8px',     // ████████
  md: '12px',    // ████████████
  lg: '16px',    // ████████████████
  xl: '24px',    // ████████████████████████
  '2xl': '32px', // ████████████████████████████████
  '3xl': '48px', // [Large spacing]
  '4xl': '64px'  // [Massive spacing - between sections]
};

// ============================================================================
// HOVER EFFECTS GUIDE
// ============================================================================
export const HOVER_EFFECTS = {
  button_primary: {
    transform: 'translateY(-2px)',
    shadow: 'elevated',
    arrow_animation: 'translateX(+3px)',
    transition: 'smooth'
  },
  card: {
    border_color: 'primary-blue',
    transform: 'translateY(-4px)',
    shadow: 'elevated',
    transition: 'smooth'
  },
  pill: {
    background: 'primary-blue',
    color: 'white',
    transform: 'translateY(-2px)',
    transition: 'smooth'
  },
  link: {
    text_decoration: 'underline',
    opacity: '0.8',
    transition: 'fast'
  }
};

export default {
  LANDING_PAGE_STRUCTURE,
  COLOR_USAGE,
  ANIMATIONS,
  RESPONSIVE_LAYOUT,
  SPACING_SCALE,
  HOVER_EFFECTS
};
