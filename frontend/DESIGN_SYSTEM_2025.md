# 🎨 Design System - Curso Python GDG Guadalajara 2025

## Rediseño Completo: De Genérico a Auténtico

Este documento define el nuevo sistema de diseño de la landing page del curso Python GDG Guadalajara × CUGDL. El objetivo es crear una identidad visual única, memorable y genuinamente diseñada (no generada por IA).

---

## 📋 Tabla de Contenidos

1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Tipografía](#tipografía)
3. [Paleta de Colores](#paleta-de-colores)
4. [Componentes](#componentes)
5. [Animaciones](#animaciones)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Tokens CSS](#tokens-css)

---

## 🎯 Filosofía de Diseño

### Principios Fundamentales

1. **Autenticidad**: Diseño genuinamente pensado, no generado por IA
2. **Funcionalidad tech**: Inspiración en IDEs profesionales (VS Code, JetBrains, Sublime)
3. **Innovación local**: Incorporación sutil de elementos culturales mexicanos
4. **Accesibilidad**: Alto contraste, legibilidad optimizada para lectura prolongada
5. **Movimiento inteligente**: Animaciones que comunican, no distraen

### Contexto

- **Plataforma**: Landing + Sistema de pre-registro para curso intensivo
- **Público**: Estudiantes sin requisitos previos, alta motivación
- **Tono**: Profesional pero accesible, innovador pero confiable

---

## 🔤 Tipografía

### Display / Títulos: JetBrains Mono

```css
font-family: 'JetBrains Mono', monospace;
font-weight: 700;
```

- **Uso**: H1, H2, H3, Elementos enfáticos
- **Características**: Monoespaciada, personalidad técnica, legible en todos los tamaños
- **Justificación**: Comunica "desarrollador", "código", "precisión"

### Body / UI: DM Sans

```css
font-family: 'DM Sans', sans-serif;
font-weight: 400-700;
```

- **Uso**: Párrafos, UI, buttons, labels
- **Características**: Sans-serif moderno, excelente legibilidad, peso variable
- **Justificación**: Facilita lectura prolongada, aspecto contemporáneo

### Code: JetBrains Mono

```css
font-family: 'JetBrains Mono', monospace;
```

- **Uso**: Bloques de código, nombres de variables, snippets técnicos
- **Características**: Monoespaciada, sintaxis clara

### Escala Tipográfica

```css
h1: clamp(2.5rem, 7vw, 4rem)    /* Responsive, moderno */
h2: clamp(1.75rem, 5vw, 2.75rem)
h3: clamp(1.25rem, 3vw, 1.75rem)
body: 1rem (16px)
small: 0.875rem
```

---

## 🎨 Paleta de Colores

### Tema: IDE Oscura Profesional

Inspiración: Dracula, Nord, Synthwave con toque Cyberpunk

### Colores Primarios

```css
/* Fondos */
--bg-primary: #0d1117        /* Negro profundo (fondo principal) */
--bg-secondary: #161b22      /* Gris oscuro (cards, secciones) */
--bg-tertiary: #1c2128       /* Gris más claro (inputs, detalles) */

/* Texto */
--text-primary: #e6edf3      /* Blanco cálido (legible, no cegador) */
--text-secondary: #8b949e    /* Gris (body text) */
--text-muted: #6e7681        /* Gris oscuro (metadata, small text) */

/* Bordes */
--border-subtle: #30363d     /* Sutil, casi invisible */
--border-strong: #444c56     /* Visible al interactuar */
```

### Colores de Acento (Neón Vibrante)

```css
--accent-cyan: #00d9ff        /* Cyan fluorescente - Primario */
--accent-lime: #00ff41        /* Lime neón - Éxito, progreso */
--accent-magenta: #ff006e     /* Magenta vibranteFocus, atención */
--accent-orange: #ff6b35      /* Orange cálido - Contraste */
--accent-purple: #8b5cf6      /* Purple élite - Secundario */
--accent-blue: #0099ff        /* Blue intenso - Alternativo cyan */
```

### Feedback & Status

```css
--success: #3fb950      /* Verde (cumplimiento, éxito) */
--warning: #d29922      /* Amarillo (precaución) */
--danger: #f85149       /* Rojo (error, alerta) */
--info: #79c0ff         /* Azul (información) */
```

### Aplicaciones de Color

1. **Gradientes**: Siempre cyan → magenta o cyan → blue
2. **Acentos simples**: Cyan para CTAs principales
3. **Texto destacado**: Cyan o magenta (nunca ambos simultáneamente)
4. **Fondos**: Siempre fondos oscuros, grises neutrales
5. **Overlays**: Transparencia + blur para profundidad

---

## 🧩 Componentes

### 1. Hero Section

**Propósito**: Impacto inmediato, comunicación clara de valor

**Estructura**:
- Logos de organizadores (GDG + CUGDL)
- Título principal con gradiente cyan → magenta
- Descripción clara (secondary text)
- Pills/badges informativos (duración, nivel, certificación)
- CTA button destacado
- Bloque de código Visual (código ejecutable ejemplo)

**Animaciones**:
- Fade in up (entrada general)
- Slide in left (texto)
- Slide in right (código block)
- Stagger entre elementos
- Glow en botón CTA

**Grid**: 1fr 1fr (dos columnas, asimétrico en mobile)

### 2. Benefits Section

**Propósito**: Comunicar valor y diferenciadores

**Componentes**:
- Título sección + descripción
- Grid asimétrico de 6 cards
- Card con icono, título, descripción
- Stats section: 3 números clave

**Particularidades**:
- Cards con altura variada (nth-child variaciones)
- Hover effect con border-color change
- Stats con tipografía display (JetBrains Mono)

**Animaciones**:
- Fade in up escalonado
- Float up en iconos (3s infinita)
- Scale in para stats

### 3. Requirements Section

**Propósito**: Claridad sobre requisitos

**Componentes**:
- 3 cards mostrando "No se requiere", "Computadora", "Motivación"
- Border top con gradiente cyan → magenta

**Interactividad**:
- Línea horizontal superior se anima con scaleX on hover

### 4. Curriculum Section - Timeline Innovador

**Propósito**: Mostrar 5 semanas de contenido de forma visual

**Estructura Única**:
- Línea vertical central con puntos animated
- 5 cards alternadas (izquierda/derecha)
- Cada punto brilla con glow animation
- Contenido permanentemente visible (no accordion)

**Ventaja respecto a otros**:
- Timeline visual comunica progreso
- No requiere interacción (mejor UX)
- Simétrica pero asimétrica en alternancia

**Animaciones**:
- Línea central con gradiente animado
- Puntos con pulse (2s infinita)
- Cards con fade in up escalonado

### 5. CTA Section

**Propósito**: Conversión final

**Componentes**:
- Título con gradiente
- Descripción
- Button primario

**Fondo**: Gradiente sutil + radial gradients en las esquinas

### 6. Footer

**Propósito**: Información legal, minimalista

---

## ✨ Animaciones

### Entrada de Página (Staggered Reveal)

```
0ms: Fade In Up (general)
100ms: Slide In Left (texto hero)
200ms: Slide In Right (código)
...cada elemento +100ms
```

### Microinteracciones

1. **Buttons**:
   - Hover: translateY(-3px), glowEffect
   - Transition: 150ms ease-out

2. **Cards**:
   - Hover: translateY(-8px), border-color change
   - Transition: 300ms ease-out

3. **Pills**:
   - Hover: translateY(-2px), background-opacity increase
   - Transition: 150ms ease-out

4. **Iconos**:
   - Float infinita (3s ease-in-out)

### Efectos Contextuales

- **Glow**: Cyan alrededor de elementos interactivos
- **Pulse**: Puntos en timeline
- **Gradient Animate**: Líneas, backgrounds (sutilmente)

---

## 🎭 Patrones de Diseño

### Asimetría Intencional

1. **Grid no uniforme**: Algunos elementos offset vertical
2. **Tipografía variable**: Tamaños grandes en secciones clave
3. **Espacios negativos**: Amplios márgenes en secciones específicas

### Profundidad

1. **Layers**: Múltiples capas de fondo con blur
2. **Shadows**: Sombras cálidas, no frías
3. **Overlays**: Transparencia + radial gradients

### Geometría

1. **Bordes**: Sutilmente redondeados (12px típicamente)
2. **Líneas**: Gradientes en líneas principales (timeline)
3. **Patrones CSS**: Grid patterns para fondos sutiles

---

## 🔧 Tokens CSS

### Variables Raíz

```css
:root {
  /* PALETA */
  --bg-primary: #0d1117;
  --accent-cyan: #00d9ff;
  --text-primary: #e6edf3;
  
  /* TIPOGRAFÍA */
  --font-display: 'JetBrains Mono', monospace;
  --font-body: 'DM Sans', sans-serif;
  
  /* MOTION */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Convenciones

- **Colores**: `--[elemento]-[variante]`
- **Fuentes**: `--font-[tipo]`
- **Motion**: `--transition-[velocidad]`
- **Espaciado**: `--space-[tamaño]` (no usado actualmente, usar clamp())

---

## 📱 Responsive Design

### Breakpoints

```css
/* Desktop: > 1024px */
/* Tablet: 768px - 1024px */
/* Mobile: < 768px */
```

### Cambios Principales

1. **Hero**: 1fr 1fr → 1fr (mobile)
2. **Timeline**: Línea central → Línea izquierda
3. **Grid Benefits**: Auto-fit → 1fr
4. **Tipografía**: Usa clamp() para scale automático

---

## 🌙 Dark Mode Fallback

Aunque el diseño es nativamente oscuro, para navegadores con preferencia light:

```css
@media (prefers-color-scheme: light) {
  :root {
    --bg-primary: #ffffff;
    --text-primary: #0d1117;
    --accent-cyan: #0099cc;
    /* etc */
  }
}
```

---

## 📊 Inspiración de Diseño

### Referencias Profesionales

1. **JetBrains Academy**: Tipografía, layout, microinteracciones
2. **Linear**: Diseño system, asimetría inteligente
3. **Vercel**: Animaciones scroll-driven, gradientes
4. **Stripe**: Paleta oscura, profundidad visual
5. **Framer**: Microinteracciones sorprendentes

### Cultura Local (Sutil)

- Paleta inspirada en atardeceres guadalajareños
- Geometría sin ser literal (evitar clichés)
- Comunidad como valor central (no comercial)

---

## 🎯 Decisiones Clave

### ✅ POR QUÉ: JetBrains Mono

- No es system font (no genérico)
- Comunica "developer" al instante
- Personalidad distintiva
- Excelente en todos los tamaños

### ✅ POR QUÉ: Tema Oscuro

- Cultura de desarrolladores (IDEs oscuros)
- Menos fatiga visual
- Acentos neón destacan más
- Moderno y profesional

### ✅ POR QUÉ: Acentos Neón

- Visibles en fondos oscuros
- Energía y movimiento
- Tech + cyberpunk aesthetic
- No aburrido, pero profesional

### ✅ POR QUÉ: Timeline en lugar de Accordion

- Visualización clara de progreso
- Menos clics (mejor UX)
- Visualmente más interesante
- Comunica "5 semanas estructuradas"

---

## 🚀 Próximos Pasos

1. **Validar con usuarios**: A/B testing con audiencia target
2. **Optimizar performance**: Reducir animaciones en dispositivos lentos
3. **Expansión**: Aplicar system a páginas internas (login, dashboard)
4. **Accesibilidad**: WCAG AA compliance
5. **Documentación interactiva**: Storybook para componentes

---

## 📝 Notas Finales

Este design system fue creado con la intención de:

✓ Romper con patrones genéricos de IA  
✓ Crear identidad visual única y memorable  
✓ Comunicar innovación técnica + confiabilidad  
✓ Facilitar cultura de diseño genuino  
✓ Establecer base para evolución futura  

**Diseño auténtico = Producto auténtico**
