# LINCE Brand Assets — Directory Guide

**Versión 2.0.0** | ACNB IA SL

Este directorio contiene todos los assets de identidad visual y guías de marca para la plataforma LINCE.

---

## Estructura del Directorio

```
brand/
├── logos/                          # Assets del logo oficial
│   ├── lince-logo-full.svg         # Logo completo horizontal (uso principal)
│   ├── lince-logo-icon.svg         # Solo isotipo cuadrado (favicon, app)
│   ├── lince-logo-dark.svg         # Versión para fondos oscuros
│   ├── lince-logo-light.svg        # Versión para fondos claros
│   └── lince-logo-mono.svg         # Versión monocromática (impresión)
│
├── colors/                         # Sistema de colores en múltiples formatos
│   ├── palette.json                # Paleta completa en JSON (design tools)
│   ├── palette.css                 # Paleta como variables CSS de referencia
│   ├── palette-tailwind.js         # Extensión de colores para Tailwind CSS
│   └── CSS_VARIABLES.css           # Design tokens completos en CSS custom props
│
├── icons/                          # Sistema de iconos
│   ├── avatar-sabelin.svg          # Avatar SABELIN (principal)
│   ├── avatar-especialistas.svg    # Avatares Especialistas
│   ├── avatar-musicalin.svg        # Avatar MUSICALIN
│   ├── avatar-zaragoza.svg         # Avatar ZARAGOZA
│   ├── avatar-aragonesa.svg        # Avatar ARAGONESA
│   ├── avatar-ogcrew.svg           # Avatar OG CREW
│   ├── avatar-evento.svg           # Avatar EVENTO
│   ├── avatar-family.svg           # Avatar FAMILY
│   ├── avatar-musicalin-intl.svg   # Avatar MUSICALIN INTL
│   ├── ui-icons-set.svg            # Conjunto de iconos de interfaz
│   └── game-icons-set.svg          # Iconos del sistema de juego
│
├── patterns/                       # Patrones y texturas de fondo
│   ├── grid-pattern.svg            # Cuadrícula tecnológica de fondo
│   ├── gradient-meshes.svg         # Gradientes de malla para heroes
│   └── brand-textures.svg          # Texturas digitales para cards
│
└── guidelines/                     # Documentación de marca
    ├── BRAND_IDENTITY.md           # Identidad de marca completa
    ├── TYPOGRAPHY.md               # Sistema tipográfico
    ├── DESIGN_SYSTEM.md            # Sistema de diseño (grid, sombras, animaciones)
    ├── UI_COMPONENTS.md            # Biblioteca de componentes UI
    ├── LOGO_ASSETS.md              # Guía de uso del logo
    └── BRAND_VOICE.md              # Voz y comunicación de marca
```

---

## Guías de Referencia Rápida

### Colores Principales

| Color | Hex | Uso |
|---|---|---|
| Cyan (Primary) | `#00E5FF` | Color de marca, CTAs, links, focus |
| Orange (Action) | `#FF6B35` | Acciones destacadas, energía |
| Gold (Reward) | `#FFD700` | XP, logros, contenido premium |
| Success | `#00D084` | Confirmaciones, progreso |
| Error | `#FF3B3B` | Errores, acciones destructivas |
| Background | `#0A0A0A` | Fondo principal (dark) |
| Surface | `#1A1A1A` | Fondos de tarjetas |

### Tipografía Principal

| Fuente | Uso |
|---|---|
| Inter (400–800) | Toda la interfaz: headings, cuerpo, UI |
| Fira Code (400) | Código, prompts de IA, datos técnicos |

### Tokens en Otros Formatos

- **Para proyectos React/Vite con Tailwind**: `tailwind.config.extension.js` (raíz)
- **Para CSS puro**: `brand/colors/CSS_VARIABLES.css`
- **Para herramientas de diseño (Figma, etc.)**: `brand/colors/palette.json`
- **Para scripts o automatización**: `brand/colors/palette.json`

---

## Notas para Diseñadores

### Modo Oscuro por Defecto

LINCE es una plataforma **dark-first**. El modo oscuro no es una opción, es la experiencia principal. Todos los diseños deben comenzar en modo oscuro.

### Sistema de 8px

Toda medida de espaciado debe ser múltiplo de 8px (o 4px para ajustes finos). Esto garantiza consistencia visual en toda la plataforma.

### Accesibilidad WCAG AA

Todo texto sobre fondo oscuro debe cumplir un ratio de contraste mínimo de:
- **4.5:1** para texto regular (< 18px o < 14px bold)
- **3:1** para texto grande (≥ 18px o ≥ 14px bold)

### Assets en Proceso

Los archivos SVG en `brand/logos/` e `brand/icons/` son **placeholders** hasta la entrega final de los assets del equipo de diseño. Las especificaciones están documentadas en `brand/guidelines/LOGO_ASSETS.md` y `brand/guidelines/UI_COMPONENTS.md`.

---

## Notas para Desarrolladores

### Importar CSS Variables

```css
/* En client/src/index.css o archivo CSS principal */
@import '../../brand/colors/CSS_VARIABLES.css';
```

### Usar Tailwind Extension

```javascript
// En vite.config.ts o tailwind.config.js
import linceExtension from './tailwind.config.extension.js';
// Usar linceExtension.theme.extend en la configuración de Tailwind
```

### Referencia de Tokens

```css
/* Uso en componentes */
.my-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2);
  color: var(--text-primary);
}

.cta-button {
  background: var(--color-brand-cyan);
  color: var(--text-inverse);
  box-shadow: var(--glow-cyan);
}
```

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 2.0.0 | 2026 | Sistema de diseño completo, 9 avatares, design tokens multi-formato |
| 1.0.0 | 2025 | Assets iniciales de marca |
