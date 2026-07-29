# 🚀 Quick Start - Landing Page v2.0

## 📍 Estructura Actual

```
src/pages/LandingPage.jsx
├── HeroSection          (Hero impactante con logos)
├── BenefitsSection      (¿Por qué Python?)
├── RequirementsSection  (Lo que Lograrás - 6 outcomes)
├── CurriculumSection    (5 semanas expandibles)
├── CTABanner            (¿Listo para tu transformación?)
└── Footer               (Legal)
```

## 🎯 Enfoque

**Pre-Registro Puro**: Sin testimonios, sin distracciones. Solo información clara del curso + call-to-action.

## 📊 Contenido Actual

### Hero Section
- Logos GDG × CUGDL
- Título: "De cero a construir tu primera aplicación web"
- Descripción clara
- Pills: 5 semanas | Nivel principiante | Certificación
- CTA: "Comienza tu pre-registro"

### Benefits Section
- 6 beneficios con iconos
- Estadísticas: 98% satisfacción | 500+ egresados | GDG

### Requirements Section ✨ NEW
- "Lo que Lograrás"
- 6 outcomes en grid 3 columnas:
  1. Entorno Profesional
  2. Python Sólido
  3. Manipulación de Datos
  4. Tu Web App Desplegada
  5. Flujo con IA
  6. Certificación Oficial

### Curriculum Section
- 5 semanas expandibles (accordion)
- Cada semana con tópicos detallados
- Basado en docs/ESTRUCTURA_DE_CURSO.md

### CTA Banner
- Mensaje motivante
- Botón "Iniciar Pre-Registro" prominente
- Fondo gradiente

## 🔧 Personalización Rápida

### Cambiar Color Principal (2 minutos)

Abre: `src/styles/landing.css`

Busca (línea ~22):
```css
--primary: #2463eb;
```

Cambia a tu color. ¡Listo! Aplica a todo automáticamente.

### Cambiar Contenido del Curso

**Semanas**: `src/components/CurriculumSection.jsx`
```jsx
const CURRICULUM = [
  {
    week: 'Semana 1',
    title: 'Tu título',
    subtitle: 'Tu subtítulo',
    topics: [
      'Tópico 1',
      'Tópico 2',
      // ...
    ]
  },
  // ...
];
```

**Beneficios**: `src/components/BenefitsSection.jsx`
```jsx
const BENEFITS = [
  {
    icon: '🎯',
    title: 'Tu título',
    description: 'Tu descripción'
  },
  // ...
];
```

**Outcomes**: `src/components/RequirementsSection.jsx`
```jsx
const outcomes = [
  {
    icon: '⚙️',
    title: 'Tu título',
    desc: 'Tu descripción'
  },
  // ...
];
```

## 🎨 Tipografía Dual

- **UI/Títulos**: Inter, system-ui (sans-serif)
- **Código**: Fira Code, JetBrains Mono (monoespaciada)

## 📱 Responsive Breakpoints

```
Mobile: < 480px   (1 columna)
Tablet: 480-768px (2 columnas)
Desktop: > 768px  (3 columnas)
```

## ✨ Animaciones

- `fadeIn` - Entrada suave (CTA)
- `expandDown` - Expand del curriculum
- `hover-lift` - Cards se elevan

## 🚀 Desarrollo

```bash
# Iniciar dev server
npm run dev
# http://localhost:5173 o 5174

# Build para producción
npm run build
```

## 📦 Exportar Tokens de Diseño

Si necesitas usar los colores en otros proyectos:

```bash
# Archivo: src/styles/designTokens.js
# Contiene todos los tokens CSS exportables
```

## 🔍 Verificación Rápida

```bash
# Build
npm run build
# Revisa output: "✓ built in XXms"

# Sin errores: Listo para deploy
```

## 📞 Soporte Rápido

| Problema | Solución |
|----------|----------|
| No se ve el logo | Revisa path en HeroSection.jsx |
| Colores no cambian | Limpia caché: `npm run build` |
| Curriculum no expande | Revisa que expandedWeek es state |
| Botón no redirige | Verifica que `/login` existe |

---

**Status**: ✅ Production Ready  
**Version**: 2.0.0  
**Last Updated**: 2025-05-05
