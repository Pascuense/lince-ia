# LINCE — Design System

**Versión 2.0.0** | Sistema de Diseño Completo

---

## 1. Principios de Diseño

1. **Dark by default** — El modo oscuro es la experiencia principal, no una opción
2. **Neon clarity** — Los acentos brillantes guían la atención en fondos oscuros
3. **Motion as feedback** — Las animaciones comunican estado, no solo decoran
4. **8px discipline** — Toda medida es múltiplo de 8 (o submúltiplos de 4)
5. **Accessible first** — WCAG AA como mínimo en todos los componentes

---

## 2. Grid y Espaciado

### 2.1 Unidad Base

**Unidad base: 8px**

Toda medida de espaciado es múltiplo de 8 (o 4 para ajustes finos).

```
2xs:   2px   (ajuste fino extremo, evitar en la medida posible)
xs:    4px   (espacio mínimo entre elementos inline)
sm:    8px   (espacio entre elementos relacionados)
md:   16px   (espacio base entre componentes)
lg:   24px   (espacio entre secciones relacionadas)
xl:   32px   (espacio entre bloques de contenido)
2xl:  48px   (separación de secciones mayores)
3xl:  64px   (márgenes y padding de hero)
4xl:  96px   (separación entre secciones de página)
5xl: 128px   (padding de secciones hero en desktop)
```

### 2.2 Grid de Layout

**Mobile (< 640px):**
- Columnas: 4
- Gutter: 16px
- Margen lateral: 16px

**Tablet (640px – 1024px):**
- Columnas: 8
- Gutter: 24px
- Margen lateral: 24px

**Desktop (> 1024px):**
- Columnas: 12
- Gutter: 32px
- Margen lateral: 32px (max-width: 1280px centrado)

**Wide (> 1440px):**
- Columnas: 12
- Gutter: 40px
- Max-width: 1440px, centrado con margen auto

### 2.3 Breakpoints

```
xs:   480px   (móviles pequeños)
sm:   640px   (móviles grandes / landscape)
md:   768px   (tablets portrait)
lg:  1024px   (tablets landscape / desktop pequeño)
xl:  1280px   (desktop estándar)
2xl: 1536px   (desktop grande / 4K)
```

---

## 3. Colores

Ver [palette.json](../colors/palette.json) y [CSS_VARIABLES.css](../colors/CSS_VARIABLES.css) para la referencia completa.

### 3.1 Paleta de Tema Oscuro (Principal)

```
Background Primary:   #0A0A0A   — Fondo de página
Background Surface:   #1A1A1A   — Fondos de tarjetas y paneles
Background Elevated:  #242424   — Elementos flotantes (dropdowns, tooltips)
Background Hover:     #2A2A2A   — Estado hover en superficies
Border Default:       #333333   — Bordes de separación
Border Subtle:        #1E1E1E   — Bordes muy sutiles
Text Primary:         #FFFFFF   — Texto principal
Text Secondary:       #B0B0B0   — Texto secundario / descriptivo
Text Tertiary:        #707070   — Texto deshabilitado / placeholders
Text Inverse:         #0A0A0A   — Texto sobre fondos claros
```

### 3.2 Paleta de Marca

```
Cyan (Primary):   #00E5FF   — Elementos de marca, links, focus
Orange (Action):  #FF6B35   — CTAs, botones de acción principal
Gold (Reward):    #FFD700   — XP, monedas, logros, premium
Green (Success):  #00D084   — Confirmaciones, logros, progreso
Red (Error):      #FF3B3B   — Errores, peligros, acciones destructivas
Purple (Special): #9C27B0   — Contenido especial, badges élite
```

---

## 4. Sombras y Elevación

### 4.1 Sistema de Elevación (5 niveles)

```css
/* Nivel 0 — Sin elevación (elementos base) */
--shadow-0: none;

/* Nivel 1 — Sutil (tooltips, badges) */
--shadow-1: 0 1px 3px rgba(0, 0, 0, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.3);

/* Nivel 2 — Tarjetas (cards, panels) */
--shadow-2: 0 4px 6px rgba(0, 0, 0, 0.5),
            0 2px 4px rgba(0, 0, 0, 0.3);

/* Nivel 3 — Dropdowns y popovers */
--shadow-3: 0 10px 15px rgba(0, 0, 0, 0.6),
            0 4px 6px rgba(0, 0, 0, 0.4);

/* Nivel 4 — Modales y overlays */
--shadow-4: 0 20px 25px rgba(0, 0, 0, 0.7),
            0 10px 10px rgba(0, 0, 0, 0.5);

/* Nivel 5 — Notificaciones toast (máxima elevación) */
--shadow-5: 0 25px 50px rgba(0, 0, 0, 0.8);
```

### 4.2 Sombras de Marca (Glow Effects)

```css
/* Glow Cyan — elementos de acción principal */
--glow-cyan: 0 0 20px rgba(0, 229, 255, 0.3),
             0 0 40px rgba(0, 229, 255, 0.1);

/* Glow Orange — CTAs y acciones */
--glow-orange: 0 0 20px rgba(255, 107, 53, 0.3),
               0 0 40px rgba(255, 107, 53, 0.1);

/* Glow Gold — recompensas y logros */
--glow-gold: 0 0 20px rgba(255, 215, 0, 0.4),
             0 0 40px rgba(255, 215, 0, 0.15);

/* Glow Green — éxito y progreso */
--glow-green: 0 0 20px rgba(0, 208, 132, 0.3),
              0 0 40px rgba(0, 208, 132, 0.1);
```

