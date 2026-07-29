# 🧩 Ejemplos de Componentes - Usando Design Tokens

Este archivo muestra cómo crear nuevos componentes siguiendo el design system.

---

## 📖 Índice

1. [Método 1: CSS Variables (Recomendado)](#método-1-css-variables-recomendado)
2. [Método 2: Import designTokens.js](#método-2-import-designtokensjs)
3. [Método 3: Inline Styles](#método-3-inline-styles)
4. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Método 1: CSS Variables (Recomendado) ⭐

### ✅ Ventajas
- Dinámico (cambiar variables en :root aplica globalmente)
- Performant (sin JavaScript)
- Fácil mantenimiento
- Respeta el design system

### Ejemplo: Card Personalizado

```jsx
// Archivo: src/components/CustomCard.jsx
export function CustomCard({ title, description, icon }) {
  return (
    <div className="custom-card">
      <div className="custom-card__icon">{icon}</div>
      <h3 className="custom-card__title">{title}</h3>
      <p className="custom-card__description">{description}</p>
    </div>
  );
}
```

```css
/* Archivo: src/components/CustomCard.css */
.custom-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 24px;
  transition: all var(--transition-normal);
}

.custom-card:hover {
  border-color: var(--accent-cyan);
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 217, 255, 0.1);
}

.custom-card__icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  display: block;
  animation: floatUp 3s ease-in-out infinite;
}

.custom-card__title {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 700;
  margin-bottom: 8px;
}

.custom-card__description {
  color: var(--text-secondary);
  font-family: var(--font-body);
  line-height: 1.65;
  margin: 0;
}
```

---

## Método 2: Import designTokens.js

### ✅ Ventajas
- Tipo-seguro (TypeScript-friendly)
- Completitud IDE
- Reutilizable en lógica

### Ejemplo: Modal con Tokens

```jsx
// Archivo: src/components/Modal.jsx
import { COLORS, TYPOGRAPHY, TRANSITIONS, SPACING } from '@/styles/designTokens.js';

export function Modal({ title, children, onClose }) {
  return (
    <div 
      className="modal-overlay"
      style={{
        backgroundColor: COLORS.BG_OVERLAY,
      }}
      onClick={onClose}
    >
      <div 
        className="modal-content"
        style={{
          background: COLORS.BG_PRIMARY,
          border: `1px solid ${COLORS.BORDER_SUBTLE}`,
          borderRadius: '12px',
          padding: SPACING.XL,
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 
          style={{
            fontFamily: TYPOGRAPHY.FONT_DISPLAY,
            fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
            color: COLORS.TEXT_PRIMARY,
            marginBottom: SPACING.LG,
          }}
        >
          {title}
        </h2>
        
        {children}
        
        <button 
          onClick={onClose}
          style={{
            background: COLORS.ACCENT_CYAN,
            color: COLORS.BG_PRIMARY,
            border: 'none',
            padding: `${SPACING.MD} ${SPACING.LG}`,
            borderRadius: '8px',
            fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
            cursor: 'pointer',
            transition: TRANSITIONS.FAST,
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
```

---

## Método 3: Inline Styles

### ⚠️ Usar solo cuando CSS es insuficiente

```jsx
// Archivo: src/components/Badge.jsx
import { COLORS, TYPOGRAPHY } from '@/styles/designTokens.js';

export function Badge({ text, variant = 'cyan' }) {
  const colorMap = {
    cyan: { bg: COLORS.ACCENT_CYAN, text: COLORS.BG_PRIMARY },
    magenta: { bg: COLORS.ACCENT_MAGENTA, text: COLORS.BG_PRIMARY },
    lime: { bg: COLORS.ACCENT_LIME, text: COLORS.BG_PRIMARY },
    purple: { bg: COLORS.ACCENT_PURPLE, text: COLORS.TEXT_PRIMARY },
  };

  const color = colorMap[variant] || colorMap.cyan;

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: color.bg,
        color: color.text,
        padding: '6px 12px',
        borderRadius: '999px',
        fontFamily: TYPOGRAPHY.FONT_BODY,
        fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
        fontSize: '0.8rem',
      }}
    >
      {text}
    </span>
  );
}
```

---

## Ejemplos Prácticos

### 1. Button con Variantes

```jsx
// src/components/Button.jsx
import { COLORS, TYPOGRAPHY, TRANSITIONS } from '@/styles/designTokens.js';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) {
  const baseStyle = {
    fontFamily: TYPOGRAPHY.FONT_BODY,
    fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: `all ${TRANSITIONS.FAST}`,
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.ACCENT_CYAN} 0%, ${COLORS.ACCENT_BLUE} 100%)`,
      color: COLORS.BG_PRIMARY,
      boxShadow: `0 0 20px ${COLORS.ACCENT_CYAN}33`,
    },
    secondary: {
      background: COLORS.BG_TERTIARY,
      color: COLORS.ACCENT_PURPLE,
      border: `1px solid ${COLORS.ACCENT_PURPLE}`,
    },
    danger: {
      background: COLORS.DANGER,
      color: '#fff',
    },
  };

  const sizes = {
    sm: { padding: '8px 12px', fontSize: '0.85rem' },
    md: { padding: '12px 20px', fontSize: '0.95rem' },
    lg: { padding: '14px 28px', fontSize: '1.05rem' },
  };

  return (
    <button 
      style={{ 
        ...baseStyle, 
        ...variants[variant],
        ...sizes[size],
      }}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 2. Input con Validación

```jsx
// src/components/Input.jsx
import { COLORS, TYPOGRAPHY, TRANSITIONS } from '@/styles/designTokens.js';

export function Input({ 
  label, 
  error, 
  success,
  ...props 
}) {
  const borderColor = error ? COLORS.DANGER : success ? COLORS.SUCCESS : COLORS.BORDER_SUBTLE;
  const accentColor = error ? COLORS.DANGER : success ? COLORS.SUCCESS : COLORS.ACCENT_CYAN;

  return (
    <label style={{ display: 'block', marginBottom: '12px' }}>
      <span 
        style={{
          display: 'block',
          marginBottom: '8px',
          color: COLORS.TEXT_PRIMARY,
          fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
          fontFamily: TYPOGRAPHY.FONT_BODY,
        }}
      >
        {label}
      </span>
      
      <input
        style={{
          width: '100%',
          padding: '12px 14px',
          border: `1px solid ${borderColor}`,
          background: COLORS.BG_TERTIARY,
          color: COLORS.TEXT_PRIMARY,
          borderRadius: '8px',
          fontFamily: TYPOGRAPHY.FONT_BODY,
          transition: `all ${TRANSITIONS.FAST}`,
          boxShadow: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = accentColor;
          e.target.style.boxShadow = `0 0 12px ${accentColor}33`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = borderColor;
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      
      {error && (
        <span 
          style={{
            marginTop: '6px',
            display: 'block',
            color: COLORS.DANGER,
            fontSize: '0.85rem',
            fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
          }}
        >
          {error}
        </span>
      )}
    </label>
  );
}
```

### 3. Stat Card

```jsx
// src/components/StatCard.jsx
import { COLORS, TYPOGRAPHY } from '@/styles/designTokens.js';

export function StatCard({ label, value, unit = '' }) {
  return (
    <div 
      style={{
        textAlign: 'center',
        padding: '24px',
        background: COLORS.BG_SECONDARY,
        border: `1px solid ${COLORS.BORDER_SUBTLE}`,
        borderRadius: '12px',
      }}
    >
      <div 
        style={{
          fontFamily: TYPOGRAPHY.FONT_DISPLAY,
          fontSize: '3rem',
          fontWeight: TYPOGRAPHY.WEIGHT_EXTRABOLD,
          color: COLORS.ACCENT_CYAN,
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        {value}
        {unit && <span style={{ fontSize: '1.5rem' }}>{unit}</span>}
      </div>
      
      <div 
        style={{
          color: COLORS.TEXT_SECONDARY,
          fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
          fontSize: '0.9rem',
        }}
      >
        {label}
      </div>
    </div>
  );
}
```

### 4. Alert Component

```jsx
// src/components/Alert.jsx
import { COLORS, TYPOGRAPHY } from '@/styles/designTokens.js';

export function Alert({ type = 'info', title, message }) {
  const typeConfig = {
    info: { bg: COLORS.ACCENT_BLUE, bgLight: COLORS.BG_TERTIARY },
    success: { bg: COLORS.SUCCESS, bgLight: COLORS.BG_TERTIARY },
    warning: { bg: COLORS.WARNING, bgLight: COLORS.BG_TERTIARY },
    error: { bg: COLORS.DANGER, bgLight: COLORS.BG_TERTIARY },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div 
      style={{
        background: config.bgLight,
        border: `2px solid ${config.bg}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <div 
        style={{
          color: config.bg,
          fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
          marginBottom: '4px',
        }}
      >
        {title}
      </div>
      
      <div 
        style={{
          color: COLORS.TEXT_SECONDARY,
          fontSize: '0.9rem',
        }}
      >
        {message}
      </div>
    </div>
  );
}
```

### 5. Animated Loading

```jsx
// src/components/Loading.jsx
import { COLORS } from '@/styles/designTokens.js';

