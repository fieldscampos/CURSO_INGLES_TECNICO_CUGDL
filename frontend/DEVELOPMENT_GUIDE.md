# 🚀 Guía de Desarrollo - Frontend Rediseñado

## Tabla de Contenidos
1. [Quick Start](#quick-start)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Sistema de Diseño](#sistema-de-diseño)
4. [Componentes Disponibles](#componentes-disponibles)
5. [Cómo Agregar Nuevos Componentes](#cómo-agregar-nuevos-componentes)
6. [Personalización](#personalización)
7. [Performance Tips](#performance-tips)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Instalar dependencias
```bash
cd frontend
npm install
```

### Ejecutar en desarrollo
```bash
npm run dev
```
Abre `http://localhost:5173` en tu navegador.

### Build para producción
```bash
npm run build
```

---

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx                 # Header mejorado con branding
│   │   ├── HeroSection.jsx            # Sección hero principal
│   │   ├── CurriculumSection.jsx      # Currículo desplegable
│   │   ├── BenefitsSection.jsx        # Beneficios con iconos
│   │   ├── TestimonialsSection.jsx    # Testimonios de estudiantes
│   │   ├── CTASection.jsx             # Call-to-action principal
│   │   └── COMPONENT_EXAMPLES.jsx     # Ejemplos de extensión
│   ├── pages/
│   │   ├── LandingPage.jsx            # Landing page rediseñada
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── ...
│   ├── styles/
│   │   ├── global.css                 # Estilos globales minimalistas
│   │   ├── landing.css                # Estilos landing page (20KB)
│   │   └── designTokens.js            # Tokens de diseño exportables
│   ├── services/
│   ├── logos/
│   │   ├── GDG Guadalajara (1).png
│   │   └── Logos CUGDL-06.png
│   ├── App.jsx
│   └── main.jsx
├── REDESIGN_DOCUMENTATION.md          # Documentación del rediseño
├── DEVELOPMENT_GUIDE.md               # Esta guía
├── package.json
└── vite.config.js
```

---

## Sistema de Diseño

### Color Palette (CSS Variables)

```css
:root {
  /* Backgrounds */
  --bg-primary: #ffffff;       /* Fondo principal */
  --bg-secondary: #f4f7fb;     /* Fondo alternativo */
  --bg-tertiary: #e8ecf2;      /* Fondo terciario */

  /* Text */
  --text-primary: #1f2937;     /* Texto principal */
  --text-secondary: #6b7280;   /* Texto secundario */
  --text-muted: #9ca3af;       /* Texto amortiguado */

  /* Branding */
  --primary: #2463eb;          /* Azul principal */
  --primary-light: #3b7cff;    /* Azul claro */
  --primary-dark: #1a52cb;     /* Azul oscuro */
  --primary-bg: #f0f6ff;       /* Fondo azul suave */

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-4xl: 64px;
}
```

### Cambiar colores globales

Edita `/src/styles/landing.css` en la sección `:root`:

```css
:root {
  --primary: #YOUR_COLOR;       /* Cambiar color principal */
  --bg-secondary: #YOUR_COLOR;  /* Cambiar fondo */
  /* ... */
}
```

---

## Componentes Disponibles

### 1. HeroSection
**Ubicación**: `src/components/HeroSection.jsx`

```jsx
import HeroSection from '../components/HeroSection';

export default function LandingPage() {
  return <HeroSection />;
}
```

**Features**:
- Logos GDG x CUGDL integrados
- Propuesta de valor clara
- Pills con metadatos
- Bloque de código visual
- Animaciones sutiles

### 2. CurriculumSection
**Ubicación**: `src/components/CurriculumSection.jsx`

**Features**:
- 5 semanas expandibles
- Iconos por semana
- Tópicos desplegables
- Animación de expansión
- Responsivo

**Personalizar temario**:

```jsx
// En CurriculumSection.jsx, edita CURRICULUM array:
const CURRICULUM = [
  {
    week: 1,
    title: 'Tu título aquí',
    duration: '5 días',
    topics: [
      'Tópico 1',
      'Tópico 2',
      // ...
    ],
    icon: '🎯' // Cambiar emoji
  },
  // ...
];
```

### 3. BenefitsSection
**Ubicación**: `src/components/BenefitsSection.jsx`

**Features**:
- 6 tarjetas de beneficios
- Iconos grandes
- Estadísticas resaltadas
- Hover effects
- Animaciones de bounce

**Personalizar beneficios**:

```jsx
// En BenefitsSection.jsx, edita BENEFITS array:
const BENEFITS = [
  {
    icon: '🎯',
    title: 'Tu beneficio',
    description: 'Descripción del beneficio'
  },
  // ...
];
```

### 4. TestimonialsSection
**Ubicación**: `src/components/TestimonialsSection.jsx`

**Features**:
- Testimonios con avatares
- Información del estudiante
- Rating de 5 estrellas
- Responsivo

### 5. CTASection
**Ubicación**: `src/components/CTASection.jsx`

**Features**:
- Fondo gradiente azul
- Features listadas
- Botón motivador
- Nota de prueba gratuita
- Glassmorphism

### 6. Header (Mejorado)
**Ubicación**: `src/components/Header.jsx`

**Features**:
- Nuevo branding con emoji
- Estructura jerárquica
- Navegación consistente

---

## Cómo Agregar Nuevos Componentes

### Paso 1: Crear archivo del componente

```jsx
// src/components/MyNewSection.jsx

export default function MyNewSection() {
  return (
    <section className="my-section">
      <div className="container">
        {/* Contenido aquí */}
      </div>
    </section>
  );
}
```

### Paso 2: Agregar estilos en landing.css

```css
/* En landing.css, al final */
.my-section {
  padding: var(--space-4xl) var(--space-lg);
  background: var(--bg-primary);
}

.my-section .container {
  /* Estilos específicos */
}

/* Responsive */
@media (max-width: 768px) {
  .my-section {
    /* Estilos mobile */
  }
}
```

### Paso 3: Importar en LandingPage.jsx

```jsx
import MyNewSection from '../components/MyNewSection';

export default function LandingPage() {
  return (
    <main className="landing-page">
      <HeroSection />
      {/* ... otros componentes */}
      <MyNewSection /> {/* Tu nuevo componente */}
      <CTASection />
      <footer className="footer">...</footer>
    </main>
  );
}
```

---

## Personalización

### Cambiar colores del sitio

**Opción 1: CSS Variables (Recomendado)**

En `landing.css`:
```css
:root {
  --primary: #7c3aed;           /* Púrpura */
  --primary-light: #a78bfa;
  --primary-dark: #6d28d9;
  --primary-bg: #f3e8ff;
}
```

**Opción 2: Editar manualmente cada componente**

Busca y reemplaza en los archivos JSX:
- `#2463eb` → Tu color principal
- `var(--primary)` → Tu color

### Cambiar tipografía

En `landing.css`:
```css
:root {
  --font-sans: 'Poppins', sans-serif;    /* Cambiar sans-serif */
  --font-mono: 'IBM Plex Mono', monospace; /* Cambiar monoespaciada */
}
```

### Cambiar espaciado

En `landing.css`:
```css
:root {
  --space-xl: 32px;  /* De 24px a 32px */
  --space-2xl: 48px; /* De 32px a 48px */
  /* Los demás se escalan automáticamente */
}
```

### Habilitar Dark Mode

En `landing.css` al final:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f1725;
    --text-primary: #f9fafb;
    /* ... más colores oscuros */
  }
}
```

---

## Performance Tips

### 1. Optimizar imágenes
Los logos están en `src/logos/`. Considera:
- Usar WebP para navegadores modernos
- Comprimir con tools como TinyPNG
- Usar lazy loading: `loading="lazy"`

### 2. Code Splitting
React Router ya hace code splitting automático por ruta.

### 3. CSS Optimization
El archivo `landing.css` está bien optimizado (~15.59KB gzip):
- Usa CSS variables (reducen repetición)
- Las animaciones están en CSS, no JavaScript
- Media queries están organizadas al final

### 4. Bundle Analysis
```bash
npm run build
# Mira el output en terminal para tamaños
```

### 5. Metricas de Web Vitals
- **LCP**: Hero se carga rápido (sin videos bloqueantes)
- **FID**: Animaciones son CSS (cero JavaScript)
- **CLS**: Espacios definidos (sin content shift)

---

## Troubleshooting

### Las animaciones no aparecen
**Solución**: El navegador puede tener `prefers-reduced-motion` activado.
Verifica en Chrome DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion

### Los logos no cargan
**Verificar**:
1. Los archivos existen en `src/logos/`
2. Los nombres coinciden exactamente (case-sensitive)
3. La extensión es `.png`

### Los estilos se ven extraños
**Checklist**:
1. ¿Corriste `npm install`?
2. ¿Importaste `landing.css` en `main.jsx`?
3. ¿El servidor está corriendo con `npm run dev`?
4. Limpia caché: Ctrl+Shift+R (o Cmd+Shift+R en Mac)

### El componente no aparece en la página
**Verificar**:
1. ¿Lo importaste en `LandingPage.jsx`?
2. ¿Lo agregaste en el JSX (entre `<main>` y `</main>`)?
3. ¿Verificaste la consola de errores?

### Las media queries no funcionan
**Solución**: Verifica que los breakpoints estén correctos:
```css
/* Tablets */
@media (max-width: 768px) { }

/* Móviles */
@media (max-width: 480px) { }
```

---

## Recursos Útiles

- [CSS Tricks - Design Systems](https://css-tricks.com/)
- [Web.dev - Web Vitals](https://web.dev/vitals/)
- [React Documentation](https://react.dev/)
- [Tailwind Design System Reference](https://tailwindcss.com/docs/customization/colors)

## Support

Si encuentras problemas:
1. Revisa la consola de errores (F12)
2. Busca la sección correspondiente en `REDESIGN_DOCUMENTATION.md`
3. Verifica los ejemplos en `COMPONENT_EXAMPLES.jsx`
4. Contacta al equipo de GDG Guadalajara

---

**Last Updated**: 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