---

## 5. Border Radius

### 5.1 Escala de Radio

```
none:   0px    — Sin radio (tablas, bordes absolutos)
sm:     4px    — Elementos pequeños (badges, chips)
md:     8px    — Elementos de interfaz estándar (inputs, botones)
lg:    12px    — Tarjetas y paneles
xl:    16px    — Tarjetas destacadas, modales
2xl:   24px    — Elementos grandes (hero cards)
full: 9999px   — Elementos circular/píldora (avatares, pills)
```

### 5.2 Aplicación por Componente

| Componente | Radio |
|---|---|
| Botón pequeño | 6px |
| Botón regular | 8px |
| Botón grande | 10px |
| Botón píldora | 9999px |
| Input | 8px |
| Card estándar | 12px |
| Card destacada | 16px |
| Modal | 16px |
| Badge/Chip | 4px |
| Pill/Tag | 9999px |
| Avatar | 9999px (circular) |
| Tooltip | 6px |
| Dropdown | 8px |

---

## 6. Animaciones y Transiciones

### 6.1 Duraciones Estándar

```
instant:  0ms    — Sin animación (reducir movimiento)
fast:    100ms   — Tooltips, microinteracciones
normal:  200ms   — Transiciones de estado (hover, focus)
moderate: 300ms  — Aparición de elementos, color transitions
slow:    500ms   — Animaciones de entrada de componentes
slower:  800ms   — Animaciones complejas (level-up, celebración)
```

### 6.2 Curvas de Easing

```css
/* Para elementos que aparecen (ease-out: empieza rápido, termina suave) */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1.0);

/* Para elementos que desaparecen (ease-in: empieza suave, termina rápido) */
--ease-in: cubic-bezier(0.4, 0.0, 1.0, 1.0);

/* Para transiciones de estado (ease-in-out: equilibrado) */
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1.0);

/* Para efectos de rebote (spring-like) */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1.0);

/* Para movimientos lineales (progress bars) */
--ease-linear: linear;
```

### 6.3 Animaciones de Sistema

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Fade In Up (entrada de componentes) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* Scale In (aparición de modales y popovers) */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1);    }
}

/* Slide In Right (toasts, notificaciones) */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0);    }
}

/* Pulse Glow (llamadas a la acción) */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4); }
  50%       { box-shadow: 0 0 20px 8px rgba(0, 229, 255, 0.1); }
}

/* Level Up (celebración de nivel) */
@keyframes levelUp {
  0%   { transform: scale(1);    filter: brightness(1);   }
  25%  { transform: scale(1.1);  filter: brightness(1.3); }
  50%  { transform: scale(0.95); filter: brightness(1.1); }
  75%  { transform: scale(1.05); filter: brightness(1.2); }
  100% { transform: scale(1);    filter: brightness(1);   }
}

/* XP Gain (contador de XP) */
@keyframes xpGain {
  0%   { opacity: 1; transform: translateY(0);    }
  100% { opacity: 0; transform: translateY(-32px); }
}

/* Streak Fire (racha activa) */
@keyframes streakFire {
  0%, 100% { transform: scale(1) rotate(-2deg);  }
  50%       { transform: scale(1.1) rotate(2deg); }
}
```

### 6.4 Preferencias de Accesibilidad

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Accesibilidad (WCAG AA)

### 7.1 Contraste de Color

Todas las combinaciones de texto/fondo deben cumplir:
- **Texto normal (< 18px o < 14px bold):** mínimo 4.5:1
- **Texto grande (≥ 18px o ≥ 14px bold):** mínimo 3:1
- **Componentes UI y gráficos:** mínimo 3:1

### 7.2 Focus Visible

```css
:focus-visible {
  outline: 2px solid #00E5FF;
  outline-offset: 2px;
  border-radius: 4px;
}
```

Nunca eliminar el outline de focus sin reemplazarlo por una alternativa visible.

### 7.3 Tamaño de Toque (Touch Targets)

- Mínimo **44x44px** para elementos táctiles (botones, links, checkboxes)
- Mínimo **48x48px** recomendado para iconos standalone en mobile

### 7.4 Texto Alternativo

- Todas las imágenes decorativas: `alt=""`
- Todas las imágenes informativas: descripción concisa en `alt`
- Iconos con significado: `aria-label` o texto oculto visualmente (`.sr-only`)

### 7.5 Estructura Semántica

- Un solo `<h1>` por página
- Jerarquía de headings sin saltar niveles
- Landmarks HTML5: `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`
- Listas con `<ul>` / `<ol>`, no `<div>` con bullets visuales

---

## 8. Tokens de Diseño

Los tokens de diseño están disponibles en tres formatos:

| Formato | Archivo | Uso |
|---|---|---|
| CSS Custom Properties | [CSS_VARIABLES.css](../colors/CSS_VARIABLES.css) | Aplicaciones web |
| JSON | [palette.json](../colors/palette.json) | Tools de diseño, scripts |
| Tailwind Extension | [palette-tailwind.js](../colors/palette-tailwind.js) | Proyectos Tailwind |
| Tailwind Config Full | [tailwind.config.extension.js](../../tailwind.config.extension.js) | Integración completa |