export function Loading() {
  const spinnerStyle = {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    border: `3px solid ${COLORS.BORDER_SUBTLE}`,
    borderTop: `3px solid ${COLORS.ACCENT_CYAN}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={spinnerStyle} />
    </>
  );
}
```

---

## 🎨 Paleta Rápida de Referencia

```javascript
// Colores principales disponibles
COLORS.BG_PRIMARY        // #0d1117 - Fondo principal
COLORS.BG_SECONDARY      // #161b22 - Fondo cards
COLORS.TEXT_PRIMARY      // #e6edf3 - Texto principal
COLORS.TEXT_SECONDARY    // #8b949e - Subtítulos
COLORS.ACCENT_CYAN       // #00d9ff - Primario
COLORS.ACCENT_MAGENTA    // #ff006e - Atención
COLORS.ACCENT_LIME       // #00ff41 - Éxito
COLORS.SUCCESS           // #3fb950 - Confirmación
COLORS.DANGER            // #f85149 - Error

// Tipografías
TYPOGRAPHY.FONT_DISPLAY  // JetBrains Mono
TYPOGRAPHY.FONT_BODY     // DM Sans

// Motion
TRANSITIONS.FAST         // 150ms
TRANSITIONS.NORMAL       // 300ms
TRANSITIONS.SMOOTH       // 500ms
```

---

## ✅ Checklist para Nuevos Componentes

- [ ] Usar CSS variables (método 1) siempre que sea posible
- [ ] Importar tokens desde `designTokens.js` si usas inline styles
- [ ] Respetar tipografía: `--font-display` para títulos, `--font-body` para cuerpo
- [ ] Usar acentos cyan (#00d9ff) para primarias
- [ ] Aplicar transiciones suaves (`--transition-normal`)
- [ ] Implementar hover states
- [ ] Validar contraste (WCAG AAA)
- [ ] Probar responsive (768px, 480px)
- [ ] Documentar si es componente reutilizable
- [ ] Mantener consistencia con design system

---

## 📝 Template Vacío

Copia esto para crear nuevos componentes:

```jsx
// src/components/NewComponent.jsx
import { COLORS, TYPOGRAPHY, TRANSITIONS } from '@/styles/designTokens.js';
import './NewComponent.css';

export function NewComponent({ children, ...props }) {
  return (
    <div className="new-component" {...props}>
      {children}
    </div>
  );
}
```

```css
/* src/components/NewComponent.css */
.new-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 24px;
  transition: all var(--transition-normal);
}

.new-component:hover {
  border-color: var(--accent-cyan);
  transform: translateY(-4px);
}
```

---

**¡Felicidades! Ya tienes todos los ejemplos para crear componentes consistentes con el design system. 🎉**
