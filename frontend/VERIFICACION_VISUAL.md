# 👁️ Guía de Verificación Visual - Rediseño Landing Page 2025

Esta guía te ayudará a verificar visualmente que el rediseño está correctamente implementado.

## 🚀 Inicio Rápido

```bash
cd frontend
npm install  # (si es primera vez)
npm run dev
# Abre http://localhost:5173
```

---

## ✅ Checklist Visual por Sección

### Hero Section (Arriba de la página)

#### Tipografía
- [ ] Logo GDG + CUGDL visible en la parte superior
- [ ] Título principal grande (claro en pantalla)
- [ ] Título tiene colores: blanco → cyan → blanco (gradiente)
- [ ] Descripción en texto gris (más pequeño)
- [ ] "De cero a construir tu primera" + "aplicación web" (web en cyan)

#### Colores
- [ ] Fondo: Negro profundo (NOT blanco) - #0d1117
- [ ] Texto: Blanco cálido (no blanco puro) - #e6edf3
- [ ] Botón: Gradiente cyan→azul (NOT azul plano)

#### Pills
- [ ] 3 pills (⏱️ 5 semanas, 🎯 Nivel principiante, 📜 Certificación)
- [ ] Borders: Cyan fluorescente
- [ ] Fondo: Transparente con tint cyan
- [ ] Hover: Se elevan ligeramente

#### Botón CTA
- [ ] Texto: "Comienza tu pre-registro →"
- [ ] Gradiente: Cyan → Azul
- [ ] Glow: Brillo azul/cyan alrededor
- [ ] Hover: Se eleva, glow más intenso

#### Código Block
- [ ] Código Python visible (app.py, Flask ejemplo)
- [ ] Fondo oscuro (más oscuro que hero)
- [ ] Header: "app.py" + "learning" badge
- [ ] Border: Cyan glow
- [ ] Hover: Border se intensifica, se eleva

#### Animaciones
- [ ] Logo: Slide in desde izquierda (200ms)
- [ ] Texto: Slide in desde izquierda (300ms delay)
- [ ] Pills: Aparecen escalonadamente (200ms, 300ms, 400ms)
- [ ] Botón: Slide in desde abajo (500ms delay)
- [ ] Código: Slide in desde derecha (200ms)

---

### Benefits Section (Segunda sección)

#### Título
- [ ] "¿Por qué Python?" en grande
- [ ] Descripción debajo en gris
- [ ] Ambos centrados

#### Cards
- [ ] 6 cards en grid
- [ ] Colores: Fondo #161b22 (gris oscuro)
- [ ] Borders: Gris sutil (cambiao a cyan on hover)
- [ ] Heights: VARIABLE (algunas más altas que otras - asimetría)
- [ ] Iconos: Emoji grandes (🎯, 📚, 🌐, 👥, 📜, 💼)

#### Card Hover
- [ ] Border: Cambia a cyan (#00d9ff)
- [ ] Transform: Se eleva 8px
- [ ] Shadow: Glow azul alrededor

#### Iconos
- [ ] Animación float: Los iconos suben/bajan continuamente (3s loop)

#### Stats
- [ ] 3 números: "98%", "500+", "GDG"
- [ ] Números: Tipografía JetBrains Mono, color CYAN
- [ ] Labels: "Tasa de Satisfacción", "Egresados Certificados", "Reconocimiento Global"
- [ ] Borde arriba y abajo en gris

---

### Requirements Section (Tercera sección)

#### Cards
- [ ] 3 cards horizontales
- [ ] Contenido visible (no accordion)
- [ ] Borders: Gris sutil, cambían a cyan on hover

#### Hover Effect
- [ ] Línea SUPERIOR animada (de 0% a 100% con scaleX)
- [ ] Línea: Gradiente cyan→magenta
- [ ] Duración: 300ms

---

### Curriculum Section (Cuarta sección) - ⭐ MÁS IMPORTANTE

#### Timeline
- [ ] Línea VERTICAL en el centro
- [ ] Línea color: Gradiente cyan→purple→magenta (de arriba a abajo)
- [ ] 5 puntos en la línea (círculos pequenos)
- [ ] Puntos: Color cyan con glow

#### Puntos Animation
- [ ] Puntos: Pulse animation (se oscurecen/se clarifican, 2s loop)
- [ ] Glow: Se mantiene alrededor

#### Cards Layout
- [ ] Semana 1: Card IZQUIERDA del punto
- [ ] Semana 2: Card DERECHA del punto (alternancia)
- [ ] Semana 3: Card IZQUIERDA
- [ ] Semana 4: Card DERECHA
- [ ] Semana 5: Card IZQUIERDA

#### Card Content
- [ ] "Semana X" label: Color ORANGE (#ff6b35)
- [ ] Título de la semana
- [ ] Lista de tópicos (NO accordion, siempre visible)
- [ ] Bullets: Color LIME (#00ff41) con "→"

#### Hover
- [ ] Border: Cambía a cyan
- [ ] Transform: Se eleva 4px
- [ ] Shadow: Glow azul

---

### CTA Banner (Quinta sección)

#### Contenido
- [ ] Título: "¿Listo para tu transformación?"
- [ ] Descripción: "Únete a la próxima generación..."
- [ ] Botón: "Iniciar Pre-Registro" (gradient cyan→blue)

#### Fondo
- [ ] Gradiente sutil de arriba a abajo
- [ ] Radial gradients en esquinas (muy sutiles)
- [ ] Colores: Fondos oscuros + acentos transparentes

---

### Footer

#### Contenido
- [ ] Texto: "© 2025 GDG Guadalajara × CUGDL. Todos los derechos reservados."
- [ ] Border superior: Línea gris sutil
- [ ] Fondo: Gris oscuro

---

## 📱 Verificación Responsive

### Desktop (>1024px)
Abre DevTools (F12) y NO hagas resize

- [ ] Hero: 2 columnas (texto izquierda, código derecha)
- [ ] Benefits: 3 columnas
- [ ] Curriculum: Línea vertical central
- [ ] Tipografía: Tamaños grandes

### Tablet (768px)
DevTools: Click al icono de celular, selecciona "iPad"

- [ ] Hero: 2 columnas (puede reducirse)
- [ ] Benefits: 2-3 columnas
- [ ] Curriculum: Centrado
- [ ] Tipografía: Reducida pero legible

### Mobile (<768px)
DevTools: Click al icono de celular, selecciona "iPhone 12"

- [ ] Hero: 1 columna (stack vertical)
- [ ] Benefits: 1 columna
- [ ] Curriculum: Línea izquierda (no central)
- [ ] Padding: Generoso
- [ ] Tipografía: clamp() responsive
- [ ] Botones: Tamaño tappable (44px+)

---

## 🎨 Validación de Colores

### Abre DevTools → Elements y haz click en elementos

#### Fondos
- [ ] `--bg-primary`: #0d1117 (negro profundo)
- [ ] `--bg-secondary`: #161b22 (gris oscuro)
- [ ] `--bg-tertiary`: #1c2128 (gris claro)

#### Textos
- [ ] `--text-primary`: #e6edf3 (blanco cálido)
- [ ] `--text-secondary`: #8b949e (gris neutral)

#### Acentos
- [ ] `--accent-cyan`: #00d9ff (primario en botones)
- [ ] `--accent-magenta`: #ff006e (gradientes)
- [ ] `--accent-lime`: #00ff41 (bullets)
- [ ] `--accent-orange`: #ff6b35 (labels)

---

## ⏱️ Validación de Animaciones

### Abre DevTools → Elementos → Computado

#### Animaciones Principales
- [ ] fadeInUp: Elementos entran de abajo arriba
- [ ] slideInLeft: Texto hero entra desde izquierda
- [ ] slideInRight: Código entra desde derecha
- [ ] scaleIn: Pills aparecen con zoom
- [ ] pulse: Puntos timeline parpadean
- [ ] floatUp: Iconos benefits suben/bajan
- [ ] glow: Botones tienen halo luminoso

#### Duración
- [ ] Fast transitions: 150ms
- [ ] Normal transitions: 300ms
- [ ] Smooth transitions: 500ms

---

## 🔤 Validación de Tipografía

### Abre DevTools → Elementos → Computado → font-family

#### Display (Títulos)
- [ ] `font-family: 'JetBrains Mono', monospace`
- [ ] Aplicada a: h1, h2, h3, .kicker, .pill
- [ ] Weight: 700 (bold)

#### Body (Párrafos)
- [ ] `font-family: 'DM Sans', sans-serif`
- [ ] Aplicada a: p, .btn, label
- [ ] Weights: 400, 500, 600, 700

#### Code
- [ ] `font-family: 'JetBrains Mono', monospace`
- [ ] Aplicada a: .code-content
- [ ] Size: 0.9rem

---

## ✨ Tests Específicos

### Test 1: Hover State Botón
1. Coloca mouse sobre botón CTA
2. Verifica: Se eleva 3px
3. Verifica: Glow se intensifica
4. Verifica: Transición suave (300ms)

### Test 2: Card Benefit
1. Coloca mouse sobre cualquier card de benefits
2. Verifica: Se eleva 8px
3. Verifica: Border cambia a cyan
4. Verifica: Sombra azul alrededor

### Test 3: Responsive Pilares
1. Redimensiona a 768px
2. Verifica: Hero se adapta
3. Verifica: Grid cambia
4. Redimensiona a 480px
5. Verifica: Stack vertical

### Test 4: Dark Mode
1. DevTools → More tools → Rendering
2. Emula: prefers-color-scheme: dark
3. Verifica: Mantiene tema oscuro

### Test 5: Tipografía
1. Selecciona título: Debe ser JetBrains Mono
2. Selecciona párrafo: Debe ser DM Sans
3. Selecciona código: Debe ser JetBrains Mono

---

## 🐛 Resolución de Problemas

### "Los colores no se ven correctamente"
- [ ] Revisa DevTools → Elements → Styles
- [ ] Verifica que esté usando variables CSS (--accent-cyan, etc.)
- [ ] Verifica que global.css esté cargado

### "Las animaciones no funcionan"
- [ ] Revisa DevTools → Animations
- [ ] Verifica que landing.css esté importado en main.jsx
- [ ] Intenta: Ctrl+Shift+R (hard refresh)

### "Responsive no se ve bien"
- [ ] Revisa DevTools → Media Queries
- [ ] Verifica breakpoints en landing.css
- [ ] Intenta diferentes dispositivos (iPad, iPhone, etc.)

### "Tipografía diferente"
- [ ] Revisa DevTools → Fonts
- [ ] Verifica que Google Fonts se está cargando
- [ ] Revisa Network → Busca "googleapis" o "fonts.google.com"

---

## 📊 Comparación Visual Antes/Después

Abre BEFORE_AFTER_COMPARISON.md para ver screenshots ASCII de los cambios

---

## ✅ Checklist Final

- [ ] Todo el texto visible y legible
- [ ] Colores correctos según paleta
- [ ] Animaciones suaves y sin saltos
- [ ] Responsive en 3 tamaños (desktop, tablet, mobile)
- [ ] Tipografías aplicadas correctamente
- [ ] Sin errores en consola (F12 → Console)
- [ ] Build sin warnings

---

## 🎉 Si todo pasa el checklist

**¡Felicidades! El rediseño está correctamente implementado.**

---

**Tiempo estimado: 15-30 minutos**

